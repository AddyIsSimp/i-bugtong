import { useGame } from "@/contexts/GameContext";
import { useUser } from "@/contexts/UserContext";
import { colors } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from 'react';
import { Alert, BackHandler, Modal, Platform, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface SettingModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingModal({ visible, onClose }: SettingModalProps) {
    const [isMusicEnabled, setIsMusicEnabled] = useState(true);
    const [isSFXEnabled, setIsSFXEnabled] = useState(true);
    const [isRefreshingBugtong, setIsRefreshingBugtong] = useState(false);
    const { resetStoredProgress, refreshBugtongs } = useGame();
    const { signOut, userInfo } = useUser();

    const handleResetProgress = () => {
        Alert.alert(
            'Reset Progress',
            'This will clear your local game progress, hints, and rewards. Continue?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        resetStoredProgress();
                        onClose();
                        Alert.alert('Progress Reset', 'Your local game progress has been cleared.');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Do you want to sign out of this device?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => {
                        signOut();
                        onClose();
                        router.replace('/(auth)/sign-in');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleRefreshBugtong = async () => {
        if (userInfo.id == null) {
            Alert.alert('Refresh Bugtong', 'Please log in first before refreshing bugtong.');
            return;
        }

        try {
            setIsRefreshingBugtong(true);
            const refreshed = await refreshBugtongs();

            if (!refreshed) {
                Alert.alert('Refresh Bugtong', 'Unable to refresh bugtong right now.');
                return;
            }

            Alert.alert('Refresh Bugtong', 'Bugtong list has been updated from the server.');
        } catch (error) {
            Alert.alert(
                'Refresh Bugtong Failed',
                error instanceof Error ? error.message : 'Unable to fetch the latest bugtong.',
            );
        } finally {
            setIsRefreshingBugtong(false);
        }
    };

    const handleExitApp = () => {
        Alert.alert(
            'Exit App',
            'Are you sure you want to exit?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Exit cancelled'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        if (Platform.OS === 'android') {
                            // For Android, use BackHandler.exitApp()
                            BackHandler.exitApp();
                        } else {
                            // For iOS, you might want to send the app to background
                            // or use a different approach
                            console.log('Exit pressed on iOS');
                            // On iOS, you can't programmatically close the app
                            Alert.alert('Info', 'Press the home button to close the app');
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
        return true;
    };

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
                                <View className="flex-row items-center justify-between border border-gray-200 py-1 px-5 rounded-2xl">
                                    <Text className="text-start text-lg text-black">Music</Text>
                                    <Switch
                                        value={isMusicEnabled}
                                        onValueChange={setIsMusicEnabled}
                                        trackColor={{ false: '#d1d5db', true: colors.accent }}
                                        thumbColor={isMusicEnabled ? '#ffffff' : '#f4f3f4'}
                                    />
                                </View>

                                <View className="flex-row items-center justify-between border border-gray-200 py-1 px-5 rounded-2xl">
                                    <Text className="text-start text-lg text-black">SFX</Text>
                                    <Switch
                                        value={isSFXEnabled}
                                        onValueChange={setIsSFXEnabled}
                                        trackColor={{ false: '#d1d5db', true: '#4CD964' }}
                                        thumbColor={isSFXEnabled ? '#ffffff' : '#f4f3f4'}
                                    />
                                </View>

                                <TouchableOpacity
                                    className={`border border-green-200 bg-green-50 py-3 px-5 rounded-2xl ${isRefreshingBugtong ? 'opacity-70' : ''}`}
                                    onPress={handleRefreshBugtong}
                                    disabled={isRefreshingBugtong}
                                >
                                    <Text className="text-lg text-green-700 font-medium text-center">
                                        {isRefreshingBugtong ? 'Refreshing Bugtong...' : 'Refresh Bugtong'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="border border-orange-200 bg-orange-50 py-3 px-5 rounded-2xl"
                                    onPress={handleResetProgress}
                                >
                                    <Text className="text-lg text-orange-700 font-medium text-center">Reset Progress</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="border border-blue-200 bg-blue-50 py-3 px-5 rounded-2xl"
                                    onPress={handleSignOut}
                                >
                                    <Text className="text-lg text-blue-700 font-medium text-center">Sign Out</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity className="w-full bg-red-400 py-2 rounded-2xl" onPress={handleExitApp}>
                                <Text className="text-center text-lg text-white">Exit</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
