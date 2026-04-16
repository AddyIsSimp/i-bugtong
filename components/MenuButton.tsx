import clsx from 'clsx';
import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';

export default function MenuButton() {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <View className="w-fit justify-center items-center">
            <Pressable
                onPress={() => setMenuVisible(true)}
                className={clsx(
                    "p-2 rounded-lg items-center justify-center",
                    menuVisible ? "bg-accent" : "bg-transparent"
                )}
            >
                <FontAwesome name="bars" size={20} color="colors.primary" />
            </Pressable>

            <Modal
                animationType="fade"
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable
                    className="w-fit bg-black/40 justify-start items-end pt-15 px-2"
                    onPress={() => setMenuVisible(false)}
                >
                    {/* Menu Card */}
                    <View className="w-2/5 bg-white rounded-xl px-5 py-1 shadow-lg">
                        <Text className="text-lg py-3 border-b border-gray-100">Home</Text>
                        <Text className="text-lg py-3 border-b border-gray-100">Settings</Text>
                        <Text className="text-lg py-3 text-red-500">Logout</Text>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}