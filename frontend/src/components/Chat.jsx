import { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import SendIcon from '@mui/icons-material/Send'
function Chat () {
  const [messages, setMessages] = useState([{ content: 'How can I help you today?', role: 'assistant' }])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (messages[messages.length - 1].role !== 'user') {
      return;
    }
    fetch('/api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message_history: messages })
    })
      .then(response => response.json())
      .then(data => {
        setMessages(prevMessages => [
          ...prevMessages,
          { content: data.response, role: 'assistant' }
        ])
      })
      .catch(error => {
        console.error('Error sending message:', error)
        setMessages(prevMessages => [
          ...prevMessages,
          { content: 'Server failed to respond', role: 'assistant' }
        ])
      })
  }, [messages])

  const sendMessage = (e) => {
    e.preventDefault()
    console.log(messages);
    if (input.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        {content: input, role: 'user'}
      ]);

      setInput('')
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}
    >
      <Paper elevation={3} sx={{ width: 300, height: 400, overflow: 'auto', backgroundColor: 'lightgrey' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: message.role === 'user' ? 'white' : 'blue',
                color: message.role === 'user' ? 'black' : 'white',
                padding: 1,
                borderRadius: 1,
                marginBottom: 1,
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '70%'
              }}
            >
              <Typography variant='body1'>{message.content}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
      <Box component='form' onSubmit={sendMessage} sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Type your message...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ width: 300, marginRight: 1 }}
        />
        <Button variant='contained' color='primary' type='submit'>
          <SendIcon />
        </Button>
      </Box>
    </Box>
  )
}

export default Chat
