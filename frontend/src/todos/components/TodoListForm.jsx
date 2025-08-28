import { TextField, Card, CardContent, CardActions, Button, Typography, Checkbox } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { blue, lightGreen } from '@mui/material/colors'

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export const TodoListForm = ({ todoList, saveTodoList, onTodosChange }) => {
  const todos = todoList.todos
  const allDone = todos.every(todo => todo.done)

  const handleSubmit = (event) => {
    event.preventDefault()
    saveTodoList(todoList.id, { todos })
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
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
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
                sx={{ flexGrow: 10, marginTop: '1rem' }}
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
                sx={{ flexGrow: 1, marginTop: '1rem', marginLeft: '1rem' }}
                label="Deadline"
                type="datetime-local"
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
