import { Request, Response } from 'express';
import { fetchDogs, fetchDogByFilename, likeDog, unlikeDog } from '../services/dogs_service';
import { DogsResponse } from '../types/interface';

export const getDogs = async (req: Request, res: Response<DogsResponse>) => {
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;
  res.json(await fetchDogs(page, perPage));
};

export const getDogByFilename = async (req: Request, res: Response) => {
  const dog = await fetchDogByFilename(req.params.filename);
  dog ? res.json(dog) : res.status(404).json({ error: 'Dog not found' });
};

export const postLike = (req: Request, res: Response) => {
  res.json({ likes: likeDog(req.params.id) });
};

export const deleteLike = (req: Request, res: Response) => {
  res.json({ likes: unlikeDog(req.params.id) });
};