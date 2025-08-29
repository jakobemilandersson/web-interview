import express from 'express';
import { create, destroy, update } from '../controllers/todoController.js';

const router = express.Router({ mergeParams: true });

router.post('/', create);
router.put('/:todoId', update);
router.delete('/:todoId', destroy);

export default router;
