import { Router } from "express";
import * as articleController from "../controllers/articleController";
import commentRoutes from "./commentRoutes";

const router = Router();

router.use("/:articleId/comments", commentRoutes);

router.get("/", articleController.getArticles);
router.get("/:id", articleController.getArticle);

export default router;
