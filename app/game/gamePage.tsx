// app/game/index.tsx
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import { Alert, Image, Pressable, Text, TouchableOpacity, View } from "react-native";

import CModal, { CModalRef } from '@/components/CModal';
import CaptureModal from '@/components/CaptureModal';
import ResultModal from "@/components/ResultModal";
import Timer from '@/components/Timer';
import { custom_icons } from "@/constants/custom_icons";
import { initialLevels } from "@/constants/data";
import { useGame } from '@/contexts/GameContext';
import { useUser } from "@/contexts/UserContext";
import { getNextUnsolvedBugtong } from "@/utils";

export default function GamePage() {
    //STATES
    const modalRef = useRef<CModalRef>(null);
    const [captureModalVisible, setCaptureModalVisible] = useState(false);

    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const { bugtongs, gameAssets, levels, isGameActive, setBugtongs, setIsGameActive, addDiamonds, consumeHint, consumeLife } = useGame();
    const { addPoints } = useUser();
    const [timeExpired, setTimeExpired] = useState(false);
    const [timerKey, setTimerKey] = useState(0);
    const params = useLocalSearchParams();

    // Hints state for current bugtong
    const [currentBugtong, setCurrentBugtong] = useState<BugtongProps | null>(null);
    const isSubmitting = false;
    //HELPER FUNCTIONS
    const getDifficultyString = (difficulty: number | string): string => {
        const diff = Number(difficulty);
        if (diff === 1) return 'easy';
        if (diff === 2) return 'medium';
        if (diff === 3) return 'hard';
        return 'easy';
    };

    const difficultyString = getDifficultyString(params.levelDifficulty as string);

    // Load current bugtong
    useEffect(() => {
        const bugtong = bugtongs.find((b) => b.difficulty === difficultyString && !b.solved)
            || bugtongs.find((b) => b.difficulty === difficultyString);
        if (bugtong) {
            setCurrentBugtong(bugtong);
        }
    }, [bugtongs, difficultyString]);

    useEffect(() => {
        return () => {
            // Cleanup when component unmounts (user navigates away)
            console.log('GamePage unmounting - cleaning up timer');
            setIsGameActive(false);
            setTimeExpired(false);
            // This will cause the Timer component to stop because isRunning becomes false
        };
    }, [setIsGameActive]);

    useFocusEffect(
        useCallback(() => {
            // When screen comes into focus
            return () => {
                // When screen loses focus (user navigates away)
                console.log('Screen lost focus - cleaning up timer');
                setIsGameActive(false);
                setTimeExpired(false);
            };
        }, [setIsGameActive])
    );

    // Get time from params or levels data
    const getInitialTime = (): number => {
        if (params.levelTime) {
            const timeStr = params.levelTime as string;
            if (timeStr.includes('min')) {
                return parseInt(timeStr) * 60;
            } else if (timeStr.includes('s')) {
                return parseInt(timeStr);
            }
            return parseInt(timeStr) || 60;
        }
        const level = levels.find(l => l.difficulty === parseInt(params.levelDifficulty as string))
            || initialLevels.find(l => l.difficulty === parseInt(params.levelDifficulty as string));
        return level?.time || 60;
    };

    const [initialTime] = useState(getInitialTime());

    const handleOpenCamera = () => {
        if (isGameActive && !timeExpired) {
            setCaptureModalVisible(true);
        } else {
            Alert.alert("Game Over", "Time has expired or game not started!");
        }
    };

    const handleImageCaptured = (imageUri: string) => {
        setCapturedImage(imageUri);
        console.log("Image captured:", imageUri);
    };

    const handleTimeUp = () => {
        setTimeExpired(true);
        setIsGameActive(false);

        // Show alert with options
        Alert.alert(
            "Time's Up!",
            "You ran out of time. Would you like to retry or go back to menu?",
            [
                {
                    text: "Back",
                    onPress: () => {
                        console.log('Back to menu');
                        router.push('/(tabs)/play');
                    },
                    style: 'cancel'
                },
                {
                    text: "Retry",
                    onPress: () => {
                        console.log('Retrying level');
                        resetGameForRetry();
                        modalRef.current?.open();
                    },
                    style: 'default'
                }
            ]
        );
    };

    const handleModalClose = () => {
        modalRef.current?.close();
        startGame();
    };

    // Use hint function
    const handleUseHint = () => {
        if (!isGameActive) {
            Alert.alert("Game Not Started", "Please start the game first.");
            return;
        }
        if (timeExpired) {
            Alert.alert("Time's Up!", "You ran out of time!");
            return;
        }

        // Check if there are hints available
        const hintAsset = gameAssets.find(asset => asset.name === 'hint');
        if (!hintAsset || hintAsset.quantity <= 0) {
            Alert.alert("No Hints", "You don't have any hints left!");
            return;
        }

        // Check if there are locked hints to unlock
        if (!currentBugtong) return;

        const lockedHints = currentBugtong.hint?.filter(h => !h.open) ?? []; // Fix for Error 1
        if (lockedHints.length === 0) {
            Alert.alert("No Locked Hints", "All hints are already unlocked!");
            return;
        }

        // Unlock the next locked hint
        const firstLockedIndex = currentBugtong.hint?.findIndex(h => !h.open) ?? -1;
        if (firstLockedIndex !== -1 && currentBugtong.hint) {
            // Update the hint to open
            const updatedBugtong = {
                ...currentBugtong,
                hint: currentBugtong.hint.map((h, idx) =>
                    idx === firstLockedIndex ? { ...h, open: true } : h
                )
            };
            setCurrentBugtong(updatedBugtong);

            setBugtongs(prev =>
                prev.map(bugtong => (bugtong.id === currentBugtong.id ? updatedBugtong : bugtong))
            );

            consumeHint(1);

            Alert.alert("Hint Unlocked!", lockedHints[0]?.text || "Hint unlocked!");
        }
    };

    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [answerResult, setAnswerResult] = useState<{
        isCorrect: boolean;
        timeSpent: number;
        confidenceScore: number;
        pointsEarned: number;
        diamondsEarned: number;
        remainingSeconds: number;
    }>({
        isCorrect: false,
        timeSpent: 0,
        confidenceScore: 0,
        pointsEarned: 0,
        diamondsEarned: 0,
        remainingSeconds: 0,
    });

    const startTimeRef = useRef<number>(0);
    const difficultyMultiplierMap: Record<Difficulty, number> = {
        easy: 1,
        medium: 3,
        hard: 5,
    };

    const calculatePoints = (isCorrect: boolean, timeSpent: number, confidenceScore: number) => {
        if (!isCorrect) {
            return {
                basePoints: 0,
                timePoints: 0,
                confidencePoints: 0,
                totalPoints: 0,
                remainingSeconds: 0,
            };
        }

        const remainingSeconds = Math.max(0, Math.floor(initialTime - timeSpent));
        const multiplier = difficultyMultiplierMap[difficultyString as Difficulty] ?? 1;
        const basePoints = 200;
        const timePoints = remainingSeconds * multiplier;
        const normalizedConfidence =
            confidenceScore > 0 && confidenceScore <= 1
                ? confidenceScore * 100
                : confidenceScore;
        const confidencePoints = Math.max(0, Math.round(normalizedConfidence));

        return {
            basePoints,
            timePoints,
            confidencePoints,
            totalPoints: basePoints + timePoints + confidencePoints,
            remainingSeconds,
        };
    };

    const calculateDiamonds = (isCorrect: boolean, timeSpent: number) => {
        if (!isCorrect) {
            return {
                correctAnswerDiamonds: 0,
                fastAnswerDiamonds: 0,
                totalDiamonds: 0,
            };
        }

        const correctAnswerDiamonds = 1;
        const fastAnswerDiamonds = timeSpent < 60 ? 2 : 0;

        return {
            correctAnswerDiamonds,
            fastAnswerDiamonds,
            totalDiamonds: correctAnswerDiamonds + fastAnswerDiamonds,
        };
    };

    const startGame = () => {
        setIsGameActive(true);
        setTimeExpired(false);
        setCapturedImage(null);
        setTimerKey(prev => prev + 1);
        startTimeRef.current = Date.now();

        // // Reset hints for current bugtong (optional - only if you want to reset)
        // if (currentBugtong && currentBugtong.hint) {
        //     const resetBugtong = {
        //         ...currentBugtong,
        //         hint: currentBugtong.hint.map((h, idx) =>
        //             idx === 0 ? { ...h, open: true } : { ...h, open: false }
        //         )
        //     };
        //     setCurrentBugtong(resetBugtong);
        //     setHintIndex(1);
        // }
    };

    const resetGameForRetry = () => {
        // Reset all game states
        setTimeExpired(false);
        setCapturedImage(null);
        setTimerKey(prev => prev + 1);
        startTimeRef.current = Date.now();

        // Reset hints for current bugtong
        if (currentBugtong && currentBugtong.hint) {
            const resetBugtong = {
                ...currentBugtong,
                hint: currentBugtong.hint.map((h, idx) =>
                    idx === 0 ? { ...h, open: true } : { ...h, open: false }
                )
            };
            setCurrentBugtong(resetBugtong);
            setBugtongs(prev =>
                prev.map(bugtong => (bugtong.id === currentBugtong.id ? resetBugtong : bugtong))
            );
        }

        setIsGameActive(true);
    };

    const moveToNextBugtong = () => {
        if (!currentBugtong) return;

        const updatedBugtongs = bugtongs.map((bugtong) =>
            bugtong.id === currentBugtong.id ? { ...bugtong, solved: true } : bugtong
        );
        setBugtongs(updatedBugtongs);

        const nextBugtong = getNextUnsolvedBugtong(updatedBugtongs, currentBugtong.id, difficultyString);

        if (nextBugtong) {
            // Update the current bugtong state
            setCurrentBugtong(nextBugtong);

            // Reset hints for new bugtong
            if (nextBugtong.hint) {
                const resetHints = nextBugtong.hint.map((h, idx) =>
                    idx === 0 ? { ...h, open: true } : { ...h, open: false }
                );
                const resetBugtong = { ...nextBugtong, hint: resetHints };
                setCurrentBugtong(resetBugtong);
                setBugtongs(prev =>
                    prev.map(bugtong => (bugtong.id === nextBugtong.id ? resetBugtong : bugtong))
                );
            }

            // Reset all game states
            setCapturedImage(null);
            setTimeExpired(false);
            setTimerKey(prev => prev + 1);
            startTimeRef.current = Date.now();

            // IMPORTANT: Restart the game
            setIsGameActive(true);

            // Close the result modal (already handled by onClose)
            // The game is now active with the new bugtong
        } else {
            Alert.alert(
                "Congratulations!",
                `You've completed all ${difficultyString} bugtongs!`,
                [{ text: "Back to Menu", onPress: () => router.push('/(tabs)/play') }]
            );
        }
    };

    const applyAnswerOutcome = (isCorrect: boolean, timeSpent: number, confidenceScore: number) => {
        const points = calculatePoints(isCorrect, timeSpent, confidenceScore);
        const diamonds = calculateDiamonds(isCorrect, timeSpent);

        if (isCorrect) {
            const solvedBugtong = currentBugtong ? { ...currentBugtong, solved: true } : null;

            if (solvedBugtong) {
                setCurrentBugtong(solvedBugtong);
                setBugtongs((prev) =>
                    prev.map((bugtong) =>
                        bugtong.id === solvedBugtong.id
                            ? { ...bugtong, solved: true }
                            : bugtong
                    )
                );
            }

            addPoints(points.totalPoints);
            addDiamonds(diamonds.totalDiamonds);
        } else {
            consumeLife(1);
        }

        return { points, diamonds };
    };

    //FOR TESTING
    const handleSubmit = () => {
        if (!capturedImage) {
            Alert.alert("No Image", "Please capture an image first.");
            return;
        }
        if (!isGameActive) {
            Alert.alert("Game Not Started", "Please start the game first.");
            return;
        }
        if (timeExpired) {
            Alert.alert("Time's Up!", "You ran out of time!");
            return;
        }

        setIsGameActive(false);

        const timeSpent = (Date.now() - startTimeRef.current) / 1000;
        const isCorrect = true;
        const confidenceScore = 100;

        const rewards = applyAnswerOutcome(isCorrect, timeSpent, confidenceScore);

        setAnswerResult({
            isCorrect,
            timeSpent,
            confidenceScore,
            pointsEarned: rewards.points.totalPoints,
            diamondsEarned: rewards.diamonds.totalDiamonds,
            remainingSeconds: rewards.points.remainingSeconds,
        });
        setResultModalVisible(true);
    }

    //REAL HANDLE SUBMIT
    // const handleSubmit = async () => {
    //     if (!capturedImage) {
    //         Alert.alert("No Image", "Please capture an image first.");
    //         return;
    //     }
    //     if (!isGameActive) {
    //         Alert.alert("Game Not Started", "Please start the game first.");
    //         return;
    //     }
    //     if (timeExpired) {
    //         Alert.alert("Time's Up!", "You ran out of time!");
    //         return;
    //     }

    //     const timeSpent = (Date.now() - startTimeRef.current) / 1000;

    //     setIsSubmitting(true);
    //     setApiError(null);

    //     try {
    //         // Use the original image URI directly (no copying needed)
    //         const imageUri = capturedImage;

    //         // Get expected answer from current bugtong
    //         const expectedAnswer = currentBugtong?.answer || '';

    //         // Ensure bugtongId is a number
    //         const bugtongId = typeof currentBugtong?.id === 'string'
    //             ? parseInt(currentBugtong.id)
    //             : (currentBugtong?.id || 0);

    //         // Submit to API
    //         const result = await submitAnswer(
    //             imageUri,
    //             bugtongId,
    //             expectedAnswer,
    //             timeSpent
    //         );

    //         console.log('API Response:', result);

    //         applyAnswerOutcome(result.is_correct, timeSpent);
    //         // Show result modal with API response
    //         setAnswerResult({
    //             isCorrect: result.is_correct,
    //             timeSpent: timeSpent
    //         });
    //         setResultModalVisible(true);
    //         setIsGameActive(false);

    //     } catch (error) {
    //         console.error('Submission error:', error);
    //         const errorMessage = error instanceof Error ? error.message : 'Failed to submit answer';
    //         setApiError(errorMessage);
    //         Alert.alert(
    //             "Submission Failed",
    //             errorMessage + "\n\nPlease check your connection to the API server.",
    //             [{ text: "OK", onPress: () => console.log("Error acknowledged") }]
    //         );
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    // Get current hint count
    const currentHintCount = gameAssets.find(asset => asset.name === 'hint')?.quantity || 0;

    const handleBackMenu = () => {
        // Reset all game state before navigating back
        setIsGameActive(false);
        setTimeExpired(false);
        setCapturedImage(null);
        setTimerKey(prev => prev + 1);

        // Close modal and navigate
        modalRef.current?.close();
        router.push('/(tabs)/play');
    };

    return (
        <>
            <View className="relative w-full h-full py-3 flex-col items-center justify-start gap-3">
                {/* Timer */}
                <View className="w-full flex-row justify-end mt-2 px-5">
                    {isGameActive ? (
                        <Timer
                            key={timerKey}
                            initialSeconds={initialTime}
                            onTimeUp={handleTimeUp}
                            isRunning={isGameActive && !timeExpired}
                        />
                    ) : (
                        <View className="bg-gray-500/70 px-4 py-1 rounded-full">
                            <Text className="font-bold text-lg text-white">
                                {formatTime(initialTime)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Bugtong Question */}
                <View className="max-w-4/5 bg-white rounded-lg mt-15">
                    <Text className="text-lg font-medium text-primary p-5">
                        {currentBugtong?.question}
                    </Text>
                </View>

                {/* Hints Section */}
                <View className="w-4/5 mt-5 flex-col justify-start gap-2">
                    {currentBugtong?.hint?.map((hintItem, index) => (
                        <View
                            key={index}
                            className={`w-full flex-row gap-2 items-center rounded-lg px-2 py-1 relative ${hintItem.open ? 'bg-white' : 'bg-white/50'
                                }`}
                        >
                            {!hintItem.open && (
                                <View className="absolute inset-0 items-center justify-center z-10">
                                    <FontAwesome name="lock" size={20} color="gray" />
                                </View>
                            )}
                            <Image
                                source={custom_icons.hint}
                                className={`w-5 h-5 ${!hintItem.open ? 'opacity-10' : ''}`}
                            />
                            <Text
                                className={`text-md font-regular text-primary px-2 ${!hintItem.open ? 'opacity-0' : ''
                                    }`}
                            >
                                {hintItem.text}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Display captured image preview */}
                {capturedImage && (
                    <View className="relative w-4/5 mt-10">
                        <Image source={{ uri: capturedImage }} className="absolute top-0 right-0 w-48 h-48 rounded-lg" />
                        <TouchableOpacity
                            className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
                            onPress={() => setCapturedImage(null)}
                        >
                            <FontAwesome name="times" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

                {/* GameActivity */}
                <View className="absolute bottom-10 left-0 flex-row items-end justify-between w-full px-5">
                    <TouchableOpacity
                        className="h-12 flex-row items-center gap-2 bg-background rounded-full px-5"
                        activeOpacity={0.8}
                        onPress={handleUseHint}
                    >
                        <Text className="text-lg font-medium">Use</Text>
                        <Image source={custom_icons.hint} className="w-8 h-8" />
                        <Text className="text-sm font-medium text-gray-600">({currentHintCount})</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-gray-800 flex items-center justify-center rounded-full p-7"
                        activeOpacity={0.8}
                        onPress={handleOpenCamera}
                    >
                        <FontAwesome name="camera" size={24} color={"white"} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`h-12 flex items-center justify-center px-5 rounded-full ${isSubmitting ? 'bg-gray-400' : 'bg-blue-300'}`}
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Text className="text-lg font-medium">
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Capture Modal */}
            <CaptureModal
                visible={captureModalVisible}
                onClose={() => setCaptureModalVisible(false)}
                onImageCaptured={handleImageCaptured}
            />

            {/* Result Modal */}
            <ResultModal
                visible={resultModalVisible}
                onClose={() => {
                    setResultModalVisible(false);
                }}
                onNext={moveToNextBugtong}
                bugtong={currentBugtong || {
                    id: 0,
                    difficulty: difficultyString as Difficulty,
                    category: 'Unknown',
                    question: 'Question not found',
                    answer: 'Unknown',
                    hint: [],
                    solved: false
                }}
                imageAnswer={capturedImage ? { uri: capturedImage } : null}
                isCorrect={answerResult.isCorrect}
                timeSpent={answerResult.timeSpent}
                pointsEarned={answerResult.pointsEarned}
                diamondsEarned={answerResult.diamondsEarned}
                confidenceScore={answerResult.confidenceScore}
                remainingSeconds={answerResult.remainingSeconds}
                difficulty={difficultyString as Difficulty}
            />

            {/* Game Info Modal */}
            <CModal
                ref={modalRef}
                closeOnBackdropPress={false}
                animationType="fade"
                initialVisible={true}
                contentClassName="absolute top-0 right-0 w-full h-full rounded-2xl"
            >
                <View className="flex-1 items-center justify-center bg-gray-500/50">
                    <View className="relative w-4/5 h-4/5 bg-white rounded-2xl p-10 pt-17 items-center shadow-lg">
                        <TouchableOpacity className="absolute top-2 left-2 bg-gray-100/10 rounded-full p-2"
                            onPress={handleBackMenu}>
                            {/* <MaterialIcons name={'arrow-back'} color={'black'} size={24} /> */}
                            <Text className="text-lg bg-gray-300 px-3 py-2 rounded-full font-bold">Back</Text>
                        </TouchableOpacity>
                        <View className="flex-col gap-2 items-center justify-center">
                            <Text className="text-2xl font-medium">Level</Text>
                            <Text className="text-3xl font-bold uppercase">{params.levelName}</Text>
                        </View>
                        <View className="w-full flex-1 flex-col gap-2 items-center justify-center">
                            <View className="w-full flex-row justify-between">
                                <Text className="font-medium text-lg">Time:</Text>
                                <Text className="text-lg">{params.levelTime}</Text>
                            </View>
                            <View className="w-full flex-row justify-between">
                                <Text className="font-medium text-lg">Total Hints:</Text>
                                <Text className="text-lg">{params.levelHints}</Text>
                            </View>
                            <View className="w-full flex-row justify-between">
                                <Text className="font-medium text-lg">Free Hint:</Text>
                                <Text className="text-lg">{params.levelFreeHint}</Text>
                            </View>
                            <Pressable
                                className="bg-green-400 px-8 py-3 rounded-full mt-20"
                                onPress={handleModalClose}
                            >
                                <Text className="text-black text-xl font-semibold">Start</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </CModal>
        </>
    );
}

// Helper function to format time
const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    if (minutes > 0) {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}s`;
};
