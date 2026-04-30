import { defaultUserInfo, StoredUserInfo, UserInfoType } from '@/constants/data';
import images from '@/constants/images';
import { readJsonFile, writeJsonFile } from '@/utils/localStorage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

interface UserContextType {
    isAuthenticated: boolean;
    isHydrated: boolean;
    userInfo: UserInfoType;
    updateUserInfo: (updates: Partial<UserInfoType>) => void;
    signIn: (identifier?: string) => void;
    signUp: (username?: string) => void;
    signOut: () => void;
}

const USER_STORAGE_KEY = 'user';

const defaultStoredUser: StoredUserInfo = {
    name: defaultUserInfo.name,
    profileUri: null,
    isAuthenticated: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const getProfileSource = (profileUri: string | null): ImageSourcePropType =>
    profileUri ? { uri: profileUri } : images.avatar;

const toStoredUser = (userInfo: UserInfoType, isAuthenticated: boolean): StoredUserInfo => ({
    name: userInfo.name,
    profileUri:
        typeof userInfo.profile === 'object' && userInfo.profile !== null && 'uri' in userInfo.profile
            ? userInfo.profile.uri ?? null
            : null,
    isAuthenticated,
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfoType>(defaultUserInfo);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await readJsonFile<StoredUserInfo>(USER_STORAGE_KEY, defaultStoredUser);

            setUserInfo({
                name: storedUser.name || defaultUserInfo.name,
                profile: getProfileSource(storedUser.profileUri),
            });
            setIsAuthenticated(storedUser.isAuthenticated);
            setIsHydrated(true);
        };

        loadUser();
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        writeJsonFile(USER_STORAGE_KEY, toStoredUser(userInfo, isAuthenticated));
    }, [isAuthenticated, isHydrated, userInfo]);

    const updateUserInfo = (updates: Partial<UserInfoType>) => {
        setUserInfo((prev) => ({ ...prev, ...updates }));
    };

    const signIn = (identifier?: string) => {
        if (identifier?.trim()) {
            setUserInfo((prev) => ({ ...prev, name: identifier.trim() }));
        }
        setIsAuthenticated(true);
    };

    const signUp = (username?: string) => {
        if (username?.trim()) {
            setUserInfo((prev) => ({ ...prev, name: username.trim() }));
        }
        setIsAuthenticated(true);
    };

    const signOut = () => {
        setUserInfo(defaultUserInfo);
        setIsAuthenticated(false);
    };

    return (
        <UserContext.Provider value={{ isAuthenticated, isHydrated, userInfo, updateUserInfo, signIn, signUp, signOut }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
