// services/api.ts
import axios from 'axios';

const BASE_URL = 'http://10.16.44.95:8000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export interface SubmitAnswerResponse {
    is_correct: boolean;
    confidence: number;
    message: string;
    image_url?: string;  // Add this to capture the returned image URL
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

export default api;