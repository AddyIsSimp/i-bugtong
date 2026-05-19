import AppLoadingScreen from '@/components/AppLoadingScreen';
import { useGame } from '@/contexts/GameContext';
import { useUser } from '@/contexts/UserContext';
import NetInfo from '@react-native-community/netinfo';
import { SplashScreen } from 'expo-router';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

const MIN_LOADING_DURATION_MS = 5000;
const TOTAL_STARTUP_STEPS = 5;

interface AppStartupGateProps {
    children: ReactNode;
}

export default function AppStartupGate({ children }: AppStartupGateProps) {
    const { isHydrated: isUserHydrated, isAuthenticated, userInfo } = useUser();
    const { isHydrated: isGameHydrated, bugtongs, syncProgressFromServer } = useGame();
    const [startupReady, setStartupReady] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [message, setMessage] = useState('Starting your bugtong adventure...');
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [stepProgress, setStepProgress] = useState(0);
    const [timeProgress, setTimeProgress] = useState(0);
    const hasStartedRef = useRef(false);

    useEffect(() => {
        let isCancelled = false;
        let progressInterval: ReturnType<typeof setInterval> | null = null;

        const runStartup = async () => {
            if (!isUserHydrated || !isGameHydrated || hasStartedRef.current) {
                return;
            }

            hasStartedRef.current = true;
            const startedAt = Date.now();
            const steps: string[] = [];

            const pushStep = (step: string) => {
                steps.push(step);
                setCompletedSteps([...steps]);
                setStepProgress(Math.min(steps.length / TOTAL_STARTUP_STEPS, 1));
            };

            try {
                progressInterval = setInterval(() => {
                    const elapsed = Date.now() - startedAt;
                    setTimeProgress(Math.min(elapsed / MIN_LOADING_DURATION_MS, 1));
                }, 100);

                setMessage('Checking saved session...');
                if (isAuthenticated && userInfo.id != null) {
                    pushStep(`Logged in as ${userInfo.name}`);
                } else {
                    pushStep('No active login found');
                }

                setMessage('Detecting connection...');
                const netInfoState = await NetInfo.fetch();
                const offline = !(netInfoState.isConnected && netInfoState.isInternetReachable !== false);

                if (isCancelled) {
                    return;
                }

                setIsOffline(offline);
                pushStep(offline ? 'Offline mode enabled' : 'Online connection available');

                setMessage('Syncing cached data...');
                pushStep(
                    bugtongs.length > 0
                        ? `Loaded ${bugtongs.length} cached bugtong item${bugtongs.length === 1 ? '' : 's'}`
                        : 'No cached bugtong data found'
                );

                if (isAuthenticated && userInfo.id != null && !offline) {
                    setMessage('Preloading bugtong data...');

                    try {
                        const synced = await syncProgressFromServer(userInfo.id);

                        if (isCancelled) {
                            return;
                        }

                        pushStep(synced ? 'Bugtong progress synced from server' : 'No server progress to sync');
                    } catch {
                        if (isCancelled) {
                            return;
                        }

                        setIsOffline(true);
                        pushStep('Server sync skipped, using cached progress');
                    }
                } else if (isAuthenticated && userInfo.id != null) {
                    pushStep('Skipped server sync, using cached progress');
                } else {
                    pushStep('Ready for sign in');
                }

                pushStep('Startup complete');
            } catch {
                if (isCancelled) {
                    return;
                }

                pushStep('Startup checks finished with cached data');
            }

            const elapsed = Date.now() - startedAt;
            const remainingDelay = Math.max(0, MIN_LOADING_DURATION_MS - elapsed);

            if (remainingDelay > 0) {
                await new Promise((resolve) => setTimeout(resolve, remainingDelay));
            }

            if (isCancelled) {
                return;
            }

            if (progressInterval) {
                clearInterval(progressInterval);
            }

            setMessage('Almost ready...');
            setTimeProgress(1);
            setStepProgress(1);
            setStartupReady(true);
            SplashScreen.hideAsync().catch(() => undefined);
        };

        runStartup();

        return () => {
            isCancelled = true;
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        };
    }, [
        isAuthenticated,
        bugtongs.length,
        isGameHydrated,
        isUserHydrated,
        syncProgressFromServer,
        userInfo.id,
        userInfo.name,
    ]);

    const steps = useMemo(() => completedSteps.slice(-4), [completedSteps]);
    const progress = useMemo(() => {
        if (startupReady) {
            return 1;
        }

        return Math.min(Math.max(stepProgress, timeProgress * 0.9), 0.98);
    }, [startupReady, stepProgress, timeProgress]);

    if (!startupReady) {
        return (
            <AppLoadingScreen
                isOffline={isOffline}
                message={message}
                progress={progress}
                steps={steps}
            />
        );
    }

    return <>{children}</>;
}
