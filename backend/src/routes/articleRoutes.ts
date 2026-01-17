import { Router } from 'express';
import * as articleController from '../controllers/articleController';
import commentRoutes from './commentRoutes';

const router = Router();

router.use('/:articleId/comments', commentRoutes);

router.get('/', articleController.getArticles);
router.post('/sync', articleController.syncArticles);
router.get('/:id', articleController.getArticle);

export default router;
