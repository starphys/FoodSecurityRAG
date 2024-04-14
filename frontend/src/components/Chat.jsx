import { useState, useEffect, useRef } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import SendIcon from '@mui/icons-material/Send'
function Chat () {
  const [messages, setMessages] = useState([{ content: 'How can I help you today?', role: 'assistant' }])
  const [input, setInput] = useState('')

  const scrollRef = useRef(null)

  useEffect(() => {
    // Scroll to the bottom of the chat window
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (messages[messages.length - 1].role !== 'user') {
      return
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
          data.response
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
    console.log(messages)
    if (input.trim()) {
      setMessages(prevMessages => [
        ...prevMessages,
        { content: input, role: 'user' }
      ])

      setInput('')
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(23deg, hsl(49deg, 100%, 69%) 0%, hsl(16deg, 80%, 61%) 2%, hsl(330deg, 81%, 34%) 12%, hsl(259deg, 100%, 15%) 50%, hsl(212deg, 100%, 25%) 88%, hsl(197deg, 100%, 30%) 98%, hsl(183deg, 79%, 36%) 100%)'
    }}
    >
      <Box sx={{
        width: 800,
        backgroundColor: 'lightgrey',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3
      }}
      >
        <Box sx={{
          width: 800,
          height: 40,
          backgroundColor: '#404040',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        >
          <Box sx={{ width: 'auto', paddingTop: 0.5 }}>
            <img
              src='https://tmpfiles.nohat.cc/visualhunter-a1bf6d3746.png'
              width='45'
              height='45'
            />
          </Box>
          <Typography color='white' sx={{ flexGrow: 0 }}>Food Security and Nutrition GPT</Typography>
          <div style={{ width: '45px' }} />
        </Box>
        <Box
          ref={scrollRef}
          sx={{
            width: 800,
            height: 600,
            overflow: 'auto',
            backgroundColor: 'lightgrey',
            overflow: 'overlay',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0, 0, 0, 0.5) transparent'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: 1 }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: message.role === 'user' ? 'blue' : 'white',
                  color: message.role === 'user' ? 'white' : 'black',
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
        </Box>
        <Box
          component='form'
          onSubmit={sendMessage}
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 2,
            backgroundColor: 'white',
            padding: 1
          }}
        >
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Type your message...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ width: 800, marginRight: 1 }}
          />
          <Button variant='contained' color='primary' type='submit'>
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Chat
