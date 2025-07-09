import axios from 'axios';
import { Dog, DogsResponse } from '../types/interface';

const API_URL = 'https://random.dog';
let dogs: Dog[] = [];
const likes: Record<string, number> = {};

const getFileType = (filename: string): 'image' | 'video' => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'webm'].includes(ext) ? 'video' : 'image';
};

export const fetchDogs = async (page: number = 1, perPage: number = 20): Promise<DogsResponse> => {
  try {
    if (!dogs.length) {
      const { data: filenames } = await axios.get<string[]>(`${API_URL}/doggos`);
      dogs = filenames
        .filter((filename) => ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'webm'].includes(filename.split('.').pop()?.toLowerCase() || ''))
        .map((filename) => ({
          id: filename,
          filename,
          url: `${API_URL}/${filename}`,
          likes: likes[filename] || 0,
          fileType: getFileType(filename),
        }));
    }
    return dogs.slice((page - 1) * perPage, page * perPage);
  } catch {
    return [];
  }
};

export const fetchDogByFilename = async (filename: string): Promise<Dog | null> => {
  try {
    return dogs.find((d) => d.filename === filename) || (await fetchDogs()).find((d) => d.filename === filename) || null;
  } catch {
    return null;
  }
};

export const likeDog = (dogId: string): number => {
  likes[dogId] = (likes[dogId] || 0) + 1;
  return likes[dogId];
};

export const unlikeDog = (dogId: string): number => {
  likes[dogId] = Math.max((likes[dogId] || 0) - 1, 0);
  return likes[dogId];
};
