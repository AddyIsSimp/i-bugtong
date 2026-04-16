// src/components/Avatar.tsx
import images from '@/constants/images';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';
export default function Avatar() {
    return (
        <LinearGradient
            colors={['#CD7F32', '#ffffff', '#804A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="items-center justify-center"
            style={{
                width: 85,
                height: 85,
                borderRadius: 9999,
                padding: 10,
            }}
        >
            <Image
                source={images.avatar}
                style={{
                    width: 71,
                    height: 71,
                    borderRadius: 9999,
                }}
            />
        </LinearGradient>
    );
}