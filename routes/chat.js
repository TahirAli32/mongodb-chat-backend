const express = require('express')
const router = express.Router()
const Chat = require('../models/Chat')
// const { v4: uuidv4 } = require('uuid')

// Send Message
router.post('/', async (req, res) => {

	const combinedID = req.body.senderID > req.body.friendID ? req.body.senderID + req.body.friendID : req.body.friendID + req.body.senderID

	const messageData = {
		senderID: req.body.senderID,
		message: req.body.message,
	}

	try{
		await Chat.findOneAndUpdate({chatID: combinedID}, { $push: { messages: messageData } })
		res.send({success: "Message Sent Successfully"})
	}catch(error){
		res.send({error})
	}
})

// Get Message of User
router.get('/:conversationID', async (req, res) => {
	try {
		const messages = await Chat.find({
			conversationID: req.params.conversationID
		})
		res.send({messages})
	} catch (error) {
		res.send({error})
	}
})

module.exports = router