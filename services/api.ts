// services/api.ts
import axios, { isAxiosError } from 'axios';
import * as FileSystem from 'expo-file-system/legacy';
import { getUserFriendlyErrorMessage } from '@/utils/errorNotification';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const HEALTH_CHECK_PATHS = ['/health', '/api/health', '/'];
const APP_STORAGE_DIR = `${FileSystem.documentDirectory}ibugtong`;
const BUGTONG_IMAGE_DIR = `${APP_STORAGE_DIR}/bugtong-images`;

if (!BASE_URL) {
    throw new Error('Missing EXPO_PUBLIC_BASE_URL in .env');
}

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

export interface SubmitAnswerResponse {
    is_correct: boolean;
    confidence: number;
    message: string;
    image_url?: string;
    user_id: string | number;
}

export interface LoginResponseData {
    id: number;
    username: string;
    email: string;
    points: number;
    profile_path: string | null;
    diamond: number;
    life: number;
    hint: number;
}

export interface BugtongHintResponse {
    text: string;
    open: boolean;
}

export interface BugtongProgressItemResponse {
    id: number;
    difficulty: string;
    category: string;
    question: string;
    bugtong_image: string | null;
    answer: string;
    hint: BugtongHintResponse[];
    solved: boolean;
}

export interface SolvedBugtongProgressResponse {
    user_id: number;
    bugtong_id: number;
}

export interface UserHintProgressResponse {
    user_id: number;
    bugtong_id: number;
    hint_index: number;
    hint: string;
}

export interface BugtongProgressResponse {
    bugtong: BugtongProgressItemResponse[];
    solved_bugtong: SolvedBugtongProgressResponse[];
    user_hint: UserHintProgressResponse[];
}

export interface SubmitAnswerRequest {
    imageUri: string;
    bugtongId: number;
    expectedAnswer: string;
    timeSpent: number;
    userId: string | number;
    currentTotalPoints: number;
    confidenceScore: number;
    remainingSeconds: number;
    points: {
        basePoints: number;
        timePoints: number;
        confidencePoints: number;
        totalPoints: number;
    };
    difficultyMultiplier: number;
}

export interface UpdateProfileRequest {
    userId: number;
    username?: string;
    profileUri?: string;
}

export interface UpdateProfileResponse {
    id: number;
    username: string;
    email?: string;
    points?: number;
    profile_path: string | null;
}

export interface SyncAssetRequest {
    userId: number;
    diamond: number;
    hint: number;
    life: number;
}

interface SyncAssetApiResponse {
    user_id: number;
    diamond: number;
    hint: number;
    heart: number;
}

export interface SyncAssetResponse {
    user_id: number;
    diamond: number;
    hint: number;
    life: number;
}

export interface LeaderboardEntryResponse {
    id?: number;
    username: string;
    points: number;
    profile_path?: string | null;
    profile_image?: string | null;
    rank?: number;
}

export interface LeaderboardEntry {
    id: number;
    name: string;
    points: number;
    profileUri: string | null;
    rank: number;
}

export const toAbsoluteApiUrl = (path: string | null | undefined): string | null => {
    if (!path) {
        return null;
    }

    if (path.startsWith('file://')) {
        return path;
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    return `${BASE_URL}${path}`;
};

const ensureDirectoryExists = async (directoryUri: string) => {
    const dirInfo = await FileSystem.getInfoAsync(directoryUri);

    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
    }
};

const getImageFileExtension = (imageUrl: string) => {
    const sanitizedUrl = imageUrl.split('?')[0];
    const filename = sanitizedUrl.split('/').pop() ?? '';
    const extension = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : null;

    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'webp') {
        return extension;
    }

    return 'jpg';
};

const cacheBugtongImage = async (bugtongId: number, imagePath: string | null) => {
    const absoluteImageUrl = toAbsoluteApiUrl(imagePath);

    if (!absoluteImageUrl) {
        return null;
    }

    if (absoluteImageUrl.startsWith('file://')) {
        return absoluteImageUrl;
    }

    try {
        await ensureDirectoryExists(BUGTONG_IMAGE_DIR);

        const extension = getImageFileExtension(absoluteImageUrl);
        const localImageUri = `${BUGTONG_IMAGE_DIR}/${bugtongId}.${extension}`;
        const fileInfo = await FileSystem.getInfoAsync(localImageUri);

        if (!fileInfo.exists) {
            await FileSystem.downloadAsync(absoluteImageUrl, localImageUri);
        }

        return localImageUri;
    } catch (error) {
        const friendlyMessage = getUserFriendlyErrorMessage(
            error,
            'Unable to load the image right now.'
        );
        if (__DEV__) {
            console.log(`Image cache fallback for bugtong ${bugtongId}: ${friendlyMessage}`);
        }
        return absoluteImageUrl;
    }
};

