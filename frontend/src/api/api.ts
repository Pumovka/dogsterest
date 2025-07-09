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

export const getLikedDogs = async (page: number = 1, perPage: number = 20): Promise<DogsResponse> => {
    try {
        const userLikes = JSON.parse(localStorage.getItem('userLikes') || '{}');
        let likedDogs: DogsResponse = [];
        let currentPage = page;
        const maxPages = 10;

        while (likedDogs.length < perPage && currentPage <= maxPages) {
            const { data } = await api.get<DogsResponse>(`/api/dogs?page=${currentPage}&perPage=${perPage}`);
            likedDogs = [...likedDogs, ...data.filter((dog) => userLikes[dog.id])];
            if (data.length < perPage) break;
            currentPage++;
        }

        return likedDogs.slice(0, perPage);
    } catch (error) {
        console.error('Error in getLikedDogs:', error);
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