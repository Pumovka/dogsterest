import axios from "axios";
import { Dog } from "../types/interface";

const API_URL = "https://random.dog";
const likes: Record<string, number> = {};

const getFileType = (filename: string): "image" | "video" => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ["mp4", "webm"].includes(ext) ? "video" : "image";
};

export const fetchDogs = async (page: number = 1, perPage: number = 10): Promise<Dog[]> => {
  try {
    const { data: filenames } = await axios.get<string[]>(`${API_URL}/doggos`);

    const dogs = filenames
      .filter((filename) => {
        const ext = filename.split(".").pop()?.toLowerCase();
        return ["jpg", "jpeg", "png", "gif", "mp4", "webm"].includes(ext || "");
      })
      .map((filename) => ({
        id: filename,
        filename,
        url: `${API_URL}/${filename}`,
        likes: likes[filename] || 0,
        fileType: getFileType(filename),
      }));

    return dogs.slice((page - 1) * perPage, page * perPage);
  } catch (error) {
    console.error("Error fetching dogs:", error);
    return [];
  }
};

export const fetchDogByFilename = async (filename: string): Promise<Dog | null> => {
  const dogs = await fetchDogs();
  return dogs.find(dog => dog.filename === filename) || null;
};

export const likeDog = (dogId: string): number => {
  likes[dogId] = (likes[dogId] || 0) + 1;
  return likes[dogId];
};

export const unlikeDog = (dogId: string): number => {
  likes[dogId] = Math.max((likes[dogId] || 0) - 1, 0);
  return likes[dogId];
};