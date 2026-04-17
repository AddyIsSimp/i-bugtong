import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { useRef, useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import CModal, { CModalRef } from '@/components/CModal';
import { custom_icons } from "@/constants/custom_icons";
import { bugtongList } from "@/constants/data";

const SafeAreaView = styled(RNSafeAreaView);

export default function Game({ difficulty }: { difficulty: string }) {

    const modalRef = useRef<CModalRef>(null); //for CModal
    const params = useLocalSearchParams();
    const [modalVisible, setModalVisible] = useState(true);

    const getDifficultyString = (difficulty: number | string): string => {
        const diff = Number(difficulty);
        if (diff === 1) return 'easy';
        if (diff === 2) return 'medium';
        if (diff === 3) return 'hard';
        return 'easy';
    };

    const difficultyString = getDifficultyString(params.levelDifficulty as string);

    const handleOpenCamera = () => {
        router.push('/game/capture')
    }

    return (
        <>
            <View className="relative w-full h-full py-3 flex-col items-center justify-start gap-3">

                {/* Bugtong Question */}
                <View className="max-w-4/5 bg-white rounded-lg mt-15">
                    <Text className="text-lg font-medium text-primary p-5">
                        {bugtongList.find((bugtong) => bugtong.difficulty === difficultyString)?.question}
                    </Text>
                </View>

                {/* Hint */}
                <View className="w-4/5 mt-5 flex-col justify-start gap-2">
                    {bugtongList
                        .find((bugtong) => bugtong.difficulty === difficultyString)
                        ?.hint.map((hintItem, index) => (
                            <View
                                key={index}
                                className={`w-full flex-row gap-2 items-center rounded-lg px-2 py-1 relative ${hintItem.open ? 'bg-white' : 'bg-white/50'
                                    }`}
                            >
                                {/* Lock icon for locked hints */}
                                {!hintItem.open && (
                                    <View className="absolute inset-0 items-center justify-center z-10">
                                        <FontAwesome name="lock" size={20} color="gray" />
                                    </View>
                                )}

                                {/* Hint Icon with conditional opacity */}
                                <Image
                                    source={custom_icons.hint}
                                    className={`w-5 h-5 ${!hintItem.open ? 'opacity-10' : ''}`}
                                />

                                {/* Hint Text with conditional opacity */}
                                <Text
                                    className={`text-md font-regular text-primary px-2 ${!hintItem.open ? 'opacity-0' : ''
                                        }`}
                                >
                                    {hintItem.text}
                                </Text>
                            </View>
                        ))}
                </View>

                {/* GameActivity */}
                <View className="absolute bottom-10 left-0 flex-row items-center justify-between w-full px-5">
                    <TouchableOpacity className="h-12 flex-row items-center gap-2 bg-background rounded-full px-5"
                        activeOpacity={0.8}>
                        <Text className="text-lg font-medium">Use</Text>
                        <Image source={custom_icons.hint} className="w-8 h-8" />
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-gray-800 flex items-center justify-center rounded-full"
                        activeOpacity={0.8}
                        onPress={handleOpenCamera}>
                        <FontAwesome name="camera" size={24} color={"white"} className="p-7" />
                    </TouchableOpacity>
                    <TouchableOpacity className="h-12 flex items-center justify-center bg-blue-300 px-5 rounded-full"
                        activeOpacity={0.8}>
                        <Text className="text-lg font-medium">Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>


            {/* Game Info Modal */}
            < CModal
                ref={modalRef}
                closeOnBackdropPress={false}
                animationType="fade"
                initialVisible={true}
                contentClassName="absolute top-0 right-0 w-full h-full rounded-2xl" >
                <View className="flex-1 items-center justify-center bg-gray-500/50">
                    <View className="w-4/5 h-4/5 bg-white rounded-2xl p-10 items-center shadow-lg">
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
                                onPress={() => modalRef.current?.close()}
                            >
                                <Text className="text-black text-xl font-semibold">Start</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </CModal >
        </>
    );
};