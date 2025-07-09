import axios from 'axios';
import { DogsResponse } from '../types/dog';

const api = axios.create({
    baseURL: 'http://localhost:3005',
});

export const getDogs = async (page: number = 1, perPage: number = 10): Promise<DogsResponse> => {
    try {
        const response = await api.get<DogsResponse>(`/api/dogs?page=${page}&perPage=${perPage}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных о собаках:', error);
        return [];
    }
};

export const likeDog = async (id: string): Promise<number> => {
    try {
        const response = await api.post<{ likes: number }>(`/api/dogs/${id}/like`);
        return response.data.likes;
    } catch (error) {
        console.error('Ошибка при добавлении лайка:', error);
        throw error;
    }
};

export const unlikeDog = async (id: string): Promise<number> => {
    try {
        const response = await api.delete<{ likes: number }>(`/api/dogs/${id}/like`);
        return response.data.likes;
    } catch (error) {
        console.error('Ошибка при снятии лайка:', error);
        throw error;
    }
};