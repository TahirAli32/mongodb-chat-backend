const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const PORT = process.env.PORT || 4000
const app = express()
const mongoose = require('mongoose')

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)

app.use(express.json())

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))

// Root
app.get('/', (req,res) => {
  res.json({success: "Success"})
})

// Authentication Route
app.use('/api/auth', require('./routes/auth'))

// Conversation Route
app.use('/api/conversation', require('./routes/conversation'))

// Messages Route
app.use('/api/messages', require('./routes/messages'))

app.listen(PORT, ()=> {
  if(process.env.NODE_ENV !== 'production')
    console.log('Server running on http://localhost:'+PORT)
})