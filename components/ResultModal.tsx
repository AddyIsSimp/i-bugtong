// components/ResultModal.tsx
import { custom_icons } from "@/constants/custom_icons";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ImageSourcePropType, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ResultProps {
    visible: boolean;
    onClose: () => void;
    onNext: () => void;
    bugtong: BugtongProps;
    imageAnswer: ImageSourcePropType | null;
    isCorrect: boolean;
    timeSpent?: number;
    pointsEarned?: number;
    diamondsEarned?: number;
    confidenceScore?: number;
    remainingSeconds?: number;
    difficulty?: Difficulty;
}

const difficultyMultiplierMap: Record<Difficulty, number> = {
    easy: 1,
    medium: 3,
    hard: 5,
};

export default function ResultModal({
    visible,
    onClose,
    onNext,
    bugtong,
    imageAnswer,
    isCorrect,
    timeSpent = 0,
    pointsEarned = 0,
    diamondsEarned = 0,
    confidenceScore = 0,
    remainingSeconds = 0,
    difficulty = 'easy',
}: ResultProps) {
    const [showStatistic, setShowStatistic] = useState(true);
    const difficultyMultiplier = difficultyMultiplierMap[difficulty];
    const basePoints = isCorrect ? 200 : 0;
    const timePoints = isCorrect ? remainingSeconds * difficultyMultiplier : 0;
    const awardedConfidenceScore = isCorrect ? confidenceScore : 0;

    const handleBackToMenu = () => {
        onClose();
        router.push('/(tabs)/play');
    };

    const handleNext = () => {
        if (onNext) {
            onNext();
        }
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 items-center justify-center bg-gray-900/70">
                <View style={{ height: "85%", width: "75%" }} className="bg-white rounded-2xl p-4 gap-4">
                    <ScrollView
                        className="rounded-2xl"
                        contentContainerStyle={{ gap: 24 }}
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                    >
                                {/* Header - Success/Failure */}
                                <View className="items-center">
                                    {isCorrect ? (
                                        <View className="flex-row items-center justify-center gap-3">
                                            <MaterialIcons name="check-circle" size={30} color="#22c55e" />
                                            <Text className="text-2xl font-bold text-green-600">GOOD JOB!</Text>
                                        </View>
                                    ) : (
                                        <>
                                            <View className="bg-red-100 p-3 rounded-full mb-2">
                                                <MaterialIcons name="cancel" size={30} color="#ef4444" />
                                            </View>
                                            <Text className="text-2xl font-bold text-red-600">FAIL</Text>
                                        </>
                                    )}
                                </View>

                                {/* Reward Display */}
                                {isCorrect && (
                                    <View className="flex-col gap-0 px-3 py-2 bg-accent/20 rounded-xl">
                                        <Text className="text-sm font-medium">Rewards</Text>
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-gray-700 font-medium">Points</Text>
                                            <Text className="text-lg font-bold text-primary">+ {pointsEarned}</Text>
                                        </View>
                                        <View className="flex-row items-center justify-between">
                                            <Text className="text-gray-700 font-medium">Diamonds</Text>
                                            <View className="flex-row items-center justify-center gap-1">
                                                <Image source={custom_icons.diamond} className="w-4 h-4" />
                                                <Text className="text-lg font-bold">+ {diamondsEarned}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Submitted Image */}
                                {imageAnswer && (
                                    <View className="items-center gap-2">
                                        <View className="flex-col gap-0 items-center">
                                            <Text className="text-gray-600 text-center text-sm leading-none">Answer</Text>
                                            <Text className="text-xl font-medium leading-none">{bugtong.answer}</Text>
                                        </View>
                                        <Image
                                            source={imageAnswer}
                                            className="w-48 h-48 rounded-lg"
                                            resizeMode="cover"
                                        />
                                    </View>
                                )}

                                {/* Correct Answer Display */}
                                {!isCorrect && (
                                    <View className="bg-blue-50 p-3 rounded-lg">
                                        <Text className="text-gray-600 text-center">Correct Answer:</Text>
                                        <Text className="text-lg font-bold text-blue-600 text-center">
                                            {bugtong?.answer || "Answer not available"}
                                        </Text>
                                    </View>
                                )}

                                {/* Statistics Toggle Button */}
                                <TouchableOpacity
                                    onPress={() => setShowStatistic(!showStatistic)}
                                    className="flex-row items-center justify-between bg-gray-100 px-3 py-1.5 rounded-lg"
                                    activeOpacity={0.7}
                                >
                                    <Text className="font-semibold text-gray-700 text-lg">Statistics</Text>
                                    <MaterialIcons
                                        name={showStatistic ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                        size={24}
                                        color="gray"
                                    />
                                </TouchableOpacity>

                                {/* Statistics Content */}
                                {showStatistic && (
                                    <ScrollView
                                        className="-mt-5 bg-gray-50 p-2 rounded-lg"
                                        showsVerticalScrollIndicator={true}
                                        contentContainerStyle={{ gap: 6 }}
                                        keyboardShouldPersistTaps="handled"
                                        nestedScrollEnabled
                                    >
                                        <Text className="font-bold text-md text-gray-800">Points</Text>

                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-gray-700 text-sm">Correct Answer</Text>
                                            <Text className={isCorrect ? "text-green-600 font-semibold text-sm" : "text-red-500"}>
                                                {isCorrect ? `+ ${basePoints}` : "0"}
                                            </Text>
                                        </View>

                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-gray-700 text-sm">
                                                Time Bonus ({remainingSeconds}s x {difficultyMultiplier})
                                            </Text>
                                            <Text className={isCorrect ? "text-sm text-green-600 font-semibold" : "text-red-500"}>
                                                {isCorrect ? `+ ${timePoints}` : "0"}
                                            </Text>
                                        </View>

                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-gray-700 text-sm">Time Spent</Text>
                                            <Text className="text-gray-700 text-sm">{timeSpent.toFixed(1)}s</Text>
                                        </View>

                                        <View className="flex-row justify-between -mb-2 items-center">
                                            <Text className="text-gray-700 text-sm">Confidence Score</Text>
                                            <Text className={isCorrect ? "text-sm text-green-600 font-semibold" : "text-red-500"}>
                                                {isCorrect ? `+ ${awardedConfidenceScore}` : "0"}
                                            </Text>
                                        </View>

                                        <View className="border-t border-gray-200 mt-2 flex-row justify-between items-center">
                                            <Text className="font-bold text-sm text-gray-800 mt-1">Total Points</Text>
                                            <Text className="text-sm font-bold text-primary">+ {pointsEarned}</Text>
                                        </View>

                                        <Text className="font-bold text-gray-800 mt-4">Diamonds</Text>

                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-gray-700 text-sm">Correct Answer Bonus</Text>
                                            <View className="flex-row items-center gap-1">
                                                <Image source={custom_icons.diamond} className="w-4 h-4" />
                                                <Text className={isCorrect ? "text-green-600 font-semibold text-sm" : "text-red-500"}>
                                                    {isCorrect ? "+ 1" : "0"}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-gray-700 text-sm">Fast Answer Bonus</Text>
                                            <View className="flex-row items-center gap-1">
                                                <Image source={custom_icons.diamond} className="w-4 h-4" />
                                                <Text className={isCorrect && timeSpent < 60 ? "text-sm text-green-600 font-semibold" : "text-red-500"}>
                                                    {isCorrect && timeSpent < 60 ? "+ 2" : "0"}
                                                </Text>
                                            </View>
                                        </View>

                                        <View className="border-t border-gray-200 mt-1 pt-1 flex-row justify-between items-center">
                                            <Text className="font-bold text-gray-800 text-sm">Total Diamonds</Text>
                                            <View className="flex-row items-center gap-1">
                                                <Image source={custom_icons.diamond} className="w-4 h-4" />
                                                <Text className="text-md font-bold text-yellow-600 text-sm">+ {diamondsEarned}</Text>
                                            </View>
                                        </View>
                                    </ScrollView>
                                )}


                    </ScrollView>
                    {/* Action Buttons */}
                    <View className="flex-row gap-2 mt-2">
                        <TouchableOpacity
                            className="flex-1 bg-gray-500 py-3 rounded-full"
                            onPress={handleBackToMenu}
                            activeOpacity={0.7}
                        >
                            <Text className="text-white text-center font-semibold">Back</Text>
                        </TouchableOpacity>
                        {isCorrect && (
                            <TouchableOpacity
                                className="flex-1 bg-blue-500 py-3 rounded-full"
                                onPress={handleNext}
                                activeOpacity={0.7}
                            >
                                <Text className="text-white text-center font-semibold">Next</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
