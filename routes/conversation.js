const express = require('express')
const router = express.Router()
const Conversation = require('../models/Conversation')
const Chat = require('../models/Chat')
const mongoose = require('mongoose')

// New Conversation
router.post('/', async (req, res) => {

	const combinedID = req.body.currentUserID > req.body.friendID ? req.body.currentUserID + req.body.friendID : req.body.friendID + req.body.currentUserID
	try{
		const conversation = await Conversation.findOne({
			userChat: req.body.currentUserID,
			friends: { $elemMatch: { friendID: req.body.friendID }}
		},{ "friends.friendID": 1})
		
		// Not for use, just for learning ---> friendsID: { $in: [req.body.friendID] }

		if(conversation?.friends.length) return res.send({oldConversation: true})
		
		await Conversation.findOneAndUpdate({userChat: req.body.currentUserID}, { $push: { friends: { friendID: req.body.friendID } }})
		await Conversation.findOneAndUpdate({userChat: req.body.friendID}, { $push: { friends: { friendID: req.body.currentUserID } }})
		
		// Creating Document with Combined Chat ID
		Chat.create({
			chatID: combinedID,
		})
		res.send({oldConversation: false})
	}
	catch(error){
		res.send(error.message)
	}
})

// Get Conversation of User
router.get('/:userID', async (req, res) => {
	try {
		const conversation = await Conversation.aggregate([
			{ $match: { userChat: mongoose.Types.ObjectId(req.params.userID) }},
			{ $unwind: "$friends" },
			{ $sort: {"friends.lastUpdated": -1 }},
			{ $group: { _id:"$userChat", friends: {$push:"$friends"} }}
		])
		res.send({user: conversation[0]._id, friends: conversation[0].friends})
	} catch (error) {
		res.send({error: error.message})
	}
})

module.exports = router