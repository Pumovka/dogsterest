import axios from "axios";
import { Dog } from "../types/interface";

const API_URL = "https://random.dog";

// Хранилище для лайков (глобальное)
const likes: Record<string, number> = {};

// Кэш данных с временем жизни (TTL)
let cachedDogs: Dog[] = [];
let lastFetchTime = 0;
const CACHE_TTL = 20 * 60 * 1000; // 20 минут

// Определение типа файла
const getFileType = (filename: string): "image" | "video" => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return ["mp4", "webm"].includes(ext) ? "video" : "image";
};

// Основная функция получения собак
export const fetchDogs = async (
  page: number = 1,
  perPage: number = 20
): Promise<Dog[]> => {
  try {
    // Обновляем кэш если данные устарели или отсутствуют
    if (!cachedDogs.length || Date.now() - lastFetchTime > CACHE_TTL) {
      const { data: filenames } = await axios.get<string[]>(
        `${API_URL}/doggos`
      );

      cachedDogs = filenames
        .filter((filename) => {
          const ext = filename.split(".").pop()?.toLowerCase();
          return ["jpg", "jpeg", "png", "gif", "mp4", "webm"].includes(
            ext || ""
          );
        })
        .map((filename) => ({
          id: filename,
          filename,
          url: `${API_URL}/${filename}`,
          likes: likes[filename] || 0,
          fileType: getFileType(filename),
        }));

      lastFetchTime = Date.now();
    }

    // Возвращаем пагинированный результат
    return cachedDogs.slice((page - 1) * perPage, page * perPage);
  } catch (error) {
    console.error("Error fetching dogs:", error);
    cachedDogs = []; // Сбрасываем кэш при ошибке
    return [];
  }
};

// Получение конкретной собаки по filename
export const fetchDogByFilename = async (
  filename: string
): Promise<Dog | null> => {
  try {
    // Сначала проверяем кэш
    const dogFromCache = cachedDogs.find((dog) => dog.filename === filename);
    if (dogFromCache) return dogFromCache;

    // Если нет в кэше, делаем запрос и проверяем доступность файла
    await axios.head(`${API_URL}/${filename}`);
    const dogs = await fetchDogs();
    return dogs.find((dog) => dog.filename === filename) || null;
  } catch (error) {
    console.error(`Error fetching dog ${filename}:`, error);
    return null;
  }
};

// Лайк собаки
export const likeDog = (dogId: string): number => {
  likes[dogId] = (likes[dogId] || 0) + 1;

  // Обновляем данные в кэше
  const dogInCache = cachedDogs.find((dog) => dog.id === dogId);
  if (dogInCache) {
    dogInCache.likes = likes[dogId];
  }

  return likes[dogId];
};

// Снятие лайка
export const unlikeDog = (dogId: string): number => {
  likes[dogId] = Math.max((likes[dogId] || 0) - 1, 0);

  // Обновляем данные в кэше
  const dogInCache = cachedDogs.find((dog) => dog.id === dogId);
  if (dogInCache) {
    dogInCache.likes = likes[dogId];
  }

  return likes[dogId];
};
