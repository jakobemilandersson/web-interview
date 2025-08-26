import express from 'express'
import cors from 'cors'
import todoListRoutes from './routes/todoList.js';

const app = express()

app.use(cors())
app.use(express.json())
app.use('/todoLists', todoListRoutes)

const PORT = 3001

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
