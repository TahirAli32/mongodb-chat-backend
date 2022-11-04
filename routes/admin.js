const { Router } = require('express')
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const Chat = require('../models/Chat')

const router = Router()


router.get('/users', async (req, res) => {
	const users = await User.find()
	res.json(users)
})

router.get('/conversations', async (req, res) => {
	const conversations = await Conversation.find()
	res.json(conversations)
})

router.get('/chats', async (req, res) => {
	const chats = await Chat.find()
	res.json(chats)
})

router.get('/all', async (req, res) =>{
	const users = await User.find()
	const conversations = await Conversation.find()
	const chats = await Chat.find()
	res.send({users, conversations, chats})
})

module.exports = router