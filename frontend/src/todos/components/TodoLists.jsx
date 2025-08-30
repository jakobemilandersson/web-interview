import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'
import { lightGreen } from '@mui/material/colors'

const fetchTodoLists = async () => {
  try {
    const res = await fetch('http://localhost:3001/todoLists')
    const data = await res.json()
    return data
  } catch (err) {
    return console.error(err)
  }
}

const updateTodoList = async (todoListId, todos) => {
  try {
    const res = await fetch(`http://localhost:3001/todoLists/${todoListId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todos }),
    })
    const data = await res.json()
    return data
  } catch (err) {
    return console.error(err)
  }
}

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()

  useEffect(() => {
    fetchTodoLists().then(setTodoLists)
  }, [])

  if (!Object.keys(todoLists).length) return null
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {Object.keys(todoLists).map((key) => {
              const { todos } = todoLists[key]
              const allDone = todos.length > 0 && todos.every((todo) => todo.done)
              return (
                <ListItemButton
                  key={key}
                  onClick={() => setActiveList(key)}
                  style={{
                    backgroundColor: allDone ? lightGreen[100] : null,
                    transition: 'background-color 0.5s ease',
                  }}
                >
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText primary={todoLists[key].title} />
                </ListItemButton>
              )
            })}
          </List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={async (id, { todos }) => {
            try {
              const newTodoLists = await updateTodoList(id, todos)
              setTodoLists(newTodoLists)
            } catch (err) {
              console.error(err)
            }
          }}
          onTodosChange={(newTodos) => {
            setTodoLists((oldTodos) => ({
              ...oldTodos,
              [activeList]: { ...oldTodos[activeList], todos: newTodos },
            }))
          }}
        />
      )}
    </Fragment>
  )
}
