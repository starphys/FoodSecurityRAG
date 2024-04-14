import { ThemeProvider, createTheme } from '@mui/material/styles'
import Chat from './components/Chat'

const theme = createTheme({
  // Customize your theme here
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Chat />
    </ThemeProvider>
  )
}

export default App