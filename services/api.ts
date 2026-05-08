// services/api.ts
import axios, { isAxiosError } from 'axios';
import * as FileSystem from 'expo-file-system/legacy';

const BASE_URL = 'http://10.191.4.95:8000';
const HEALTH_CHECK_PATHS = ['/health', '/api/health', '/'];
const APP_STORAGE_DIR = `${FileSystem.documentDirectory}ibugtong`;
const BUGTONG_IMAGE_DIR = `${APP_STORAGE_DIR}/bugtong-images`;

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
        console.error(`Error caching bugtong image for bugtong ${bugtongId}:`, error);
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
        console.error('Error submitting answer:', error);
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to submit answer');
        }
        throw new Error('Network error occurred');
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
        console.error('Error updating profile:', error);
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to update profile');
        }
        throw new Error('Network error occurred');
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
        console.error('Error syncing assets:', error);
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to sync assets');
        }
        throw new Error('Network error occurred');
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
        console.error('Error fetching leaderboard:', error);
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch leaderboard');
        }
        throw new Error('Network error occurred');
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
        console.error('Error fetching bugtong progress:', error);
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to fetch bugtong progress');
        }
        throw new Error('Network error occurred');
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
        console.error('Error creating account:', error);

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
                error: error.response?.data?.detail || error.message || 'Failed to create account',
            }
        }

        return {
            status: 500,
            error: 'Network error occurred. Please check your connection.',
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
        console.error('Error logging in:', error);

        if (isAxiosError(error)) {
            return {
                status: error.response?.status || 500,
                error: error.response?.data?.detail || error.message || 'Failed to login',
            };
        }

        return {
            status: 500,
            error: 'Network error occured. Please check your connection.',
        };
    }
};

export default api;
