import { Request, Response } from "express";
import { fetchDogs, likeDog, unlikeDog } from "../services/dogs_service";
import { DogsResponse } from "../interface";

export const getDogs = async (req: Request, res: Response<DogsResponse>) => {
  try {
    const dogs = await fetchDogs();
    res.json(dogs);
  } catch (error) {
    res.status(500).json([]);
  }
};

export const postLike = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const likes = likeDog(req.params.id);
    res.json({ likes });
  } catch (error) {
    res.status(500).json({ likes: 0 });
  }
};

export const deleteLike = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const likes = unlikeDog(req.params.id);
    res.json({ likes });
  } catch (error) {
    res.status(500).json({ likes: 0 });
  }
};