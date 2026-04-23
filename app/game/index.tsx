// app/game/index.tsx
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import CModal, { CModalRef } from '@/components/CModal';
import CaptureModal from '@/components/CaptureModal';
import ResultModal from "@/components/ResultModal";
import Timer from '@/components/Timer';
import { custom_icons } from "@/constants/custom_icons";
import { bugtongList, gameAssets as initialGameAssets, levels } from "@/constants/data";

const SafeAreaView = styled(RNSafeAreaView);

export default function Index() {
    const modalRef = useRef<CModalRef>(null);
    const [captureModalVisible, setCaptureModalVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isGameActive, setIsGameActive] = useState(false);
    const [timeExpired, setTimeExpired] = useState(false);
    const [timerKey, setTimerKey] = useState(0);
    const params = useLocalSearchParams();

    // Game assets state
    const [gameAssets, setGameAssets] = useState(initialGameAssets);

    // Hints state for current bugtong
    const [currentBugtong, setCurrentBugtong] = useState<BugtongProps | null>(null);
    const [hintIndex, setHintIndex] = useState(0); // Track which hint to unlock next

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
        const bugtong = bugtongList.find((b) => b.difficulty === difficultyString);
        if (bugtong) {
            setCurrentBugtong(bugtong);
            // Find first locked hint index - Fix for Error 3
            const firstLockedIndex = bugtong.hint?.findIndex(h => !h.open) ?? -1;
            setHintIndex(firstLockedIndex === -1 ? (bugtong.hint?.length ?? 0) : firstLockedIndex);
        }
    }, [difficultyString]);

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
        const level = levels.find(l => l.difficulty === parseInt(params.levelDifficulty as string));
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
        Alert.alert(
            "Time's Up!",
            "You ran out of time. Better luck next time!",
            [{ text: "OK", onPress: () => console.log("Time's up") }]
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

            // Update the global bugtongList (optional, for persistence)
            const bugtongIndex = bugtongList.findIndex(b => b.id === currentBugtong.id);
            if (bugtongIndex !== -1) {
                bugtongList[bugtongIndex] = updatedBugtong;
            }

            // Deduct hint from gameAssets
            setGameAssets(prev => prev.map(asset =>
                asset.name === 'hint'
                    ? { ...asset, quantity: Math.max(0, asset.quantity - 1) }
                    : asset
            ));

            // Update hint index
            setHintIndex(prev => prev + 1);

            Alert.alert("Hint Unlocked!", lockedHints[0]?.text || "Hint unlocked!");
        }
    };

    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; timeSpent: number }>({
        isCorrect: false,
        timeSpent: 0
    });

    const startTimeRef = useRef<number>(0);

    const startGame = () => {
        setIsGameActive(true);
        setTimeExpired(false);
        setCapturedImage(null);
        setTimerKey(prev => prev + 1);
        startTimeRef.current = Date.now();

        // Reset hints for current bugtong (optional - only if you want to reset)
        if (currentBugtong && currentBugtong.hint) {
            const resetBugtong = {
                ...currentBugtong,
                hint: currentBugtong.hint.map((h, idx) =>
                    idx === 0 ? { ...h, open: true } : { ...h, open: false }
                )
            };
            setCurrentBugtong(resetBugtong);
            setHintIndex(1);
        }
    };

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

        const timeSpent = (Date.now() - startTimeRef.current) / 1000;
        const isAnswerCorrect = true; // Replace with actual validation logic

        setAnswerResult({
            isCorrect: isAnswerCorrect,
            timeSpent: timeSpent
        });
        setResultModalVisible(true);
        setIsGameActive(false);
    };

    // Get current hint count
    const currentHintCount = gameAssets.find(asset => asset.name === 'hint')?.quantity || 0;

    const handleBackMenu = () => {
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
                        className="h-12 flex items-center justify-center bg-blue-300 px-5 rounded-full"
                        activeOpacity={0.8}
                        onPress={handleSubmit}
                    >
                        <Text className="text-lg font-medium">Submit</Text>
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
                    <View className="relative w-4/5 h-4/5 bg-white rounded-2xl p-10 items-center shadow-lg">
                        <TouchableOpacity className="absolute top-2 left-2 bg-gray-100/10 rounded-full p-2"
                            onPress={handleBackMenu}>
                            <MaterialIcons name={'arrow-back'} color={'black'} size={24} />
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