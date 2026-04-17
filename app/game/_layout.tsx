import { styled } from "nativewind";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { gameAssets, gameBG } from "@/constants/data";
import { colors } from "@/constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";


const SafeAreaView = styled(RNSafeAreaView);

export default function RootLayout() {
    const router = useRouter();
    const params = useLocalSearchParams();

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

                <View className="h-fit py-3">
                    {/* Header */}
                    <View className="flex-row w-full justify-between h-fit px-5">
                        <TouchableOpacity onPress={handleGoBack} className="p-2">
                            <FontAwesome
                                name="arrow-left"
                                size={20}
                                color={colors.primary}
                                className="font-normal"
                            />
                        </TouchableOpacity>
                        <View className="flex-row gap-7 justify-between bg-white/30 px-5 items-center rounded-full">
                            {gameAssets.map((asset) => (
                                <View className="flex-row items-end justify-end gap-1 px-0 py-1" key={asset.name}>
                                    <Text className="text-sm text-primary">{asset.quantity}</Text>
                                    <Image source={asset.icon} className="w-5 h-5" />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                <View className="w-full flex-row justify-end mt-2 px-5">
                    <View className="items-end bg-primary/70 px-4 py-1 rounded-full">
                        <Text className="font-bold text-lg text-white">1:00</Text>
                    </View>
                </View>

                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'transparent' },
                        animation: 'fade', // Use fade animation (faster than default)
                        animationDuration: 200, // Faster animation (default is 350ms)
                    }}
                >
                    <Stack.Screen
                        name="game"
                        options={{
                            contentStyle: { backgroundColor: 'transparent' }
                        }}
                    />
                    <Stack.Screen
                        name="capture"
                        options={{
                            contentStyle: { backgroundColor: 'transparent' },
                            animation: 'fade', // Specific animation for capture
                        }}
                    />
                </Stack>

            </ImageBackground>
        </SafeAreaView>
    );
}
