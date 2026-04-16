
import { gameAssets, gameBG } from "@/constants/data";
import { colors } from "@/constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { Image, ImageBackground, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import {useState} from "react";

const SafeAreaView = styled(RNSafeAreaView);

export default function Friends({ difficulty }: { difficulty: string }) {

    const params = useLocalSearchParams();
    const [infoVisible, setInfoVisible] = useState(false);

    const getDifficultyString = (difficulty: number | string): string => {
        const diff = Number(difficulty);
        if (diff === 1) return 'easy';
        if (diff === 2) return 'medium';
        if (diff === 3) return 'hard';
        return 'easy'; 
    };

    const difficultyString = getDifficultyString(params.levelDifficulty as string);
    const bgImage = gameBG.find((bg) => bg.difficulty === difficultyString)?.background;

    const handleGoBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ImageBackground
                source={bgImage || gameBG[0].background} // Fallback to first image if not found
                className="flex-1 w-full h-full"
            >
                <View className="flex-1 px-5 py-3 flex-col items-start gap-3">
                    {/* Header */}
                    <View className="flex-row w-full justify-between h-fit">
                        <TouchableOpacity
                            onPress={handleGoBack}
                            className="p-2"
                        >
                            <FontAwesome
                                name="arrow-left"
                                size={20}
                                color={colors.primary}
                                className="font-normal"
                            />
                        </TouchableOpacity>
                        <View className="flex-row gap-7 justify-between
                            bg-white/30 px-5 items-center rounded-full">
                            {gameAssets.map((asset) => (
                                <View className="flex-row items-end justify-end gap-1 px-0 py-1" key={asset.name}>
                                    <Text className="text-sm text-primary">{asset.quantity}</Text>
                                    <Image source={asset.icon} className="w-5 h-5" />
                                </View>))
                            }
                        </View>
                    </View>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={infoVisible}
                        onRequestClose={() => setInfoVisible(false)}
                    >
                        
                    </Modal>

                    <View>
                        <Text className="text-2xl font-bold text-primary">{params.levelName}</Text>
                        <Text className="text-sm text-primary">Time: {params.levelTime} | Hints: {params.levelHints} | Free Hint: {params.levelFreeHint}</Text>
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};