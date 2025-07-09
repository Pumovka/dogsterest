import axios from 'axios';
import { DogsResponse, Dog } from '../types/dog';

const api = axios.create({ baseURL: 'http://localhost:3005' });

export const getDogs = async (page: number = 1, perPage: number = 20): Promise<DogsResponse> => {
    try {
        const { data } = await api.get<DogsResponse>(`/api/dogs?page=${page}&perPage=${perPage}`);
        return data;
    } catch (error) {
        console.error('Error in getDogs:', error);
        return [];
    }
};

export const getLikedDogs = async (): Promise<DogsResponse> => {
    try {
        const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
        let allDogs: Dog[] = [];
        let page = 1;
        const perPage = 20;

        // Загружаем все посты, пока они есть
        while (true) {
            const response = await api.get(`/api/dogs?page=${page}&perPage=${perPage}`);
            const newDogs = response.data;
            allDogs = [...allDogs, ...newDogs];
            if (newDogs.length < perPage) break; // Если данных меньше, чем perPage, это последняя страница
            page++;
        }

        // Фильтруем только лайкнутые посты
        return allDogs.filter((dog: Dog) => userLikes[dog.id]);
    } catch (error) {
        console.log('Ошибка в getLikedDogs:', error);
        return [];
    }
};

export const getDogByFilename = async (filename: string): Promise<Dog | null> => {
    try {
        const { data } = await api.get<Dog>(`/api/dogs/${filename}`);
        return data;
    } catch (error) {
        console.error('Error in getDogByFilename:', error);
        return null;
    }
};

export const toggleLike = async (id: string, isLiked: boolean): Promise<number> => {
    try {
        const { data } = await api[isLiked ? 'delete' : 'post'](`/api/dogs/${id}/like`);
        return data.likes;
    } catch (error) {
        console.error('Error in toggleLike:', error);
        return 0;
    }
};