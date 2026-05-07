import { readJsonFile, writeJsonFile } from '@/utils/localStorage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AudioSettings {
    musicEnabled: boolean;
    sfxEnabled: boolean;
}

interface AudioSettingsContextType {
    isHydrated: boolean;
    musicEnabled: boolean;
    sfxEnabled: boolean;
    setMusicEnabled: (enabled: boolean) => void;
    setSfxEnabled: (enabled: boolean) => void;
}

const AUDIO_SETTINGS_STORAGE_KEY = 'audio-settings';

const defaultAudioSettings: AudioSettings = {
    musicEnabled: true,
    sfxEnabled: true,
};

const AudioSettingsContext = createContext<AudioSettingsContextType | undefined>(undefined);

export function AudioSettingsProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [musicEnabled, setMusicEnabled] = useState(defaultAudioSettings.musicEnabled);
    const [sfxEnabled, setSfxEnabled] = useState(defaultAudioSettings.sfxEnabled);

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await readJsonFile<AudioSettings>(AUDIO_SETTINGS_STORAGE_KEY, defaultAudioSettings);

            setMusicEnabled(settings.musicEnabled ?? defaultAudioSettings.musicEnabled);
            setSfxEnabled(settings.sfxEnabled ?? defaultAudioSettings.sfxEnabled);
            setIsHydrated(true);
        };

        loadSettings();
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        writeJsonFile(AUDIO_SETTINGS_STORAGE_KEY, {
            musicEnabled,
            sfxEnabled,
        });
    }, [isHydrated, musicEnabled, sfxEnabled]);

    return (
        <AudioSettingsContext.Provider
            value={{
                isHydrated,
                musicEnabled,
                sfxEnabled,
                setMusicEnabled,
                setSfxEnabled,
            }}
        >
            {children}
        </AudioSettingsContext.Provider>
    );
}

export function useAudioSettings() {
    const context = useContext(AudioSettingsContext);

    if (!context) {
        throw new Error('useAudioSettings must be used within an AudioSettingsProvider');
    }

    return context;
}
