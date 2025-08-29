import { getAll as getAllTodoLists, update as updateTodoLists } from './todoList.js';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export function create(todoListId) {
    const todoLists = getAllTodoLists();
    const todoList = todoLists[todoListId];
    const { todos } = todoList;

    const todo = {
        name: '',
        done: false,
        deadline: new Date(Date.now() + ONE_DAY_IN_MS).toISOString().slice(0, 16),
        id: todoList.todos.length > 0 ? (todoList.todos[todoList.todos.length - 1].id + 1) : 0
    };

    const newTodos = [...todos, todo];
    updateTodoLists(todoListId, newTodos);

    return todo;
}

export function update(todoListId, todoId, data) {
    const todoLists = getAllTodoLists();
    const todoList = todoLists[todoListId];
    const todo = todoList.todos.find(todo => todo.id == todoId);

    Object.assign(todo, data);
    updateTodoLists(todoListId, todoList.todos);

    return todo;
}

export function destroy(todoListId, todoId) {
    const todoLists = getAllTodoLists();
    const todoList = todoLists[todoListId];
    const { todos } = todoList;

    const newTodos = todos.filter(todo => todo.id != todoId);
    updateTodoLists(todoListId, newTodos);

    return true;
}
