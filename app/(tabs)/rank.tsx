
import { View, Text } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import { FontAwesome } from "@expo/vector-icons";

const SafeAreaView = styled(RNSafeAreaView);

export default function Friends() {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <View className="flex-1">
                <Text className="text-2xl font-bold text-primary">Leaderboard</Text>
            </View>
        </SafeAreaView>
    );
};