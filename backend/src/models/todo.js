import { SellpyError } from '../sellpyError.js';
import { getAll as getAllTodoLists, update as updateTodoLists } from './todoList.js';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export function create(todoListId) {
    const { todos } = getTodoList(todoListId);

    const todo = {
        name: '',
        done: false,
        deadline: new Date(Date.now() + ONE_DAY_IN_MS).toISOString().slice(0, 16),
        id: todos.length > 0 ? (todos[todos.length - 1].id + 1) : 0
    };
    todos.push(todo); // Append new 'todo'

    updateTodoLists(todoListId, todos);

    return todo;
}

export function update(todoListId, todoId, data) {
    const todoList = getTodoList(todoListId);
    const todo = getTodoFromTodoList(todoList, todoId);
    if(!todo) throw new SellpyError(`Todo with id: ${todoId} not found in TodoList with id: ${todoListId}`, 404);

    Object.assign(todo, data); // Merge 'data' properties into 'todo'
    updateTodoLists(todoListId, todoList.todos);

    return todo;
}

export function destroy(todoListId, todoId) {
    const todoList = getTodoList(todoListId);
    const { todos } = todoList;
    getTodoFromTodoList(todoList, todoId); // Validate that 'todo' is present in todolist's todos

    const newTodos = todos.filter(todo => todo.id != todoId);
    updateTodoLists(todoListId, newTodos);

    return true;
}

function getTodoList(todoListId) {
    const todoLists = getAllTodoLists();
    const todoList = todoLists[todoListId];
    if(!todoList) throw new SellpyError(`TodoList with id: ${todoListId} not found`, 404);

    return todoList;
}

function getTodoFromTodoList(todoList, todoId) {
    const { todos } = todoList;
    const todo = todos.find(todo => todo.id == todoId);
    if(!todo) throw new SellpyError(`Todo with id: ${todoId} not found in TodoList with id: ${todoList.id}`, 404);

    return todo;
}
