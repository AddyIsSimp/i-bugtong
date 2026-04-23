// components/Avatar.tsx
import { useUser } from '@/contexts/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageSourcePropType } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    size?: AvatarSize;
    source?: ImageSourcePropType;
}

// Size mapping for different presets
const sizeMap: Record<AvatarSize, number> = {
    sm: 40,
    md: 60,
    lg: 85,
    xl: 120,
};

export default function Avatar({ size = 'lg', source }: AvatarProps) {
    const { userInfo } = useUser();
    
    // Get the actual pixel size from the preset
    const actualSize = sizeMap[size];
    
    const imageSource = source || userInfo.profile;

    return (
        <LinearGradient
            colors={['#CD7F32', '#ffffff', '#804A00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="items-center justify-center"
            style={{
                width: actualSize,
                height: actualSize,
                borderRadius: 9999,
                padding: actualSize * 0.12, // Responsive padding (12% of size)
            }}
        >
            <Image
                source={imageSource}
                style={{
                    width: actualSize - (actualSize * 0.16), // 16% smaller than container
                    height: actualSize - (actualSize * 0.16),
                    borderRadius: 9999,
                }}
            />
        </LinearGradient>
    );
}