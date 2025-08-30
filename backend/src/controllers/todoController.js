import { SellpyError } from '../sellpyError.js';
import * as Todo from '../models/todo.js';

export function create(req, res, next) {
  try {
    const { todoListId } = req.params;
    const todo = Todo.create(todoListId);

    res.json(todo);
  } catch (err) { next(err); }
}

export function update(req, res, next) {
  try {
    const { todoListId, todoId } = req.params;
    const updateData = updateParms(req);

    const updatedTodo = Todo.update(todoListId, todoId, updateData);

    res.json(updatedTodo);
  } catch (err) { next(err); }
}

export function destroy(req, res, next) {
  try {
    const { todoListId, todoId } = req.params;
    Todo.destroy(todoListId, todoId);

    res.sendStatus(200);
  } catch (err) { next(err); }
}

function updateParms(req) {
  const { name, done, deadline } = req.body;
  const params = {};

  if(name !== undefined) params.name = name;
  if(done !== undefined) params.done = done;
  if(deadline !== undefined) params.deadline = deadline;

  validateData(params);

  return params;
}

export function validateData(data) {
  if('name' in data  && !(data.name?.trim()?.length > 0)) throw new SellpyError('Todo "name" cant be empty', 400);
  if('done' in data && (typeof data.done !== 'boolean')) throw new SellpyError('Todo "done" must be true or false, 400');
  if('deadline' in data) {
    const deadlineDate = new Date(data.deadline);
    if(isNaN(deadlineDate.getTime()) || deadlineDate < new Date()) throw new SellpyError('Todo "deadline" must be a valid date in the future', 400);
  }
}
