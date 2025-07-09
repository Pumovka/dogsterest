import { Request, Response } from "express";
import { fetchDogs, fetchDogByFilename, likeDog, unlikeDog } from "../services/dogs_service";
import { Dog } from "../types/interface";

export const getDogs = async (req: Request, res: Response<Dog[]>) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;
    const dogs = await fetchDogs(page, perPage);
    res.json(dogs);
  } catch (error) {
    console.error("Error fetching dogs:", error);
    res.status(500).json([]);
  }
};

export const getDogByFilename = async (
  req: Request<{ filename: string }>,
  res: Response<Dog | { error: string }>
): Promise<void> => {
  try {
    const dog = await fetchDogByFilename(req.params.filename);
    if (!dog) {
      res.status(404).json({ error: "Dog not found" });
      return;
    }
    res.json(dog);
  } catch (error) {
    console.error("Error fetching dog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postLike = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const likes = likeDog(req.params.id);
    res.json({ likes });
  } catch (error) {
    console.error("Error liking dog:", error);
    res.status(500).json({ likes: 0 });
  }
};

export const deleteLike = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const likes = unlikeDog(req.params.id);
    res.json({ likes });
  } catch (error) {
    console.error("Error unliking dog:", error);
    res.status(500).json({ likes: 0 });
  }
};