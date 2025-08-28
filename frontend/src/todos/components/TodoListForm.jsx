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
          {todos.map(({ name, done, deadline }, index) => (
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
                  onChange={(event) => {
                    onTodosChange([
                      ...todos.slice(0, index),
                      { name: name, done: event.target.checked, deadline: deadline },
                      ...todos.slice(index + 1),
                    ])
                  }}
                />
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {index + 1}
                </Typography>
                <TextField
                  sx={{ flexGrow: 1, marginTop: '0.5rem' }}
                  label='What to do?'
                  value={name}
                  onChange={(event) => {
                    // immutable update
                    onTodosChange([
                      ...todos.slice(0, index),
                      { name: event.target.value, done: done, deadline: deadline },
                      ...todos.slice(index + 1),
                    ])
                  }}
                />
                <TextField
                  sx={{ flexGrow: 1, marginTop: '0.5rem', marginLeft: '1rem' }}
                  label='Deadline'
                  type='datetime-local'
                  defaultValue={deadline}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(event) => {
                    onTodosChange([
                      ...todos.slice(0, index),
                      { name: name, done: done, deadline: event.target.value },
                      ...todos.slice(index + 1),
                    ])
                  }}
                />
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
                  onClick={() => {
                    onTodosChange([
                      // immutable delete
                      ...todos.slice(0, index),
                      ...todos.slice(index + 1),
                    ])
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
              onClick={() => {
                onTodosChange([
                  ...todos,
                  { name: '', done: false, deadline: new Date(Date.now() + ONE_DAY_IN_MS).toISOString().slice(0, 16) }
                ])
              }}
            >
              Add Todo <AddIcon />
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Save
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
