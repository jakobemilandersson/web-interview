import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import { TodoLists } from './todos/components/TodoLists'
import { ToastContainer } from 'react-toastify'

const MainAppBar = () => {
  return (
    <AppBar position='static' color='primary'>
      <Toolbar>
        <Typography variant='h6' color='inherit'>
          Things to do
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

const mainWrapperStyle = { display: 'flex', flexDirection: 'column' }
const centerContentWrapper = { display: 'flex', justifyContent: 'center' }
const contentWrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '80rem',
  flexGrow: 1,
}
const MainWrapper = ({ children }) => {
  return (
    <div style={mainWrapperStyle}>
      <MainAppBar />
      <div style={centerContentWrapper}>
        <div style={contentWrapperStyle}>{children}</div>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <MainWrapper>
      <TodoLists style={{ margin: '1rem' }} />
      <ToastContainer />
    </MainWrapper>
  )
}

export default App
