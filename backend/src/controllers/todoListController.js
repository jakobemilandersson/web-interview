import { getAll } from '../models/todoList.js'

export function index(req, res) {
    const todoLists = getAll();
    res.json(todoLists);
}
