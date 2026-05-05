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
    addPoints: (points: number) => void;
    signIn: (user?: Partial<UserInfoType>) => void;
    signUp: (username?: string) => void;
    signOut: () => void;
}

const USER_STORAGE_KEY = 'user';

const defaultStoredUser: StoredUserInfo = {
    id: defaultUserInfo.id,
    name: defaultUserInfo.name,
    profileUri: null,
    points: defaultUserInfo.points,
    isAuthenticated: false,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const getProfileSource = (profileUri: string | null): ImageSourcePropType =>
    profileUri ? { uri: profileUri } : images.avatar;

const toStoredUser = (userInfo: UserInfoType, isAuthenticated: boolean): StoredUserInfo => ({
    id: userInfo.id,
    name: userInfo.name,
    profileUri:
        typeof userInfo.profile === 'object' && userInfo.profile !== null && 'uri' in userInfo.profile
            ? userInfo.profile.uri ?? null
            : null,
    points: userInfo.points,
    isAuthenticated,
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfoType>(defaultUserInfo);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await readJsonFile<StoredUserInfo & { point?: number }>(
                USER_STORAGE_KEY,
                defaultStoredUser
            );

            setUserInfo({
                id: storedUser.id ?? defaultUserInfo.id,
                name: storedUser.name || defaultUserInfo.name,
                profile: getProfileSource(storedUser.profileUri),
                points: storedUser.points ?? storedUser.point ?? defaultUserInfo.points,
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

    const addPoints = (points: number) => {
        if (points <= 0) {
            return;
        }

        setUserInfo((prev) => ({ ...prev, points: prev.points + points }));
    };

    const signIn = (user?: Partial<UserInfoType>) => {
        if (user) {
            setUserInfo((prev) => ({ ...prev, ...user }));
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
        <UserContext.Provider value={{ isAuthenticated, isHydrated, userInfo, updateUserInfo, addPoints, signIn, signUp, signOut }}>
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
