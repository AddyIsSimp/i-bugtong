import { colors } from '@/constants/theme';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface AppLoadingScreenProps {
    isOffline: boolean;
    message: string;
    progress: number;
    steps: string[];
}

export default function AppLoadingScreen({
    isOffline,
    message,
    progress,
    steps,
}: AppLoadingScreenProps) {
    const progressPercent = Math.round(progress * 100);

    return (
        <View style={styles.container}>
            <View style={styles.logoWrap}>
                <Image
                    source={require('../assets/images/appIcon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title}>iBugtong</Text>
            <Text style={styles.subtitle}>{message}</Text>

            <View style={styles.statusCard}>
                <View style={styles.statusRow}>
                    <Text style={styles.statusText}>
                        {isOffline ? 'Offline mode detected' : 'Preparing your game data'}
                    </Text>
                    <Text style={styles.progressLabel}>{progressPercent}%</Text>
                </View>

                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.max(6, progressPercent)}%` },
                        ]}
                    />
                </View>

                {steps.map((step) => (
                    <Text key={step} className='text-sm' style={styles.stepText}>
                        {step}
                    </Text>
                ))}
            </View>

            <Text style={styles.footer}>
                {isOffline
                    ? 'Using cached progress while connection is unavailable.'
                    : 'Checking login, syncing cache, and preloading bugtong data.'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#f6fbff',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoWrap: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: 'rgba(61, 151, 225, 0.14)',
        borderRadius: 32,
        borderWidth: 1,
        elevation: 8,
        height: 140,
        justifyContent: 'center',
        marginBottom: 24,
        padding: 20,
        shadowColor: '#0b2942',
        shadowOffset: { width: 0, height: 14 },
        shadowOpacity: 0.1,
        shadowRadius: 22,
        width: 140,
    },
    logo: {
        height: 96,
        width: 96,
    },
    title: {
        color: colors.primary,
        fontFamily: 'sans-extrabold',
        fontSize: 28,
        marginBottom: 6,
    },
    subtitle: {
        color: '#486378',
        fontFamily: 'sans-medium',
        fontSize: 15,
        marginBottom: 22,
        textAlign: 'center',
    },
    statusCard: {
        backgroundColor: '#ffffff',
        borderColor: 'rgba(8, 17, 38, 0.08)',
        borderRadius: 24,
        borderWidth: 1,
        maxWidth: 420,
        paddingHorizontal: 18,
        paddingVertical: 18,
        width: '100%',
    },
    statusRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    statusText: {
        color: colors.primary,
        flex: 1,
        fontFamily: 'sans-semibold',
        fontSize: 15,
    },
    progressLabel: {
        color: colors.accent,
        fontFamily: 'sans-bold',
        fontSize: 14,
        marginLeft: 12,
    },
    progressTrack: {
        backgroundColor: '#dbeaf7',
        borderRadius: 999,
        height: 10,
        marginBottom: 14,
        overflow: 'hidden',
        width: '100%',
    },
    progressFill: {
        backgroundColor: colors.accent,
        borderRadius: 999,
        height: '100%',
    },
    stepText: {
        color: '#5c7182',
        fontFamily: 'sans-regular',
        fontSize: 13,
        lineHeight: 20,
        paddingLeft: 4,
    },
    footer: {
        color: '#6f7f8a',
        fontFamily: 'sans-regular',
        fontSize: 12,
        lineHeight: 18,
        marginTop: 18,
        maxWidth: 420,
        textAlign: 'center',
    },
});
