// contexts/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ImageSourcePropType } from 'react-native';
import images from '@/constants/images';

interface UserInfo {
    name: string;
    profile: ImageSourcePropType;
}

interface UserContextType {
    userInfo: UserInfo;
    updateUserInfo: (updates: Partial<UserInfo>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: "John Doe",
        profile: images.avatar,
    });

    const updateUserInfo = (updates: Partial<UserInfo>) => {
        setUserInfo(prev => ({ ...prev, ...updates }));
        console.log("User info updated:", updates);
    };

    return (
        <UserContext.Provider value={{ userInfo, updateUserInfo }}>
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