import { styled } from "nativewind";
import { Alert, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { gameAssets, gameBG } from "@/constants/data";
import { colors } from "@/constants/theme";
import { GameProvider, useGame } from "@/contexts/GameContext"; // Import the provider and hook
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

const SafeAreaView = styled(RNSafeAreaView);

// Create a separate component that uses the game context
function LayoutContent() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { isGameActive } = useGame(); // Now you can access isGameActive

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
        if (isGameActive) {
            Alert.alert(
                'Back to Menu',
                'This will not save your progress. Do you want to continue?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log("Cancel pressed - staying in game"),
                        style: 'cancel'
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            console.log("OK pressed - navigating back");
                            // Force reset the game state before navigating
                            // This will be handled by the cleanup in GamePage
                            router.push('/(tabs)/play');
                        },
                        style: 'default'
                    },
                ],
            )
        } else {
            router.push('/(tabs)/play');
        }
    };

    return (
        <ImageBackground
            source={bgImage || gameBG[0].background}
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

            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' },
                    animation: 'fade',
                    animationDuration: 200,
                }}
            >
                <Stack.Screen
                    name="gamePage"
                    options={{
                        contentStyle: { backgroundColor: 'transparent' }
                    }}
                />
                <Stack.Screen
                    name="capture"
                    options={{
                        contentStyle: { backgroundColor: 'transparent' },
                        animation: 'fade',
                    }}
                />
            </Stack>
        </ImageBackground>
    );
}

// Main layout that provides the GameProvider
export default function RootLayout() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <GameProvider>
                <LayoutContent />
            </GameProvider>
        </SafeAreaView>
    );
}