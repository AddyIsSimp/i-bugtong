// services/api.ts
import axios from 'axios';

const BASE_URL = 'http://10.96.86.95:8000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
});

export interface SubmitAnswerResponse {
    is_correct: boolean;
    confidence: number;
    message: string;
    image_url?: string;  // Add this to capture the returned image URL
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

export const submitAnswer = async (
    imageUri: string,
    bugtongId: number,
    expectedAnswer: string,
    timeSpent: number
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
    try {
        const response = await api.get('/health');
        return response.status === 200;
    } catch (error) {
        console.error('API health check failed:', error);
        return false;
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
