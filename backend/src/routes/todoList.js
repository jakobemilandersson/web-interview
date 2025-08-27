import express from 'express'
import { index, update  } from '../controllers/todoListController.js';

const router = express.Router();

router.get('/', index);
router.put('/:id', update);

export default router;
