const express = require('express')
const cors = require('cors')
// const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3001
require('dotenv').config()

const app = express()

app.use(express.json())
// app.use(bodyParser.json())
app.use(cors())

app.use('/media', express.static('temp'))

// Root
app.get('/', (req,res) => {
  res.json({success: "Success"})
})

// Authentication Route
app.use('/auth', require('./routes/auth'))

// Chat Route
app.use('/chat', require('./routes/chat'))

app.listen(PORT, ()=> {
  if(process.env.NODE_ENV !== 'production')
    console.log(`Server running on http://localhost:${PORT}`)
})