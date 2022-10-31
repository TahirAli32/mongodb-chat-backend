const express = require('express')
const router = express.Router()
// const { v4: uuidv4 } = require('uuid')

router.get('/', async(req, res) => {
	res.send('chat')
})

module.exports = router