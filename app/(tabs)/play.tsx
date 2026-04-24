import { router } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import Avatar from "@/components/Avatar";
import ProfileModal from "@/components/ProfileModal";
import { Separator } from "@/components/Separator";
import { gameAssets, levels } from "@/constants/data";
import { useUser } from "@/contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";
import SettingModal from "@/components/SettingModal";

const SafeAreaView = styled(RNSafeAreaView);

export default function Play() {
    // Profile
    const [profileVisible, setProfileVisible] = React.useState(false);
    const [settingVisible, setSettingVisible] = React.useState(false);
    const { userInfo } = useUser();

    // Navigate Difficulty button
    const handleLevelPress = (level: typeof levels[0]) => {
        if (!level.locked) {
            router.push({
                pathname: "/game",
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

    return (
        <SafeAreaView className="relative flex-1 bg-background">
            <View className="flex-1">
                {/* Game Content */}
                <View className="flex-1">
                    {/* Game Assets */}
                    <View className="flex-row items-center justify-between px-6 py-1 mb-5 bg-white">
                        {gameAssets.map((asset) => (
                            <View className="flex-row items-center justify-center gap-1" key={asset.name}>
                                <Text className="text-md text-primary">{asset.quantity}</Text>
                                <Image source={asset.icon} className="w-5 h-5" style={{ width: 20, height: 20 }} />
                            </View>
                        ))}
                    </View>

                    {/* Avatar Section */}
                    <View className="flex-row justify-between px-4 mb-4">
                        <TouchableOpacity onPress={() => setProfileVisible(true)}>
                            <View className="flex-row items-center">
                                <Avatar size='md' />
                                <View className="-z-1 ml-[-12px] bg-accent rounded-r-full rounded-l-md px-4 py-2 shadow-md">
                                    <Text className="text-white font-semibold text-base">
                                        {userInfo.name}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="p-2 h-fit w-fit bg-gray-700 rounded-full flex items-center 
                            justify-center" style={{ width: 40, height: 40 }}
                            onPress={() => setSettingVisible(!settingVisible)}>
                            <MaterialIcons name='settings' size={20} color='white'/>
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
                                            <Text className="text-xl font-bold text-white">{level.name}</Text>
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