import fs from 'fs';

export function getAll() {
  const data = fs.readFileSync('./src/database.json', 'utf8');
  return JSON.parse(data);
}

export function update(id, todos) {
  const todoLists = getAll();
  todoLists[id].todos = todos;

  fs.writeFileSync('./src/database.json', JSON.stringify(todoLists, null, 2));
  return todoLists;
}
