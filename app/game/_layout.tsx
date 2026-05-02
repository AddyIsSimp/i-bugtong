import { styled } from "nativewind";
import { Alert, ImageBackground, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import GameAssetHeader from "@/components/GameAssetHeader";
import { gameBG } from "@/constants/data";
import { colors } from "@/constants/theme";
import { useGame } from "@/contexts/GameContext";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

const SafeAreaView = styled(RNSafeAreaView);

// Create a separate component that uses the game context
function LayoutContent() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { isGameActive, consumeLife } = useGame();

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
                'This will not save your progress and will cost 1 life. Do you want to continue?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => console.log("Cancel pressed - staying in game"),
                        style: 'cancel'
                    },
                    {
                        text: 'Back',
                        onPress: () => {
                            consumeLife(1);
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
                    <GameAssetHeader variant="pill" />
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

export default function RootLayout() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <LayoutContent />
        </SafeAreaView>
    );
}
