import { addLineAfterCommas, getBugtongsByCategory, replaceCommasWithNewlines } from "@/utils";
import { FlatList, Text, View } from "react-native";

interface CategorizeBugtongProps {
    category: string;
}

export default function CategorizeBugtong({category}: CategorizeBugtongProps) {
    const bugtong = getBugtongsByCategory(category);

    const renderItem = ({ item }: { item: any }) => {
        return (
            <View className="flex-row bg-accent/50 px-10 py-2 rounded-xl">
                <View className="flex-col items-center w-full">
                    <Text className="text-center text-lg font-medium">{item.answer}</Text>
                    <Text className="text-center text-md font-light">{addLineAfterCommas(item.question)}</Text>
                </View>
            </View>);
    }

    return (
        <View className="flex-col justify-center p-2 gap-2">
            <Text className="text-center font-bold text-xl mb-5">{category}</Text>
            {bugtong.length > 0 ? (
                <FlatList
                    data={bugtong}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20, gap: 10 }}
                />
            ) : (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-muted-foreground text-center">
                        No bugtong in this category
                    </Text>
                </View>
            )}
        </View>
    )
}