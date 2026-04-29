// contexts/UserContext.tsx
import images from '@/constants/images';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ImageSourcePropType } from 'react-native';

interface UserInfo {
    name: string;
    profile: ImageSourcePropType;
}

interface UserContextType {
    isAuthenticated: boolean;
    userInfo: UserInfo;
    updateUserInfo: (updates: Partial<UserInfo>) => void;
    signIn: (identifier?: string) => void;
    signUp: (username?: string) => void;
    signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: "John Doe",
        profile: images.avatar,
    });

    const updateUserInfo = (updates: Partial<UserInfo>) => {
        setUserInfo(prev => ({ ...prev, ...updates }));
        console.log("User info updated:", updates);
    };

    const signIn = (identifier?: string) => {
        if (identifier?.trim()) {
            setUserInfo(prev => ({ ...prev, name: identifier.trim() }));
        }
        setIsAuthenticated(true);
    };

    const signUp = (username?: string) => {
        if (username?.trim()) {
            setUserInfo(prev => ({ ...prev, name: username.trim() }));
        }
        setIsAuthenticated(true);
    };

    const signOut = () => {
        setIsAuthenticated(false);
    };

    return (
        <UserContext.Provider value={{ isAuthenticated, userInfo, updateUserInfo, signIn, signUp, signOut }}>
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
