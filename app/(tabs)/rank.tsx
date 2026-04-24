import { rankingList } from "@/constants/data";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Friends() {
    const getRankGradient = (rank: number) => {
        switch (rank) {
            case 1:
                return ['#CD7F32', '#FFD700', '#804A00'] as const; // Gold
            case 2:
                return ['#C0C0C0', '#E8E8E8', '#808080'] as const; // Silver
            case 3:
                return ['#CD7F32', '#D4AF37', '#8B4513'] as const; // Bronze
            default:
                return ['#6B7280', '#9CA3AF', '#4B5563'] as const; // Gray
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 mb-20">
                {/* Header Section */}
                <View className="bg-accent/10 rounded-b-3xl pb-6 px-5 pt-5">
                    <Text className="text-2xl font-bold text-primary text-center mb-6">
                        Leaderboard
                    </Text>

                    {/* Top 3 Rankings */}
                    <View className="flex-row justify-around items-end">
                        {/* Rank 2 */}
                        {rankingList[1] && (
                            <View className="items-center flex-1">
                                <Text className="text-lg text-muted-foreground mb-1">2nd</Text>
                                <LinearGradient
                                    colors={getRankGradient(2)}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="items-center justify-center mb-2"
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 35,
                                    }}
                                >
                                    <Image
                                        source={rankingList[1].profile}
                                        style={{
                                            width: 62,
                                            height: 62,
                                            borderRadius: 31,
                                        }}
                                        resizeMode="cover"
                                    />
                                </LinearGradient>
                                <Text className="font-semibold text-foreground text-center">
                                    {rankingList[1].name}
                                </Text>
                            </View>
                        )}

                        {/* Rank 1 */}
                        {rankingList[0] && (
                            <View className="items-center flex-1 mb-3">
                                <Text className="text-lg text-muted-foreground mb-1">1st</Text>
                                <LinearGradient
                                    colors={getRankGradient(1)}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="items-center justify-center mb-2"
                                    style={{
                                        width: 90,
                                        height: 90,
                                        borderRadius: 45,
                                        borderWidth: 2,
                                        borderColor: '#FFD700',
                                    }}
                                >
                                    <Image
                                        source={rankingList[0].profile}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                        }}
                                        resizeMode="cover"
                                    />
                                </LinearGradient>
                                <Text className="font-bold text-foreground text-center text-lg">
                                    {rankingList[0].name}
                                </Text>
                            </View>
                        )}

                        {/* Rank 3 */}
                        {rankingList[2] && (
                            <View className="items-center flex-1">
                                <Text className="text-lg text-muted-foreground mb-1">3rd</Text>
                                <LinearGradient
                                    colors={getRankGradient(3)}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="items-center justify-center mb-2"
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 35,
                                    }}
                                >
                                    <Image
                                        source={rankingList[2].profile}
                                        style={{
                                            width: 62,
                                            height: 62,
                                            borderRadius: 31,
                                        }}
                                        resizeMode="cover"
                                    />
                                </LinearGradient>
                                <Text className="font-semibold text-foreground text-center">
                                    {rankingList[2].name}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Rest of Rankings */}
                <View className="px-5 pt-4">
                    {rankingList.slice(3).map((user, index) => (
                        <View key={user.id} className="flex-row items-center py-3 border-b border-border">
                            <Text className="w-10 text-center font-bold text-muted-foreground">
                                #{index + 4}
                            </Text>
                            <LinearGradient
                                colors={getRankGradient(4)}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="items-center justify-center mx-3"
                                style={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: 22.5,
                                }}
                            >
                                <Image
                                    source={user.profile}
                                    style={{
                                        width: 39,
                                        height: 39,
                                        borderRadius: 19.5,
                                    }}
                                    resizeMode="cover"
                                />
                            </LinearGradient>
                            <Text className="flex-1 font-medium text-foreground">
                                {user.name}
                            </Text>
                            <Text className="text-muted-foreground">
                                {user.score || 0} pts
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}