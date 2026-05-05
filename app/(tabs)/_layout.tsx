import { tabs } from '@/constants/data';
import { colors, components } from '@/constants/theme';
import { checkApiHealth } from '@/services/api';
import { FontAwesome } from '@expo/vector-icons';
import NetInfo from "@react-native-community/netinfo";
import { Tabs } from "expo-router";
import { useEffect, useState } from 'react';
import { Alert, Animated, AppState, BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabBar = components.tabBar;
const API_HEALTH_CHECK_INTERVAL = 15000;

interface TabIconProps {
    focused: boolean;
    icon: string;
}

const TabLayout = () => {
    //Online detection
    const [isOnline, setIsOnline] = useState(true);
    const [isApiReachable, setIsApiReachable] = useState(true);
    const [bannerAnimation] = useState(new Animated.Value(0));
    const insets = useSafeAreaInsets();

    const bannerMessage = !isOnline
        ? 'You are offline. Please check your internet connection.'
        : !isApiReachable
            ? 'Server is not running or not responding right now.'
            : null;
    const bannerBackgroundColor = !isOnline ? 'rgba(239, 68, 68, 0.92)' : 'rgba(245, 158, 11, 0.95)';

    useEffect(() => {
        Animated.timing(bannerAnimation, {
            toValue: bannerMessage ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [bannerAnimation, bannerMessage]);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            const connected = !!state.isConnected;
            setIsOnline(connected);
        });
        return () => unsubscribe();
    }, []);

    // useEffect(() => {
    //     let isMounted = true;

    //     const runHealthCheck = async () => {
    //         if (!isOnline) {
    //             if (isMounted) {
    //                 setIsApiReachable(true);
    //             }
    //             return;
    //         }

    //         const isHealthy = await checkApiHealth();
    //         if (isMounted) {
    //             setIsApiReachable(isHealthy);
    //         }
    //     };

    //     runHealthCheck();

    //     const intervalId = setInterval(runHealthCheck, API_HEALTH_CHECK_INTERVAL);
    //     const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
    //         if (nextAppState === 'active') {
    //             runHealthCheck();
    //         }
    //     });

    //     return () => {
    //         isMounted = false;
    //         clearInterval(intervalId);
    //         appStateSubscription.remove();
    //     };
    // }, [isOnline]);

    // Handle back button press on Android
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Get the current route to check if we're on the main screen
            // You can customize this based on your navigation state
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
            return true; // Return true to prevent default behavior
        });

        return () => backHandler.remove();
    }, []);

    const TabIcon = ({
        focused,
        icon,
        isPlay,
    }: TabIconProps & { isPlay?: boolean }) => (
        <View
            style={[
                tabStyles.tabsIcon,
                isPlay && { marginTop: -28 }
            ]}
        >
            <View
                style={[
                    tabStyles.tabsPill,
                    focused && tabStyles.tabsActive,
                    isPlay && tabStyles.tabsPlayPill
                ]}
            >
                <FontAwesome
                    name={icon as any}
                    size={isPlay ? 35 : 25}
                    color={colors.background}
                />
            </View>
        </View>
    );

    return (
        <>
            <Tabs
                initialRouteName="play"
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: -6,
                        height: tabBar.height,
                        marginHorizontal: 0,
                        right: tabBar.horizontalInset,
                        borderRadius: tabBar.radius,
                        backgroundColor: colors.primary,
                        borderTopWidth: 0,
                        elevation: 0,
                    },
                    tabBarItemStyle: {
                        paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
                    },
                    tabBarIconStyle: {
                        width: tabBar.iconFrame,
                        height: tabBar.iconFrame,
                        alignItems: 'center',
                    }
                }}
            >
                {tabs.map((tab) => (
                    <Tabs.Screen
                        key={tab.name}
                        name={tab.name}
                        options={{
                            title: tab.title,
                            tabBarItemStyle: tab.name === "play"
                                ? {
                                    paddingVertical: 0,
                                    marginTop: -8,
                                }
                                : {
                                    paddingVertical: tabBar.itemPaddingVertical,
                                },
                            tabBarIcon: ({ focused }) => (
                                <TabIcon
                                    focused={focused}
                                    icon={tab.icon}
                                    isPlay={tab.name === "play"}
                                />
                            ),
                        }}
                    />
                ))}
            </Tabs>
            {/* Connectivity / server status banner */}
            {bannerMessage && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: insets.top + 8,
                        left: 12,
                        right: 12,
                        zIndex: 20,
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        backgroundColor: bannerBackgroundColor,
                        opacity: bannerAnimation,
                        transform: [{
                            translateY: bannerAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-50, 0]
                            })
                        }]
                    }}
                >
                    <Text className="text-white text-center">{bannerMessage}</Text>
                </Animated.View>
            )}
        </>
    );
};

// Define the component styles using StyleSheet
const tabStyles = StyleSheet.create({
    tabsIcon: {
        width: 48,  // size-12 (12 * 4 = 48)
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabsPill: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        backgroundColor: 'transparent',
    },
    tabsActive: {
        backgroundColor: colors.accent, // Using your theme's accent color
    },
    tabsPlayPill: {
        width: 76,
        height: 76,
        borderRadius: 9999,
        backgroundColor: colors.accent,
        borderWidth: 4,
        borderColor: colors.background,
    },
    tabsGlyph: {
        width: 24,  // size-6 (6 * 4 = 24)
        height: 24,
    },
});

export default TabLayout;


