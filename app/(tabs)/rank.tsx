import images from "@/constants/images";
import { fetchLeaderboard, LeaderboardEntry } from "@/services/api";
import { LinearGradient } from "expo-linear-gradient";
import { styled } from "nativewind";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function Friends() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const rankedUsers = leaderboard.filter((user) => (user.points ?? 0) > 0);

    const getLeaderboardKey = (user: LeaderboardEntry, index: number) =>
        `${user.id}-${user.rank}-${user.name}-${index}`;

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

    const loadLeaderboard = async (showRefreshState = false) => {
        if (showRefreshState) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        setError(null);

        try {
            const data = await fetchLeaderboard();
            setLeaderboard(data);
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : 'Failed to load leaderboard');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        loadLeaderboard();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView className="flex-1 mb-20">
                {/* Header Section */}
                <View className="bg-accent/10 rounded-b-3xl pb-6 px-5 pt-5">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-2xl font-bold text-primary">
                            Leaderboard
                        </Text>
                        <TouchableOpacity
                            onPress={() => loadLeaderboard(true)}
                            disabled={isLoading || isRefreshing}
                            className="bg-primary px-4 py-2 rounded-full"
                            activeOpacity={0.8}
                        >
                            <Text className="text-white font-semibold">
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {error ? (
                        <Text className="text-center text-red-500 mb-4">
                            {error}
                        </Text>
                    ) : null}

                    {isLoading ? (
                        <View className="py-10 items-center">
                            <ActivityIndicator size="large" color="#0F766E" />
                            <Text className="text-muted-foreground mt-3">Loading leaderboard...</Text>
                        </View>
                    ) : (
                        <>

                            {/* Top 3 Rankings */}
                            <View className="flex-row justify-around items-end">
                                {/* Rank 2 */}
                                {rankedUsers[1] && (
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
                                                source={rankedUsers[1].profileUri ? { uri: rankedUsers[1].profileUri } : images.avatar}
                                                style={{
                                                    width: 62,
                                                    height: 62,
                                                    borderRadius: 31,
                                                }}
                                                resizeMode="cover"
                                            />
                                        </LinearGradient>
                                        <Text className="font-semibold text-foreground text-center">
                                            {rankedUsers[1].name}
                                        </Text>
                                        <Text className="text-muted-foreground">
                                            {rankedUsers[1].points} pts
                                        </Text>
                                    </View>
                                )}

                                {/* Rank 1 */}
                                {rankedUsers[0] && (
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
                                                source={rankedUsers[0].profileUri ? { uri: rankedUsers[0].profileUri } : images.avatar}
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: 40,
                                                }}
                                                resizeMode="cover"
                                            />
                                        </LinearGradient>
                                        <Text className="font-bold text-foreground text-center text-lg">
                                            {rankedUsers[0].name}
                                        </Text>
                                        <Text className="text-muted-foreground">
                                            {rankedUsers[0].points} pts
                                        </Text>
                                    </View>
                                )}

                                {/* Rank 3 */}
                                {rankedUsers[2] && (
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
                                                source={rankedUsers[2].profileUri ? { uri: rankedUsers[2].profileUri } : images.avatar}
                                                style={{
                                                    width: 62,
                                                    height: 62,
                                                    borderRadius: 31,
                                                }}
                                                resizeMode="cover"
                                            />
                                        </LinearGradient>
                                        <Text className="font-semibold text-foreground text-center">
                                            {rankedUsers[2].name}
                                        </Text>
                                        <Text className="text-muted-foreground">
                                            {rankedUsers[2].points} pts
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </>
                    )}
                </View>

                {/* Rest of Rankings */}
                <View className="px-5 pt-4">
                    {!isLoading && rankedUsers.length === 0 ? (
                        <Text className="text-center text-muted-foreground py-8">
                            No leaderboard data available yet.
                        </Text>
                    ) : null}

                    {rankedUsers.slice(3).map((user, index) => (
                        <View key={getLeaderboardKey(user, index)} className="flex-row items-center py-3 border-b border-border">
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
                                    source={user.profileUri ? { uri: user.profileUri } : images.avatar}
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
                                {user.points || 0} pts
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
