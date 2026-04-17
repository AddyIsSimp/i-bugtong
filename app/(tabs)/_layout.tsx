import { tabs } from '@/constants/data';
import { colors, components } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabBar = components.tabBar;

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

interface TabIconProps {
    focused: boolean;
    icon: string;
}

const TabLayout = () => {
    const insets = useSafeAreaInsets();

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
        <Tabs
            initialRouteName="play"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: -2,
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
    );
};

export default TabLayout;