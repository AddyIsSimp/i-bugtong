// services/api.ts
import axios from 'axios';

const BASE_URL = 'http://10.191.4.95:8000';
const HEALTH_CHECK_PATHS = ['/health', '/api/health', '/'];

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

export interface UploadProfileAvatarResponse {
    message?: string;
    avatar_url?: string;
    image_url?: string;
    profile_url?: string;
    user_id?: string | number;
}

export interface LoginResponseData {
    id: number;
    username: string;
    email: string;
    points: number;
    diamond: number;
    life: number;
    hint: number;
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

export interface UploadProfileAvatarRequest {
    userId: string | number;
    imageUri: string;
    characterKey?: string;
}

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
        if (axios.isAxiosError(error)) {
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
            if (axios.isAxiosError(error) && error.response) {
                return true;
            }
        }
    }

    return false;
};

export const uploadProfileAvatar = async (
    { userId, imageUri, characterKey }: UploadProfileAvatarRequest,
): Promise<UploadProfileAvatarResponse> => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || `avatar-${Date.now()}.jpg`;
    const extension = filename.split('.').pop()?.toLowerCase();
    const imageType = extension === 'png' ? 'image/png' : 'image/jpeg';

    formData.append('image', {
        uri: imageUri,
        name: filename,
        type: imageType,
    } as any);
    formData.append('user_id', userId.toString());

    if (characterKey) {
        formData.append('character_key', characterKey);
    }

    try {
        const response = await api.post('/api/profile-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading profile avatar:', error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                // Fallback for servers that don't expose avatar upload yet.
                return {
                    message: 'Profile avatar endpoint is not available on the server yet.',
                };
            }
            throw new Error(error.response?.data?.detail || error.response?.data?.message || 'Failed to upload profile avatar');
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

        if (axios.isAxiosError(error)) {
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

        if (axios.isAxiosError(error)) {
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
