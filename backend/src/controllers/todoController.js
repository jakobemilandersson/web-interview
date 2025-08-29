import * as Todo from '../models/todo.js';

export function create(req, res) {
    const { todoListId } = req.params;
    const todo = Todo.create(todoListId);

    res.json(todo);
}

export function update(req, res) {
    const { todoListId, todoId } = req.params;
    const { name, done, deadline } = req.body;
    const updateData = { name, done, deadline };

    const updatedTodo = Todo.update(todoListId, todoId, updateData);

    res.json(updatedTodo);
}

export function destroy(req, res) {
    const { todoListId, todoId } = req.params;
    Todo.destroy(todoListId, todoId);

    res.sendStatus(200);
}
