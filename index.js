const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const PORT = process.env.PORT || 4000
const app = express()
const mongoose = require('mongoose')
const { createServer } = require('http')
const { Server } = require('socket.io')

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)

app.use(express.json())

const server = createServer(app)

const io = new Server(server, {
  cors:{
    origin: [ process.env.CORS_AND_SOCKET_ORIGIN1, process.env.CORS_AND_SOCKET_ORIGIN2 ],
    credentials: true
  }
})

io.on("connection", socket => {
  socket.on('userJoin', (userID) => {
    socket.join(userID.id)
  })
  socket.on('openChat', (chatID) => {
    socket.join(chatID)
  })
  socket.on("sendMessage", (data) => {
    socket.to(data.chatID).emit("receiveMessage", data.socketData)
    socket.to(data.receiverID).emit("newMessage", {senderID: data.socketData.senderID})
  })
  socket.on("newConversationSend", (data) => {
    socket.to(data.userData.id).emit("newConversationReceive", data.currentUser)
  })
  socket.on("disconnect", (reason) => {
    socket.removeAllListeners('userJoin')
    socket.removeAllListeners('openChat')
    socket.removeAllListeners('sendMessage')
    socket.removeAllListeners('newConversationSend')
  })
})

app.use(cors({
  origin: [process.env.CORS_AND_SOCKET_ORIGIN1, process.env.CORS_AND_SOCKET_ORIGIN2 ],
  credentials: true,
}))

// Root Route, not used in API
app.get('/', (req,res) => {
  res.json({ success: "Success" })
})

// Authentication Route
app.use('/api/auth', require('./routes/auth'))

// User Route
app.use('/api/user', require('./routes/user'))

// Conversation Route
app.use('/api/conversation', require('./routes/conversation'))

// Chat Route
app.use('/api/chat', require('./routes/chat'))

// Admin Route
app.use('/api/admin', require('./routes/admin'))

server.listen(PORT, ()=> {
  if(process.env.NODE_ENV !== 'production')
    console.log('Server running on http://localhost:'+PORT)
})