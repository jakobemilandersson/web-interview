import { useEffect, useState } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { blue, lightGreen, grey } from '@mui/material/colors'

const ONE_MINUTE_IN_MS = 60 * 1000
const ONE_HOURS_IN_MS = 60 * ONE_MINUTE_IN_MS
const ONE_DAY_IN_MS = 24 * ONE_HOURS_IN_MS

export const TodoListForm = ({ todoList, saveTodoList, onTodosChange }) => {
  const [timeLeftMap, setTimeLeftMap] = useState([])
  const todos = todoList.todos
  const allDone = todos.every(todo => todo.done)

  useEffect(() => {
    const updateTimeLeft = () => setTimeLeftMap(todos.map((todo) => getTimeLeftText(todo.deadline)))

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, ONE_MINUTE_IN_MS)

    return () => clearInterval(interval)
  }, [todos])

  const handleSubmit = (event) => {
    event.preventDefault()
    saveTodoList(todoList.id, { todos })
  }

  const getTimeLeftText = (deadline) => {
    const diffInMs = new Date(deadline) - new Date()
    const isOverdue = diffInMs < 0
    const absolutDiffInMs = Math.abs(diffInMs)
    
    const days = Math.floor(absolutDiffInMs / ONE_DAY_IN_MS)
    const hours = Math.floor(absolutDiffInMs / ONE_HOURS_IN_MS) % 24
    const minutes = Math.floor(absolutDiffInMs / ONE_MINUTE_IN_MS) % 60
    
    const timeParts = [
      days && `${days}d`,
      hours && `${hours}h`,
      minutes && `${minutes}m`
    ].filter(Boolean)
    
    if(!timeParts.length) return ''

    const timeText = timeParts.join(' ')
    return isOverdue ? `${timeText} overdue` : `${timeText} left`
  }

  const updateTodo = async (index, updateData) => {
    const todo = todos[index]
    const res = await fetch(`http://localhost:3001/todoLists/${todoList.id}/todos/${todo.id}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    })
    const updateTodo = await res.json()

    onTodosChange([
      ...todos.slice(0, index),
      { ...todo, ...updateTodo },
      ...todos.slice(index + 1),
    ])
  }

  return (
    <Card
      sx={{ 
        margin: '0 1rem',
        backgroundColor: allDone ? lightGreen[100] : null,
        transition: 'background-color 0.5s ease'
      }}
    >
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {todos.map(({ name, done, deadline, id }, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: grey[500], alignSelf: 'center', marginTop: '1rem' }}>
                {timeLeftMap[index]}
              </span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  sx={{ 
                    '&.Mui-checked': {
                      color: blue[600],
                    },
                  }}
                  checked={done}
                  onChange={(event) => updateTodo(index, { done: event.target.checked })}
                />
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {index + 1}
                </Typography>
                <TextField
                  sx={{ flexGrow: 1, marginTop: '0.5rem' }}
                  label='What to do?'
                  value={name}
                  disabled={done}
                  onChange={(event) => updateTodo(index, { name: event.target.value })}
                />
                <TextField
                  sx={{ flexGrow: 1, marginTop: '0.5rem', marginLeft: '1rem' }}
                  label='Deadline'
                  type='datetime-local'
                  defaultValue={deadline}
                  disabled={done}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => updateTodo(index, { deadline: event.target.value })}
                />
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
                  onClick={async () => {
                    const res = await fetch(`http://localhost:3001/todoLists/${todoList.id}/todos/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })

                    if(res.ok) {
                      onTodosChange([
                        // immutable delete
                        ...todos.slice(0, index),
                        ...todos.slice(index + 1),
                      ])
                    }
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={async () => {
                const res = await fetch(`http://localhost:3001/todoLists/${todoList.id}/todos`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
                const todo = await res.json()

                onTodosChange([
                  ...todos,
                  todo
                ])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
