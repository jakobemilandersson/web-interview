import { useEffect, useState } from 'react'
import { TextField, Card, CardContent, CardActions, Button, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { blue, lightGreen, grey } from '@mui/material/colors'
import { toast } from 'react-toastify'

const BASE_PATH = 'http://localhost:3001/todoLists'

const ONE_MINUTE_IN_MS = 60 * 1000
const ONE_HOURS_IN_MS = 60 * ONE_MINUTE_IN_MS
const ONE_DAY_IN_MS = 24 * ONE_HOURS_IN_MS

export const TodoListForm = ({ todoList, saveTodoList, onTodosChange }) => {
  const [timeLeftMap, setTimeLeftMap] = useState([])
  const [offsyncTodosData, setOffsyncTodosData] = useState({})

  const todos = todoList.todos
  const allDone = todos.length > 0 && todos.every(todo => todo.done)
  const TODOS_PATH = `${BASE_PATH}/${todoList.id}/todos`

  useEffect(() => {
    const updateTimeLeft = (todos) => setTimeLeftMap(todos.map((todo) => getTimeLeftText(todo)))

    const notDoneTodos = todos.filter(todo => !todo.done)

    updateTimeLeft(todos)
    if(notDoneTodos.length > 0) {
      const interval = setInterval(
        () => { updateTimeLeft(todos) },
        ONE_MINUTE_IN_MS
      )

    return () => clearInterval(interval)
    }
  }, [todos])

  const handleSubmit = (event) => {
    event.preventDefault()
    saveTodoList(todoList.id, { todos })
  }

  const getTimeLeftText = (todo) => {
    const { deadline, done } = todo;

    if(done) return 'Completed'

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

  const updateOffsyncTodoIds = (todoId, isOffSync = false, offsyncData = {}) => {
    const { property } = offsyncData; // Property of todo that is offsync TODO: multiple properites handling without input disabling
    if(!todoId) return;
    if(isOffSync && !property) return // TODO: fix so offsync is visible for edgecases where no offsync property is recognized

    setOffsyncTodosData(oldOffsyncItems => {
      const newOffsyncItems = { ...oldOffsyncItems }

      if(!isOffSync) { // Property is no longer offsync
        delete newOffsyncItems[todoId]
      } else { // Property IS offsync
        newOffsyncItems[todoId] = property
      }

      return newOffsyncItems
    })
  }

  const updateTodo = async (index, updateData) => {
    const todo = todos[index]
    const updatedTodo = await fetchWithErrors(todo.id, { method: 'PUT', body: JSON.stringify(updateData) });

    onTodosChange([
      ...todos.slice(0, index),
        { ...todo, ...updatedTodo },
      ...todos.slice(index + 1),
    ])
      toast.success('Todo updated')
  }

  const fetchWithErrors = async (todoId, params = {}) => {
    const headers = { 'Content-Type': 'application/json' }
    const url = `${TODOS_PATH}${todoId ? `/${todoId}` : ''}`
    const res = await fetch(url, { ...params, headers })


    if(!res.ok) {
      const errorData = await res.json();
      const { error = 'Unrecognized Error', details = {} } = errorData

      if(todoId) updateOffsyncTodoIds(todoId, true, details)

      toast.error(error)
      throw new Error(error);
    }

    if(todoId) updateOffsyncTodoIds(todoId)


    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    return { ok: true }
  }

  const inputDisabled = (todo, name, overrideDone = false) => {
    const { done, id } = todo;

    // Check if Todo has any offsync property, if so only enable the input of the offsync property
    if(offsyncTodosData[id]) {
      const property = offsyncTodosData[id]

      return name !== property // Todo is offsync with server so disable all inputs except for the one with the offsync property
    }
    if(!overrideDone && done) return true; // Todo is marked as done and input is other than "done"-checkbox
    return false;
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
            <div key={id} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: done ? lightGreen[800] : grey[600], alignSelf: 'center', marginTop: '1rem' }}>
                {timeLeftMap[index]}
              </span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                { offsyncTodosData[id] && (
                  <SyncProblemIcon /> 
                )}
                <Checkbox
                  sx={{ 
                    '&.Mui-checked': {
                      color: blue[600],
                    },
                  }}
                  checked={done}
                  disabled={inputDisabled({ id, done }, "done", true)}
                  onChange={(event) => updateTodo(index, { done: event.target.checked })}
                />
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {index + 1}
                </Typography>
                <TextField
                  sx={{ flexGrow: 1, marginTop: '0.5rem' }}
                  label='What to do?'
                  defaultValue={name}
                  disabled={inputDisabled({ id, done }, "name")}
                  onBlur={(event) => updateTodo(index, { name: event.target.value })}
                />
                <TextField
                  sx={{ flexGrow: 1, marginTop: '0.5rem', marginLeft: '1rem' }}
                  label='Deadline'
                  type='datetime-local'
                  defaultValue={deadline}
                  disabled={inputDisabled({ id, done }, "deadline")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onBlur={(event) => updateTodo(index, { deadline: event.target.value })}
                />
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
                  onClick={async () => {
                    const res = await fetchWithErrors(id, { method: 'DELETE' });

                    if(res.ok) {
                      onTodosChange([
                        // immutable delete
                        ...todos.slice(0, index),
                        ...todos.slice(index + 1),
                      ])
                      toast.success('Removed todo')
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
                const todo = await fetchWithErrors(null, { method: 'POST', headers: { 'Content-Type': 'application/json' } });

                onTodosChange([
                  ...todos,
                  todo
                ])
                  toast.success('Added new todo')
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
