import React from "react";

import { router } from "expo-router";
import { styled } from "nativewind";
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import Avatar from "@/components/Avatar";
import MenuButton from "@/components/MenuButton";
import { Separator } from "@/components/Separator";
import { gameAssets, levels } from "@/constants/data";
import clsx from "clsx";

const SafeAreaView = styled(RNSafeAreaView);

export default function Play() {

    const handleLevelPress = (level: typeof levels[0]) => {
        if (!level.locked) {
            router.push({
                pathname: "/game/game",
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
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1">

                {/* Game Content */}
                <View className="relative px-2 py-1 mt-1">
                    <View className="w-4/5 absolute top-1 left-3 flex flex-row gap-4 items-start rounded-full">
                        <Avatar />

                    </View>
                    {/* Game Assets */}
                    <View className="absolute top-0 right-1 w-fit flex-row-reverse items-center gap-2 py-1 px-2">
                        <MenuButton />
                        <View className="flex-row gap-7 justify-between  
                    bg-white px-5 items-center rounded-full">
                            {gameAssets.map((asset) => (
                                <View className="flex-row items-end justify-end gap-1 px-0 py-1" key={asset.name}>
                                    <Text className="text-sm text-primary">{asset.quantity}</Text>
                                    <Image source={asset.icon} className="w-5 h-5" />
                                </View>))
                            }
                        </View>
                    </View>

                    <View className="w-full absolute top-0 left-0 mt-30 flex-1 flex-col items-start gap-1 justify-start px-3">
                        <Text className="text-xl font-bold text-primary">Difficulty</Text>
                        <Separator orientation="horizontal" thickness={1} color="gray" className="" />
                        <View className="flex-1 mt-1 flex-col items-center gap-2 w-full">
                            {levels.map((level) => (
                                <TouchableOpacity
                                    key={level.name}
                                    onPress={() => handleLevelPress(level)}
                                    activeOpacity={level.locked ? 1 : 0.7}
                                    disabled={level.locked}
                                    className="w-full"
                                >
                                    <ImageBackground
                                        key={level.name}
                                        source={level.background}
                                        className={clsx("w-full rounded-lg h-24 w-full", level.locked && "opacity-50")}
                                        imageStyle={{ borderRadius: 8 }}
                                    >
                                        <View className="w-full flex-1 flex-col justify-between p-4 bg-black/40"> {/* Added overlay for better text visibility */}
                                            <Text className="text-xl font-bold text-white">{level.name}</Text>
                                            <Separator orientation="horizontal" thickness={1} color="rgba(255,255,255,0.3)" length={"100%"} margin={10} />
                                            <View className="flex-row justify-between mt-2">
                                                <Text className="text-sm text-white">{level.time}</Text>
                                                {level.freeHint !== 0 && (
                                                    <Text className="text-sm text-white">{`${level.freeHint} free hint`}</Text>
                                                )}
                                                <Text className="text-sm text-white">{level.hints} hints</Text>
                                            </View>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};