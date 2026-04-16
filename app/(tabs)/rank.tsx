
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
                <FontAwesome name={icons.back} size={24} color="colors.primary" style={{ transform: [{ scaleX: 1.5 }] }} />
                <Text className="text-2xl font-bold text-primary">Game</Text>
            </View>
        </SafeAreaView>
    );
};