const express = require('express')
const router = express.Router()
// const { v4: uuidv4 } = require('uuid')

router.get('/signup', async(req, res) => {
	res.send('signup')
})

router.get('/login', async(req, res) => {
	res.send('login')
})