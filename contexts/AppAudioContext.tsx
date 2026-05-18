import { useAudioSettings } from '@/contexts/AudioSettingsContext';
import { useGame } from '@/contexts/GameContext';
import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { usePathname } from 'expo-router';
import React, { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';
import { Platform } from 'react-native';

interface AppAudioContextType {
    startGameSfxLoop: () => void;
    stopGameSfxLoop: () => void;
    playResultSfx: (isCorrect: boolean) => void;
}

const AppAudioContext = createContext<AppAudioContextType | undefined>(undefined);

export function AppAudioProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { isGameActive } = useGame();
    const { isHydrated, musicEnabled, sfxEnabled } = useAudioSettings();

    const backgroundMusicPlayer = useAudioPlayer(require('@/assets/sounds/music/bgMusic.mp3'));
    const gameSfxPlayer = useAudioPlayer(require('@/assets/sounds/sfx/game_soundFX.wav'));
    const correctSfxPlayer = useAudioPlayer(require('@/assets/sounds/sfx/correctFX.wav'));
    const wrongSfxPlayer = useAudioPlayer(require('@/assets/sounds/sfx/wrongFX.wav'));

    const shouldPlayBackgroundMusic = ['/play', '/codex', '/rank'].includes(pathname);

    useEffect(() => {
        const configureAudioMode = async () => {
            try {
                if (Platform.OS === 'ios') {
                    await setAudioModeAsync({
                        playsInSilentMode: true,
                        interruptionMode: 'mixWithOthers',
                        shouldPlayInBackground: false,
                        allowsRecording: false,
                    });
                    return;
                }

                await setAudioModeAsync({
                    shouldPlayInBackground: false,
                    shouldRouteThroughEarpiece: false,
                });
            } catch (error) {
                console.warn('Audio mode configuration failed:', error);
            }
        };

        void configureAudioMode();
    }, []);

    useEffect(() => {
        backgroundMusicPlayer.loop = true;
        gameSfxPlayer.loop = true;
    }, [backgroundMusicPlayer, gameSfxPlayer]);

    const resetPlayer = useCallback(async (player: AudioPlayer) => {
        player.pause();
        await player.seekTo(0);
    }, []);

    const stopBackgroundMusic = useCallback(() => {
        void resetPlayer(backgroundMusicPlayer);
    }, [backgroundMusicPlayer, resetPlayer]);

    const startBackgroundMusic = useCallback(() => {
        if (!musicEnabled) {
            stopBackgroundMusic();
            return;
        }

        void backgroundMusicPlayer.seekTo(0).then(() => {
            backgroundMusicPlayer.play();
        });
    }, [backgroundMusicPlayer, musicEnabled, stopBackgroundMusic]);

    const stopGameSfxLoop = useCallback(() => {
        void resetPlayer(gameSfxPlayer);
    }, [gameSfxPlayer, resetPlayer]);

    const startGameSfxLoop = useCallback(() => {
        if (!sfxEnabled) {
            return;
        }

        void resetPlayer(correctSfxPlayer);
        void resetPlayer(wrongSfxPlayer);
        void gameSfxPlayer.seekTo(0).then(() => {
            gameSfxPlayer.play();
        });
    }, [correctSfxPlayer, gameSfxPlayer, resetPlayer, sfxEnabled, wrongSfxPlayer]);

    const playResultSfx = useCallback((isCorrect: boolean) => {
        if (!sfxEnabled) {
            return;
        }

        void resetPlayer(gameSfxPlayer);

        const activePlayer = isCorrect ? correctSfxPlayer : wrongSfxPlayer;
        const inactivePlayer = isCorrect ? wrongSfxPlayer : correctSfxPlayer;

        void resetPlayer(inactivePlayer);
        void activePlayer.seekTo(0).then(() => {
            activePlayer.play();
        });
    }, [correctSfxPlayer, gameSfxPlayer, resetPlayer, sfxEnabled, wrongSfxPlayer]);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        if (shouldPlayBackgroundMusic) {
            startBackgroundMusic();
            return;
        }

        stopBackgroundMusic();
    }, [isHydrated, shouldPlayBackgroundMusic, startBackgroundMusic, stopBackgroundMusic]);

    useEffect(() => {
        if (!sfxEnabled) {
            void resetPlayer(gameSfxPlayer);
            void resetPlayer(correctSfxPlayer);
            void resetPlayer(wrongSfxPlayer);
            return;
        }

        if (!isGameActive) {
            void resetPlayer(gameSfxPlayer);
        }
    }, [correctSfxPlayer, gameSfxPlayer, isGameActive, resetPlayer, sfxEnabled, wrongSfxPlayer]);

    return (
        <AppAudioContext.Provider
            value={{
                startGameSfxLoop,
                stopGameSfxLoop,
                playResultSfx,
            }}
        >
            {children}
        </AppAudioContext.Provider>
    );
}

export function useAppAudio() {
    const context = useContext(AppAudioContext);

    if (!context) {
        throw new Error('useAppAudio must be used within an AppAudioProvider');
    }

    return context;
}
