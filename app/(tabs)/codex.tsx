import CategorizeBugtong from "@/components/CategorizeBugtong";
import { bugtongList } from "@/constants/data";
import { colors } from "@/constants/theme";
import { getCategoryStatsArray, getSolvedBugtongCount } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Codex() {
    const categoryArray = getCategoryStatsArray();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleBackToCategories = () => {
        setSelectedCategory(null);
    }

    if (selectedCategory) {
        return (
            <SafeAreaView className="relative flex-1 bg-background">
                {/* Back Button */}
                <View className="flex-row w-fit px-2 items-center">
                    <TouchableOpacity
                        onPress={handleBackToCategories}
                        className="flex-row items-center justify-center p-2 rounded-md"
                    >
                        <MaterialIcons name="arrow-back" size={20} color='black' />
                    </TouchableOpacity>
                </View>

                {/* Show Bugtongs for selected category */}
                <CategorizeBugtong category={selectedCategory} />
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity className="flex-row justify-between items-center bg-accent/30 p-4 rounded-lg 
                border border-border mb-3"
            onPress={() => setSelectedCategory(item.category)}>
            <Text className="text-foreground font-medium flex-1">
                {item.category}
            </Text>
            <View className="flex-row items-center gap-3">
                {/* <View className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <View
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percentage}%` }}
                    />
                </View> */}
                <Text className="text-muted-foreground text-sm font-mono min-w-[40px]">
                    {item.ratio}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-primary">Codex</Text>
                    <View className="px-3 py-1 bg-accent rounded-lg">
                        <Text className="text-lg font-medium text-white">
                            {getSolvedBugtongCount('all')} / {bugtongList.length}
                        </Text>
                    </View>
                </View>

                {/* Categories List */}
                {categoryArray.length > 0 ? (
                    <FlatList
                        data={categoryArray}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-muted-foreground text-center">
                            No categories available
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>


    );
}