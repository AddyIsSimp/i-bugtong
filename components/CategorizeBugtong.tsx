import { addLineAfterCommas, getBugtongImage, getBugtongsByCategory } from "@/utils";
import { FlatList, Image, Text, View } from "react-native";

interface CategorizeBugtongProps {
    category: string;
}

export default function CategorizeBugtong({ category }: CategorizeBugtongProps) {
    const bugtong = getBugtongsByCategory(category);

    // const renderItem = ({ item }: { item: any }) => {
    //     const imageSource = getBugtongImage(item.id);
    //     return (
    //         <View className="flex-row bg-accent/50 px-10 py-2 rounded-xl">
    //             <View className="flex-col items-center w-full">
    //                 {imageSource && (
    //                     <Image
    //                         source={imageSource}
    //                         className="w-32 h-32 rounded-lg mb-2"
    //                         style={{ width: 128, height: 128 }}
    //                         resizeMode="contain"
    //                     />
    //                 )}
    //                 <Text className="text-center text-lg font-medium">{item.answer}</Text>
    //                 <Text className="text-center text-md font-light">{addLineAfterCommas(item.question)}</Text>
    //             </View>
    //         </View>);
    // }

    const renderItem = ({ item }: { item: any }) => {
        const imageSource = getBugtongImage(item.id);
        return (
            <View className="bg-accent/30 px-4 py-3 rounded-xl">
                <View className="flex-row items-center w-full gap-2">
                    {imageSource && (
                        <Image
                            source={imageSource}
                            className="w-32 h-32 rounded-lg mb-2"
                            style={{ width: 128, height: 128 }}
                            resizeMode="contain"
                        />
                    )}
                    <View className="flex-col flex-1">
                        <Text className="text-center text-lg font-bold text-primary">
                            {item.answer}
                        </Text>
                        <Text className="text-center text-md font-light whitespace-pre-line">
                            {addLineAfterCommas(item.question)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-col justify-center py-1 px-5 gap-2 mb-30">
            {/* <Text className="text-center font-bold text-xl">{category}</Text> */}
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