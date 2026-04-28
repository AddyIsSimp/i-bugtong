// components/ResultModal.tsx
import { custom_icons } from "@/constants/custom_icons";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ImageSourcePropType, Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface ResultProps {
    visible: boolean;
    onClose: () => void;
    onNext: () => void;
    bugtong: BugtongProps;
    imageAnswer: ImageSourcePropType | null;
    isCorrect: boolean;
    timeSpent?: number;
}

export default function ResultModal({ visible, onClose, onNext, bugtong, imageAnswer, isCorrect, timeSpent = 0 }: ResultProps) {
    const [showStatistic, setShowStatistic] = useState(true);

    // Calculate rewards based on performance
    const getRewards = () => {
        let diamonds = 0;
        if (isCorrect) {
            diamonds += 1;
            // Bonus for fast answer
            if (timeSpent < 60) diamonds += 2;
            // Perfect score bonus
            diamonds += 1;
        }
        return diamonds;
    };

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
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 items-center justify-center bg-gray-900/70">
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View style={{ height: "85%", width: "75%" }} className="bg-white rounded-2xl p-4 gap-4">
                            <ScrollView
                                className="rounded-2xl"
                                // showsVerticalScrollIndicator={true}
                                contentContainerStyle={{ gap: 24 }}
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
                                    <View className="flex-row items-center justify-between gap-2 px-2 bg-accent/20 rounded-xl">
                                        <Text className="text-md font-medium">Rewards</Text>
                                        <View className="flex-row items-center justify-center gap-2 p-2 rounded-lg">
                                            <Image source={custom_icons.diamond} className="w-5 h-5" />
                                            <Text className="text-xl font-bold text-yellow-600">+ {getRewards()}</Text>
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
                                    <ScrollView className="-mt-5 bg-gray-50 p-2 rounded-lg"
                                        showsVerticalScrollIndicator={true}
                                        contentContainerStyle={{ gap: 8 }}>
                                        {/* Correct Answer Stat */}
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-gray-700">Correct Answer</Text>
                                            <View className="flex-row items-center gap-1">
                                                {isCorrect && (
                                                    <>
                                                        <Image source={custom_icons.diamond} className="w-4 h-4" />
                                                        <Text className="text-green-600 font-semibold">+ 1</Text>
                                                    </>
                                                )}
                                                {!isCorrect && (
                                                    <Text className="text-red-500">0</Text>
                                                )}
                                            </View>
                                        </View>

                                        {/* Time Stat */}
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-gray-700">Time: {timeSpent.toFixed(1)}s</Text>
                                            <View className="flex-row items-center gap-1">
                                                {timeSpent < 30 && (
                                                    <>
                                                        <Image source={custom_icons.diamond} className="w-4 h-4" />
                                                        <Text className="text-green-600 font-semibold">+ 2</Text>
                                                    </>
                                                )}
                                            </View>
                                        </View>

                                        {/* Trust Score Stat */}
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-gray-700">Trust Score</Text>
                                            <View className="flex-row items-center gap-1">
                                                {isCorrect && (
                                                    <>
                                                        <Image source={custom_icons.diamond} className="w-4 h-4" />
                                                        <Text className="text-green-600 font-semibold">+ 1</Text>
                                                    </>
                                                )}
                                            </View>
                                        </View>

                                        {/* Total Reward Summary */}
                                        <View className="border-t border-gray-200 mt-2 pt-2 flex-row justify-between items-center">
                                            <Text className="font-bold text-gray-800">Total Rewards</Text>
                                            <View className="flex-row items-center gap-1">
                                                <Image source={custom_icons.diamond} className="w-4 h-4" />
                                                <Text className="text-md font-bold text-yellow-600">+ {getRewards()}</Text>
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
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}