import * as TodoList from '../models/todoList.js';

export function index(req, res) {
  const todoLists = TodoList.getAll();
  res.json(todoLists);
}

export function update(req, res) {
  const { id } = req.params;
  const { todos } = req.body;

  const newTodoLists = TodoList.update(id, todos);
  res.status(200).json(newTodoLists);
}
