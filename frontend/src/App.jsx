import { ThemeProvider, createTheme } from '@mui/material/styles'
import Chat from './components/Chat'
import { AppBar, Toolbar, Typography } from '@mui/material'

const theme = createTheme()

function App () {
  return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar sx={{ width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: '#383838' }}>
          <Typography variant='h6'>World Hunger Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Chat />
    </ThemeProvider>
  )
}

export default App
