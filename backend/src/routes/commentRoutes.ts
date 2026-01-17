import { Router } from 'express';
import * as commentController from '../controllers/commentController';

// mergeParams is required to access articleId from parent router
const router = Router({ mergeParams: true });

router.get('/', commentController.getComments);
router.post('/', commentController.createComment);

export default router;
