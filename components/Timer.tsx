// components/Timer.tsx
import { Text, View } from "react-native";
import { useEffect, useState, useRef } from "react";

interface TimerProps {
    initialSeconds: number;
    onTimeUp: () => void;
    isRunning: boolean;
}

export default function Timer({ initialSeconds, onTimeUp, isRunning }: TimerProps) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasTriggeredTimeUpRef = useRef(false);
    const onTimeUpRef = useRef(onTimeUp);

    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        setSeconds(initialSeconds);
        hasTriggeredTimeUpRef.current = false;
    }, [initialSeconds]);

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (isRunning && seconds > 0) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => Math.max(prev - 1, 0));
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [isRunning, seconds]);

    useEffect(() => {
        if (seconds !== 0 || hasTriggeredTimeUpRef.current) {
            return;
        }

        hasTriggeredTimeUpRef.current = true;
        onTimeUpRef.current();
    }, [seconds]);

    // Format seconds to MM:SS
    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        if (minutes > 0) {
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${remainingSeconds}s`;
    };

    // Determine color based on remaining time
    const getTimerColor = () => {
        if (seconds <= 10) return 'text-red-500';
        if (seconds <= 30) return 'text-yellow-500';
        return 'text-white';
    };

    // Don't render if timer is not running and time is 0
    if (!isRunning && seconds === 0) {
        return (
            <View className="items-end bg-red-500/70 px-4 py-1 rounded-full">
                <Text className="font-bold text-lg text-white">
                    Time&apos;s Up!
                </Text>
            </View>
        );
    }

    return (
        <View className={`items-end bg-primary/70 px-4 py-1 rounded-full ${getTimerColor()}`}>
            <Text className="font-bold text-lg text-white">
                {formatTime(seconds)}
            </Text>
        </View>
    );
}
