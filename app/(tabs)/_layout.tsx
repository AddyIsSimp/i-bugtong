import { tabs } from '@/constants/data';
import { colors, components } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import clsx from "clsx";
import { Tabs } from "expo-router";
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabBar = components.tabBar;

const TabLayout = () => {
    const insets = useSafeAreaInsets();

    const TabIcon = ({
        focused,
        icon,
        isPlay,
    }: TabIconProps & { isPlay?: boolean }) => (
        <View
            className="tabs-icon"
            style={isPlay ? { marginTop: -28 } : undefined}
        >
            <View
                className={clsx(
                    "tabs-pill",
                    focused && "tabs-active",
                    isPlay && "tabs-play-pill"
                )}
            >
                <FontAwesome
                    name={icon}
                    size={isPlay ? 35 : 25}
                    color={colors.background} />
            </View>
        </View>
    );

    return (
        <Tabs initialRouteName="play" screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                position: 'absolute',
                // bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                bottom: -2,
                height: tabBar.height,
                // marginHorizontal: tabBar.horizontalInset,
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
