const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Get User Data using User's ID
router.get('/:userID', async (req, res) => {
	try {
		const user = await User.find({
			_id: req.params.userID
		})
		res.send({ name: user[0].name, profileURL: user[0].profileURL, id: user[0]._id})
	} catch (error) {
		res.send({error})
	}
})

// Get User Data using User's Name
router.get('/', async (req, res) => {
	let userArr = []
	try {
		const user = await User.find({
			name: {
				$regex: req.query.name,
				$options: "i"
			}
		})
		for(const e of user){
			let obj = {name: e.name, profileURL: e.profileURL, id: e._id}
			userArr.push(obj)
		}
		res.send(userArr)
	} catch (error) {
		res.send(error.message)
	}
})

module.exports = router