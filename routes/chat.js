const express = require('express')
const router = express.Router()
const Chat = require('../models/Chat')

// Send Message
router.post('/', async (req, res) => {

	// const chatID = req.body.senderID > req.body.friendID ? req.body.senderID + req.body.friendID : req.body.friendID + req.body.senderID
	const messageData = {
		senderID: req.body.senderID,
		message: req.body.message,
	}
	try{
		await Chat.findOneAndUpdate({chatID: req.body.chatID}, { $push: { messages: messageData } })
		res.send({success: "Message Sent Successfully"})
	}catch(error){
		res.send({error})
	}
})

// Get Message of User
router.get('/:chatID', async (req, res) => {
	try {
		const messages = await Chat.find({
			chatID: req.params.chatID
		})
		res.send(messages)
	} catch (error) {
		res.send({error})
	}
})

module.exports = router