const express = require('express')
const router = express.Router()
const Conversation = require('../models/Conversation')
const Chat = require('../models/Chat')
// const { v4: uuidv4 } = require('uuid')

// New Conversation
router.post('/', async (req, res) => {
	const combinedID = req.body.currentUserID > req.body.friendID ? req.body.currentUserID + req.body.friendID : req.body.friendID + req.body.currentUserID

	try{
		const conversation = await Conversation.find({
			userChat: req.body.currentUserID,
			friendsID: { $in: [req.body.friendID] }
		})
		if(conversation.length) return res.send('old conversation')
		
		await Conversation.findOneAndUpdate({userChat: req.body.currentUserID}, { $push: { friendsID: req.body.friendID } })
		await Conversation.findOneAndUpdate({userChat: req.body.friendID}, { $push: { friendsID: req.body.currentUserID } })
		
		// Creating Document with Combined Chat ID
		Chat.create({
			chatID: combinedID,
		})

		res.send('new conversation')
	}
	catch(error){
		res.send(error.message)
	}
})

// Get Conversation of User
router.get('/:userID', async (req, res) => {
	try {
		const conversation = await Conversation.find({
			userChat: req.params.userID
		})
		res.send({user: conversation[0].userChat, friends: conversation[0].friendsID})
	} catch (error) {
		res.send({error})
	}
})

module.exports = router