import { toAbsoluteApiUrl } from '@/services/api';
import { ImageSourcePropType } from 'react-native';

const FALLBACK_IMAGE = require('@/assets/icons/appIcon.png');

export const getBugtongImageById = (_id: number): ImageSourcePropType | null => {
    return null;
};

export const getBugtongImageSource = (
    bugtong: Pick<BugtongProps, 'id' | 'bugtongImage'>
): ImageSourcePropType => {
    const imageUri = toAbsoluteApiUrl(bugtong.bugtongImage ?? null);

    if (imageUri) {
        return { uri: imageUri };
    }

    return getBugtongImageById(Number(bugtong.id)) || FALLBACK_IMAGE;
};

export const getBugtongImage = getBugtongImageById;
