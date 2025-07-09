import { Router } from "express";
import { 
  getDogs,
  getDogByFilename,
  postLike,
  deleteLike
} from "../controllers/dogs_controller";

const router = Router();

// Получить всех собак с пагинацией (query-параметры: ?page=1&perPage=10)
router.get("/", getDogs);

// Получить конкретную собаку по filename
router.get("/:filename", getDogByFilename);

// Поставить лайк собаке по ID
router.post("/:id/like", postLike);

// Убрать лайк у собаки по ID
router.delete("/:id/like", deleteLike);

export default router;