import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import {useState} from 'react';
import { colors } from "@/constants/theme";

interface SettingModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingModal({ visible, onClose }: SettingModalProps) {
    const [isMusicEnabled, setIsMusicEnabled] = useState(true);
    const [isSFXEnabled, setIsSFXEnabled] = useState(true);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 items-center justify-center bg-gray-900/70">
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <View className="w-4/5 h-4/6 flex-col justify-between bg-white rounded-2xl p-4 gap-4 shadow-lg -mt-20 pb-10">
                            {/* Header */}
                            <View className="flex-row items-center justify-between gap-2">
                                <TouchableOpacity
                                    className="rounded-full bg-gray-100 p-2"
                                    onPress={onClose}
                                >
                                    <MaterialIcons name="arrow-back" size={24} color="black" />
                                </TouchableOpacity>
                                <View className="flex-row items-center justify-center">
                                    <Text className="text-center font-bold text-xl">Settings</Text>
                                </View>
                                <View className="w-10" />
                            </View>

                            {/* Settings Options */}
                            <View className="flex-col gap-3">
                                {/* Music Toggle */}
                                <View className="flex-row items-center justify-between border border-gray-200 py-1 px-5 rounded-2xl">
                                    <Text className="text-start text-lg text-black">Music</Text>
                                    <Switch
                                        value={isMusicEnabled}
                                        onValueChange={setIsMusicEnabled}
                                        trackColor={{ false: '#d1d5db', true: colors.accent }}
                                        thumbColor={isMusicEnabled ? '#ffffff' : '#f4f3f4'}
                                    />
                                </View>

                                {/* SFX Toggle */}
                                <View className="flex-row items-center justify-between border border-gray-200 py-1 px-5 rounded-2xl">
                                    <Text className="text-start text-lg text-black">SFX</Text>
                                    <Switch
                                        value={isSFXEnabled}
                                        onValueChange={setIsSFXEnabled}
                                        trackColor={{ false: '#d1d5db', true: '#4CD964' }}
                                        thumbColor={isSFXEnabled ? '#ffffff' : '#f4f3f4'}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity className="w-full bg-red-400 py-2 rounded-2xl">
                                <Text className="text-center text-lg text-white">Exit</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}