const express = require('express')
const router = express.Router()
const Chat = require('../models/Chat')
const Conversation = require('../models/Conversation')

// Send Message
router.post('/', async (req, res) => {

	const messageData = {
		senderID: req.body.senderID,
		message: req.body.message,
	}

	const receiverID = req.body.chatID.split(req.body.senderID).filter(e => e === 0 ? true : e)

	try{
		await Chat.findOneAndUpdate({ chatID: req.body.chatID }, { $push: { messages: messageData } })
		
		await Conversation.findOneAndUpdate({ userChat: req.body.senderID },
			{
				$set: {
					"friends.$[updateFriendID].lastUpdated": new Date().toISOString()
				}
			},
			{ "arrayFilters": [{ "updateFriendID.friendID": receiverID }] }
		)
		await Conversation.findOneAndUpdate({ userChat: receiverID },
			{
				$set: {
					"friends.$[updateFriendID].lastUpdated": new Date().toISOString()
				}
			},
			{ "arrayFilters": [{ "updateFriendID.friendID": req.body.senderID }] }
		)
		res.send({success: "Message Sent Successfully"})
	} catch(error){
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