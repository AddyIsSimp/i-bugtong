import { router, useFocusEffect } from "expo-router";
import { styled } from "nativewind";
import React, { useCallback } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import Avatar from "@/components/Avatar";
import GameAssetHeader from "@/components/GameAssetHeader";
import ProfileModal from "@/components/ProfileModal";
import { Separator } from "@/components/Separator";
import SettingModal from "@/components/SettingModal";
import { useGame } from "@/contexts/GameContext";
import { useUser } from "@/contexts/UserContext";
import { getBugtongStats, isAllBugtongsSolved, toLowerCase } from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { clsx } from "clsx";

const SafeAreaView = styled(RNSafeAreaView);

export default function Play() {
    // Profile
    const [profileVisible, setProfileVisible] = React.useState(false);
    const [settingVisible, setSettingVisible] = React.useState(false);
    const { userInfo } = useUser();
    const { bugtongs, levels, setLevels } = useGame();

    // Navigate Difficulty button
    const handleLevelPress = (level: typeof levels[0]) => {
        if (!level.locked) {
            router.push({
                pathname: "/game/gamePage",
                params: {
                    levelName: level.name,
                    levelDifficulty: level.difficulty,
                    levelTime: level.time,
                    levelHints: level.hints,
                    levelFreeHint: level.freeHint,
                }
            });
        }
    };

    useFocusEffect(
        useCallback(() => {
            const checkAndUnlockLevels = () => {
                const updatedLevels = levels.map((level, index) => {
                    if (level.locked && index > 0) {
                        const previousLevelName = levels[index - 1].name;
                        const previousLevelCompleted = isAllBugtongsSolved(
                            bugtongs,
                            toLowerCase(previousLevelName)
                        );

                        if (previousLevelCompleted) {
                            return { ...level, locked: false };
                        }
                    }
                    return level;
                });

                if (JSON.stringify(updatedLevels) !== JSON.stringify(levels)) {
                    setLevels(updatedLevels);
                }
            }

            checkAndUnlockLevels();
        }, [bugtongs, levels, setLevels])
    );

    //HELPER FUNCTIONS
    const getLevelProgress = (levelName: string): string => {
        const stats = getBugtongStats(bugtongs, toLowerCase(levelName) as Difficulty);
        return `${stats.solved}/${stats.total}`;
    };

    return (
        <SafeAreaView className="relative flex-1 bg-background">
            <View className="flex-1">
                {/* Game Content */}
                <View className="flex-1">
                    {/* Game Assets */}
                    <View className="flex-row px-3">
                        <GameAssetHeader variant="full" />
                        <TouchableOpacity className="p-2 h-fit w-fit bg-gray-700 rounded-full flex items-center 
                            justify-center" style={{ width: 40, height: 40 }}
                            onPress={() => setSettingVisible(!settingVisible)}>
                            <MaterialIcons name='settings' size={20} color='white' />
                        </TouchableOpacity>
                    </View>

                    {/* Avatar Section */}
                    <View className="flex-row justify-between px-4 mb-4">
                        <TouchableOpacity onPress={() => setProfileVisible(true)} className="flex-1">
                            <View className="flex-row items-center">
                                <Avatar size='lg' />
                                <View className="flex-col ml-[-13px]">
                                    <View className="-z-1 bg-accent rounded-r-full rounded-l-md px-4 w-35 py-2 shadow-md">
                                        <Text className="text-white font-semibold text-base">
                                            {userInfo.name}
                                        </Text>
                                    </View>
                                    <View className="-z-1 bg-primary rounded-br-full rounded-l-md px-4 w-20 py-0.5 shadow-md">
                                        <Text className="text-white font-semibold text-base">
                                            {userInfo.points}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                    </View>



                    {/* Levels Section */}
                    <View className="flex-1 flex-col gap-2 px-4">
                        <Text className="text-xl font-bold text-primary">Difficulty</Text>
                        <Separator orientation="horizontal" thickness={1} color="gray" className="mb-4" />
                        <View className="flex-1 gap-3 pb-4">
                            {levels.map((level) => (
                                <TouchableOpacity
                                    key={level.name}
                                    onPress={() => handleLevelPress(level)}
                                    activeOpacity={level.locked ? 1 : 0.7}
                                    disabled={level.locked}
                                    className="w-full"
                                >
                                    <ImageBackground
                                        source={level.background}
                                        className={clsx("relative w-full rounded-lg h-28 overflow-hidden", level.locked && "opacity-50")}
                                        imageStyle={{ borderRadius: 12 }}
                                    >
                                        <View className="w-full h-full flex-col justify-between p-4 bg-black/50">
                                            <View className="flex-row justify-between items-center">
                                                <Text className="text-xl font-bold text-white">{level.name}</Text>
                                                <Text className="text-white text-md font-medium">
                                                    {getLevelProgress(level.name)}
                                                </Text>
                                            </View>
                                            <Separator orientation="horizontal" thickness={1} color="rgba(255,255,255,0.3)" margin={8} />
                                            <View className="flex-row justify-between mt-1">
                                                <Text className="text-sm text-white">⏱️ {level.time}s</Text>
                                                {level.freeHint !== 0 && (
                                                    <Text className="text-sm text-white">💡 {level.freeHint} free hint</Text>
                                                )}
                                                <Text className="text-sm text-white">🔍 {level.hints} hints</Text>
                                            </View>
                                            {level.locked && <MaterialIcons name="lock" size={30} color='black'
                                                className="absolute top-1/2 right-1/2" />}
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </View>

                {/* Profile Modal */}
                <ProfileModal
                    visible={profileVisible}
                    onClose={() => setProfileVisible(false)}
                />

                <SettingModal
                    visible={settingVisible}
                    onClose={() => setSettingVisible(false)}
                />
            </View>
        </SafeAreaView>
    );
}
