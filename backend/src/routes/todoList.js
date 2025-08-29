import express from 'express';
import { index, update  } from '../controllers/todoListController.js';
import todoRoutes from './todo.js';

const router = express.Router();

router.get('/', index);
router.put('/:id', update);

router.use('/:todoListId/todos', todoRoutes);

export default router;
