// components/ResultModal.tsx
import { custom_icons } from "@/constants/custom_icons";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, ImageSourcePropType, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface ResultProps {
    visible: boolean;
    onClose: () => void;
    bugtong: BugtongProps;
    imageAnswer: ImageSourcePropType | null;
    isCorrect: boolean;
    timeSpent?: number;
}

export default function ResultModal({ visible, onClose, bugtong, imageAnswer, isCorrect, timeSpent = 0 }: ResultProps) {
    const [showStatistic, setShowStatistic] = useState(false);

    // Calculate rewards based on performance
    const getRewards = () => {
        let diamonds = 0;
        if (isCorrect) {
            diamonds += 1

            // You'll need to pass total time limit as prop
            if (timeSpent < 60) diamonds += 2;

            // Perfect score bonus
            diamonds += 1;
        }
        return diamonds;
    };

    const handleBackToMenu = () => {
        onClose();
        router.push('/(tabs)/play');
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className='flex-1 items-center justify-center bg-gray-900/70'>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View className="w-4/5 flex-col bg-white rounded-2xl p-6 gap-4 shadow-lg">

                            {/* Header - Success/Failure */}
                            <View className="items-center">
                                {isCorrect ? (
                                    <>
                                        <View className="bg-green-100 p-3 rounded-full mb-2">
                                            <MaterialIcons name="check-circle" size={48} color="#22c55e" />
                                        </View>
                                        <Text className="text-2xl font-bold text-green-600">GOOD JOB!</Text>
                                    </>
                                ) : (
                                    <>
                                        <View className="bg-red-100 p-3 rounded-full mb-2">
                                            <MaterialIcons name="cancel" size={48} color="#ef4444" />
                                        </View>
                                        <Text className="text-2xl font-bold text-red-600">FAIL</Text>
                                    </>
                                )}
                            </View>

                            {/* Reward Display */}
                            {isCorrect && (
                                <View className="flex-row items-center justify-center gap-2 bg-yellow-50 p-3 rounded-lg">
                                    <Image source={custom_icons.diamond} className="w-6 h-6" />
                                    <Text className="text-xl font-bold text-yellow-600">+ {getRewards()}</Text>
                                </View>
                            )}

                            {/* Submitted Image */}
                            {imageAnswer && (
                                <View className="items-center">
                                    <Text className="text-gray-600 mb-2">Your Answer:</Text>
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
                                className="flex-row items-center justify-between bg-gray-100 p-3 rounded-lg"
                            >
                                <Text className="font-semibold text-gray-700">Statistics</Text>
                                <MaterialIcons
                                    name={showStatistic ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                    size={24}
                                    color="gray"
                                />
                            </TouchableOpacity>

                            {/* Statistics Content */}
                            {showStatistic && (
                                <View className="flex-col gap-3 bg-gray-50 p-4 rounded-lg">
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
                                            <Image source={custom_icons.diamond} className="w-5 h-5" />
                                            <Text className="text-xl font-bold text-yellow-600">+ {getRewards()}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}

                            <View className="flex-col gap-1">
                                <TouchableOpacity
                                    className="bg-gray-500 py-3 rounded-full mt-2"
                                    onPress={handleBackToMenu}
                                >
                                    <Text className="text-white text-center font-semibold">Back to Menu</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-blue-500 py-3 rounded-full mt-2"
                                    onPress={onClose}
                                >
                                    <Text className="text-white text-center font-semibold">Next</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}