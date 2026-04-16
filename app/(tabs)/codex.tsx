import { Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Codex() {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <View className="flex-1">
                <Text className="text-2xl font-bold text-primary">Codex</Text>
            </View>
        </SafeAreaView>
    );
};