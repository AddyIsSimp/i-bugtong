import CategorizeBugtong from "@/components/CategorizeBugtong";
import { colors } from "@/constants/theme";
import { useGame } from "@/contexts/GameContext";
import { getBugtongImageSource, getCategoryStatsArray, getSolvedBugtongCount } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { styled } from "nativewind";
import { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Codex() {
    const { bugtongs } = useGame();
    const categoryArray = getCategoryStatsArray(bugtongs);
    const openedBugtongs = bugtongs.filter((bugtong) => bugtong.solved);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const getCategoryPreviewBugtong = (category: string) => {
        const categoryBugtongs = bugtongs.filter((bugtong) => bugtong.category === category);

        return (
            categoryBugtongs.find((bugtong) => bugtong.solved && getBugtongImageSource(bugtong)) ??
            null
        );
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
    }

    if (selectedCategory) {
        return (
            <SafeAreaView className="relative flex-1 bg-background">
                {/* Back Button */}
                <View className="relative flex-row w-full items-center px-2 pt-2 pb-2">
                    <TouchableOpacity
                        onPress={handleBackToCategories}
                        className="z-10 flex-row items-center justify-center p-2 rounded-md"
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
                    </TouchableOpacity>

                    {/* Center text with absolute positioning */}
                    <Text className="absolute left-0 right-0 text-center text-xl font-bold text-foreground">
                        {selectedCategory}
                    </Text>

                    {/* Empty view for balance */}
                    <View className="w-10" />
                </View>

                {/* Show Bugtongs for selected category */}
                <CategorizeBugtong category={selectedCategory} />
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }: { item: any }) => {
        const previewBugtong = getCategoryPreviewBugtong(item.category);
        const previewImageSource = previewBugtong ? getBugtongImageSource(previewBugtong) : null;

        return (
            <TouchableOpacity
                className="mb-3 flex-row items-center justify-between rounded-lg border border-border bg-accent/30 p-4"
                onPress={() => setSelectedCategory(item.category)}
            >
                <View className="flex-1 flex-row items-center gap-3">
                    <View className="h-14 w-14 overflow-hidden rounded-xl bg-white/80">
                        {previewImageSource ? (
                            <Image
                                source={previewImageSource}
                                className="h-full w-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="h-full w-full items-center justify-center bg-muted">
                                <MaterialIcons name="image" size={22} color={colors.mutedForeground} />
                            </View>
                        )}
                    </View>

                    <Text className="flex-1 text-foreground font-medium">
                        {item.category}
                    </Text>
                </View>

                <View className="flex-row items-center gap-3">
                    <Text className="min-w-[40px] text-sm font-mono text-muted-foreground">
                        {item.ratio}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderOpenedBugtong = ({ item }: { item: BugtongProps }) => {
        const imageSource = getBugtongImageSource(item);

        return (
            <TouchableOpacity
                activeOpacity={0.85}
                className="mr-3 w-32 rounded-2xl bg-white p-2 border border-border"
                onPress={() => setSelectedCategory(item.category)}
            >
                {imageSource && (
                    <Image
                        source={imageSource}
                        className="h-24 w-full rounded-xl"
                        resizeMode="cover"
                    />
                )}
                <Text className="mt-2 text-center text-sm font-semibold text-primary" numberOfLines={1}>
                    {item.answer}
                </Text>
                <Text className="mt-1 text-center text-xs text-muted-foreground" numberOfLines={2}>
                    {item.category}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-primary">Codex</Text>
                    <View className="px-3 py-1 bg-accent rounded-lg">
                        <Text className="text-lg font-medium text-white">
                            {getSolvedBugtongCount(bugtongs, 'all')} / {bugtongs.length}
                        </Text>
                    </View>
                </View>

                {/* <View className="mb-6">
                    <View className="mb-3 flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-primary">Opened Bugtongs</Text>
                        <Text className="text-sm text-muted-foreground">
                            {openedBugtongs.length} found
                        </Text>
                    </View>

                    {openedBugtongs.length > 0 ? (
                        <FlatList
                            data={openedBugtongs}
                            renderItem={renderOpenedBugtong}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 8 }}
                        />
                    ) : (
                        <View className="rounded-2xl border border-dashed border-border bg-white/60 px-4 py-5">
                            <Text className="text-center text-sm text-muted-foreground">
                                Solve bugtongs to show them here.
                            </Text>
                        </View>
                    )}
                </View> */}

                {/* Categories List */}
                {categoryArray.length > 0 ? (
                    <FlatList
                        data={categoryArray}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 50 }}
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
