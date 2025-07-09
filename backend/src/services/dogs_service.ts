import axios from "axios";
import { Dog, DogsResponse } from "../interface";

const API_URL = "https://random.dog";

// In-memory хранилище
let dogs: Dog[] = [];
const likes: Record<string, number> = {};

const getFileType = (filename: string): "image" | "video" => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ["mp4", "webm"].includes(ext) ? "video" : "image";
};

export const fetchDogs = async (): Promise<DogsResponse> => {
  try {
    const { data } = await axios.get<string[]>(`${API_URL}/doggos`);

    dogs = data
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

    return dogs;
  } catch (error) {
    console.error("Error fetching dogs:", error);
    return [];
  }
};

export const likeDog = (dogId: string): number => {
  likes[dogId] = (likes[dogId] || 0) + 1;
  return likes[dogId];
};

export const unlikeDog = (dogId: string): number => {
  if (likes[dogId] && likes[dogId] > 0) {
    likes[dogId] -= 1;
  } else {
    likes[dogId] = 0;
  }
  return likes[dogId];
};

export const getLikes = (dogId: string): number => likes[dogId] || 0;
