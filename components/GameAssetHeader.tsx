import { HINT_DIAMOND_COST, LIFE_DIAMOND_COST } from "@/constants/data";
import { useGame } from "@/contexts/GameContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

type HeaderVariant = "full" | "pill";

interface GameAssetHeaderProps {
    variant?: HeaderVariant;
}

const formatCountdown = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function GameAssetHeader({ variant = "full" }: GameAssetHeaderProps) {
    const { gameAssets, lifeMax, lifeRefillCountdownSeconds, purchaseAsset } = useGame();

    const containerClassName =
        variant === "pill"
            ? "flex-row gap-7 justify-between bg-white/30 px-5 py-2 items-start rounded-3xl"
            : "flex-row flex-1 items-start justify-between px-6 py-2 mb-5";

    const handleAssetPress = (assetName: string) => {
        if (assetName !== "hint" && assetName !== "life") {
            return;
        }

        const isHint = assetName === "hint";
        const title = isHint ? "Hint Cost" : "Life Cost";
        const cost = isHint ? HINT_DIAMOND_COST : LIFE_DIAMOND_COST;
        const description = `${isHint ? "Hint" : "Life"}: Cost ${cost} 💎 diamond`;

        Alert.alert(title, description, [
            {
                text: "Back",
                style: "cancel",
            },
            {
                text: "Buy",
                onPress: () => {
                    const result = purchaseAsset(assetName, cost);

                    if (!result.success) {
                        Alert.alert("Purchase Failed", result.message || "Unable to complete purchase.");
                    }
                },
            },
        ]);
    };

    return (
        <View className={containerClassName}>
            {gameAssets.map((asset) => {
                const canPress = asset.name === "hint" || asset.name === "life";
                const showCountdown =
                    asset.name === "life" &&
                    asset.quantity < lifeMax &&
                    lifeRefillCountdownSeconds !== null;

                return (
                    <View className="items-center justify-start" key={asset.name}>
                        <TouchableOpacity
                            className="relative flex-row items-center justify-center gap-1 py-1 bg-accent/20 border-2 border-accent/30 rounded-full"
                            disabled={!canPress}
                            onPress={() => handleAssetPress(asset.name)}
                        >
                            <Image source={asset.icon} className="w-5 h-5 -ml-2" style={{ width: 20, height: 20 }} />
                            <Text className="text-md text-primary px-2 pr-6">{asset.quantity}</Text>
                            {canPress && (
                                <View className="absolute -right-2 top-[1/2] bg-accent rounded-full w-5 h-5 items-center justify-center">
                                    <MaterialIcons name="add" size={14} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                        {showCountdown && (
                            <Text className="mt-1 text-[10px] text-primary/70">
                                +1 in {formatCountdown(lifeRefillCountdownSeconds)}
                            </Text>
                        )}
                    </View>
                );
            })}
        </View>
    );
}
