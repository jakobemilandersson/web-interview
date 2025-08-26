import fs from 'fs';

export function getAll() {
    const data = fs.readFileSync('./src/database.json', 'utf8');
    return JSON.parse(data);
}
