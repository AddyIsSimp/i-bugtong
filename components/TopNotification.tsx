import { colors } from '@/constants/theme';
import {
    AppNotificationPayload,
    subscribeToNotifications,
} from '@/utils/errorNotification';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AUTO_DISMISS_MS = 5000;
const HIDDEN_OFFSET = -180;

const backgroundColorByType = {
    error: '#b91c1c',
    success: '#15803d',
    info: colors.primary,
} as const;

const iconByType = {
    error: 'error-outline',
    success: 'check-circle-outline',
    info: 'info-outline',
} as const;

export default function TopNotification() {
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(HIDDEN_OFFSET)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isVisibleRef = useRef(false);
    const [notification, setNotification] = useState<AppNotificationPayload | null>(null);

    const clearDismissTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const hideNotification = useCallback(() => {
        clearDismissTimer();

        Animated.parallel([
            Animated.timing(translateY, {
                toValue: HIDDEN_OFFSET,
                duration: 220,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
        ]).start(() => {
            isVisibleRef.current = false;
            setNotification(null);
        });
    }, [opacity, translateY]);

    const startDismissTimer = useCallback(() => {
        clearDismissTimer();
        timeoutRef.current = setTimeout(hideNotification, AUTO_DISMISS_MS);
    }, [hideNotification]);

    useEffect(() => {
        const unsubscribe = subscribeToNotifications((nextNotification) => {
            const wasVisible = isVisibleRef.current;
            setNotification(nextNotification);
            isVisibleRef.current = true;

            if (!wasVisible) {
                translateY.setValue(HIDDEN_OFFSET);
                opacity.setValue(0);

                Animated.parallel([
                    Animated.spring(translateY, {
                        toValue: 0,
                        damping: 18,
                        stiffness: 180,
                        mass: 0.8,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 180,
                        useNativeDriver: true,
                    }),
                ]).start();
            }

            startDismissTimer();
        });

        return () => {
            clearDismissTimer();
            unsubscribe();
        };
    }, [opacity, startDismissTimer, translateY]);

    if (!notification) {
        return null;
    }

    const type = notification.type ?? 'info';

    return (
        <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
            <Pressable
                onPress={hideNotification}
                style={[
                    styles.wrapper,
                    {
                        paddingTop: insets.top + 8,
                    },
                ]}
            >
                <Animated.View
                    style={[
                        styles.banner,
                        {
                            backgroundColor: backgroundColorByType[type],
                            opacity,
                            transform: [{ translateY }],
                        },
                    ]}
                >
                    <MaterialIcons
                        color="#fff"
                        name={iconByType[type]}
                        size={22}
                    />
                    <View style={styles.textContainer}>
                        {!!notification.title && (
                            <Text style={styles.title}>{notification.title}</Text>
                        )}
                        <Text style={styles.message}>{notification.message}</Text>
                    </View>
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 9999,
    },
    banner: {
        borderRadius: 18,
        elevation: 8,
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 16,
        maxWidth: 560,
        paddingHorizontal: 16,
        paddingVertical: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        width: '92%',
    },
    textContainer: {
        flex: 1,
        gap: 2,
    },
    title: {
        color: '#fff',
        fontFamily: 'sans-bold',
        fontSize: 15,
    },
    message: {
        color: '#fff',
        fontFamily: 'sans-regular',
        fontSize: 13,
        lineHeight: 18,
    },
});
