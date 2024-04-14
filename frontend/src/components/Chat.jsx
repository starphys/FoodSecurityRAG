import { useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import SendIcon from '@mui/icons-material/Send'
function Chat() {
    const [messages, setMessages] = useState([{ text: "How can I help you today?", sender: "rag" }])
    const [input, setInput] = useState('')
  
    const sendMessage = (e) => {
      e.preventDefault()
      if (input.trim()) {
        setMessages([...messages, { text: input, sender: "user" }])
        setInput('')
      }
    }
  
    return (
      <Box sx={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        height: '100vh'
      }}>
        <Paper elevation={3} sx={{ width: 300, height: 400, overflow: 'auto', backgroundColor: 'lightgrey' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
            {messages.map((message, index) => (
              <Box key={index}
                sx={{
                  backgroundColor: message.sender === "user" ? 'white' : 'blue',
                  color: message.sender === "user" ? 'black' : 'white',
                  padding: 1,
                  borderRadius: 1,
                  marginBottom: 1,
                  alignSelf: message.sender === "user" ? 'flex-end' : 'flex-start',
                  maxWidth: '70%'
                }}>
                <Typography variant="body1">{message.text}</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
        <Box component="form" onSubmit={sendMessage} sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ width: 300, marginRight: 1 }}
          />
          <Button variant="contained" color="primary" type="submit">
            <SendIcon />
          </Button>
        </Box>
      </Box>
    )
  }
  
  export default Chat