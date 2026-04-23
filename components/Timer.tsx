// components/Timer.tsx
import { Text, View } from "react-native";
import { useEffect, useState } from "react";

interface TimerProps {
    initialSeconds: number;
    onTimeUp: () => void;
    isRunning: boolean;
}

export default function Timer({ initialSeconds, onTimeUp, isRunning }: TimerProps) {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        setSeconds(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined; // Fix: Use ReturnType<typeof setInterval>
        
        if (isRunning && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 1) {
                        if (interval) clearInterval(interval);
                        onTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, seconds, onTimeUp]);

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

    return (
        <View className={`items-end bg-primary/70 px-4 py-1 rounded-full ${getTimerColor()}`}>
            <Text className="font-bold text-lg text-white">
                {formatTime(seconds)}
            </Text>
        </View>
    );
}