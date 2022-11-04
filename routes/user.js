const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Get User Data
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

module.exports = router