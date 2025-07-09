import { Router } from "express";
import { getDogs, postLike, deleteLike } from "../controllers/dogs_controller";

const router = Router();

router.get("/", getDogs);
router.post("/:id/like", postLike);
router.delete('/:id/like', deleteLike);


export default router;