export const submitAnswer = async (
    {
        imageUri,
        bugtongId,
        expectedAnswer,
        timeSpent,
        userId,
        currentTotalPoints,
        confidenceScore,
        remainingSeconds,
        points,
        difficultyMultiplier,
    }: SubmitAnswerRequest,
): Promise<SubmitAnswerResponse> => {
    try {
        const formData = new FormData();
        const filename = imageUri.split('/').pop() || 'image.jpg';

        formData.append('image', {
            uri: imageUri,
            name: filename,
            type: 'image/jpeg',
        } as any);

        formData.append('bugtong_id', bugtongId.toString());
        formData.append('expected_answer', expectedAnswer);
        formData.append('time_spent', timeSpent.toString());
        formData.append('user_id', userId.toString());
        formData.append('current_total_points', currentTotalPoints.toString());
        formData.append('confidence_score', confidenceScore.toString());
        formData.append('remaining_seconds', remainingSeconds.toString());
        formData.append('difficulty_multiplier', difficultyMultiplier.toString());
        formData.append('base_points', points.basePoints.toString());
        formData.append('time_points', points.timePoints.toString());
        formData.append('confidence_points', points.confidencePoints.toString());
        formData.append('points_earned', points.totalPoints.toString());

        const response = await api.post('/api/submit-answer', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(getUserFriendlyErrorMessage(error, 'Failed to submit your answer. Please try again.'));
    }
};

export const checkApiHealth = async (): Promise<boolean> => {
    for (const path of HEALTH_CHECK_PATHS) {
        try {
            const response = await api.get(path, {
                timeout: 5000,
                validateStatus: () => true,
            });

            // Any HTTP response means the server is running and reachable,
            // even if the endpoint itself returns 404.
            if (response.status >= 100 && response.status < 500) {
                return true;
            }
        } catch (error) {
            if (isAxiosError(error) && error.response) {
                return true;
            }
        }
    }

    return false;
};

export const updateProfile = async (
    { userId, username, profileUri }: UpdateProfileRequest,
): Promise<UpdateProfileResponse> => {
    const formData = new FormData();
    formData.append('user_id', userId.toString());

    if (typeof username === 'string' && username.trim()) {
        formData.append('username', username.trim());
    }

    if (profileUri) {
        const filename = profileUri.split('/').pop() || `profile-${Date.now()}.jpg`;
        const extension = filename.split('.').pop()?.toLowerCase();
        const imageType = extension === 'png' ? 'image/png' : 'image/jpeg';

        formData.append('profile', {
            uri: profileUri,
            name: filename,
            type: imageType,
        } as any);
    }

    try {
        const response = await api.post<UpdateProfileResponse>('/api/update-profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(getUserFriendlyErrorMessage(error, 'Failed to update your profile. Please try again.'));
    }
};

export const syncAsset = async (
    { userId, diamond, hint, life }: SyncAssetRequest,
): Promise<SyncAssetResponse> => {
    try {
        const response = await api.post<SyncAssetApiResponse>(
            '/api/syncAsset',
            {
                user_id: userId,
                diamond,
                hint,
                heart: life,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            user_id: response.data.user_id,
            diamond: response.data.diamond,
            hint: response.data.hint,
            life: response.data.heart,
        };
    } catch (error) {
        throw new Error(getUserFriendlyErrorMessage(error, 'Failed to sync your items. Please try again.'));
    }
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    try {
        const response = await api.get('/api/leaderboard');
        const payload = response.data;

        const leaderboardData: LeaderboardEntryResponse[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.leaderboard)
                ? payload.leaderboard
                : Array.isArray(payload?.data)
                    ? payload.data
                    : [];

        return leaderboardData.map((entry, index) => ({
            id: entry.id ?? index + 1,
            name: entry.username,
            points: entry.points ?? 0,
            profileUri: toAbsoluteApiUrl(entry.profile_image ?? entry.profile_path),
            rank: entry.rank ?? index + 1,
        }));
    } catch (error) {
        throw new Error(getUserFriendlyErrorMessage(error, 'Failed to load the leaderboard. Please try again.'));
    }
};

export const fetchBugtongProgress = async (userId: number): Promise<BugtongProgressResponse> => {
    try {
        const response = await api.get<BugtongProgressResponse>(`/api/bugtong/${userId}`);
        const bugtongWithCachedImages = await Promise.all(
            response.data.bugtong.map(async (item) => ({
                ...item,
                bugtong_image: await cacheBugtongImage(item.id, item.bugtong_image),
            }))
        );

        return {
            ...response.data,
            bugtong: bugtongWithCachedImages,
        };
    } catch (error) {
        throw new Error(getUserFriendlyErrorMessage(error, 'Failed to load your bugtong progress. Please try again.'));
    }
};



export const createAccount = async (
    username: string,
    email: string,
    password: string,
): Promise<APIResponse> => {
    try {
        const response = await api.post(
            '/api/create-account',
            {
                username,
                email,
                password,
                points: 0,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            status: response.status,
            message: response.data.message || 'Account created successfully'
        }
    } catch (error) {
        if (isAxiosError(error)) {
            //Handle duplicate account (409 conflict)
            if (error.response?.status === 409) {
                return {
                    status: 409,
                    error: error.response?.data?.detail || 'Username or email already exists',
                }
            }

            if (error.response?.status === 422) {
                return {
                    status: 422,
                    error: 'Invalid input data',
                };
            }

            return {
                status: error.response?.status || 500,
                error: getUserFriendlyErrorMessage(error, 'Failed to create your account. Please try again.'),
            }
        }

        return {
            status: 500,
            error: getUserFriendlyErrorMessage(error, 'Failed to create your account. Please try again.'),
        };

    }

}

export const login = async (
    identification: string,
    password: string
): Promise<LoginAPIResponse> => {
    try {
        const result = await api.post<LoginResponseData>(
            '/api/login',
            {
                identification,
                password,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            status: result.status,
            message: 'Login successfully',
            data: result.data,
        };
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                status: error.response?.status || 500,
                error: getUserFriendlyErrorMessage(error, 'Failed to log you in. Please try again.'),
            };
        }

        return {
            status: 500,
            error: getUserFriendlyErrorMessage(error, 'Failed to log you in. Please try again.'),
        };
    }
};

export default api;
