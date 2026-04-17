import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Capture() {
    const handleCancel = () => {
        router.back();
    };

    const handleCapture = () => {
        console.log("Capture photo");
        router.back();
    };

    return (
        <View className="flex-1 w-full items-start justify-start">


            {/* Action buttons */}
            <View className="flex-row justify-between w-full mt-6 gap-4 px-10">
                <TouchableOpacity
                    className="flex-1 bg-red-500 py-3 rounded-lg"
                    onPress={handleCancel}
                >
                    <Text className="text-white text-center font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 bg-green-500 py-3 rounded-lg"
                    onPress={handleCapture}
                >
                    <Text className="text-white text-center font-semibold">Capture</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}