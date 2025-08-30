import express from 'express';
import cors from 'cors';
import todoListRoutes from './routes/todoList.js';
import { errorHandler } from './errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/todoLists', todoListRoutes);
app.use(errorHandler);

const PORT = 3001;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
