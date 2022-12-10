const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { serialize } = require('cookie')
const User = require('../models/User')
const Conversation = require('../models/Conversation')
const { loginValidation, registerValidation } = require('../middleware/authValidation')

const router = Router()

router.post('/signup', async (req, res) => {
	// If Data in Valid
	const { error } = registerValidation(req.body)
	if (error) return res.send({ error: error.details[0].message })

	// Checking if Email Already Exists
	const emailExist = await User.findOne({ email: req.body.email })
	if (emailExist) return res.send({ error: 'Email Already Exists' })

	// Hash Password
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(req.body.password, salt)

	// Create New User
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
	})


	try {
		// Save user to DB
		await user.save()

		// Creating Document with User's ID
		Conversation.create({
			userChat: user._id,
		})

		res.send({ success: `User saved Successfully. Id is ${user._id}` })
	} catch (error) {
		res.send({ error })
	}
})

router.post('/login', async (req, res) => {
	// If Data in Valid
	const { error } = loginValidation(req.body)
	if (error) return res.send({ error: error.details[0].message, errorType: error.details[0].path[0] })

	// Checking if Entered Email is Correct
	const user = await User.findOne({ email: req.body.email })
	if (!user) return res.send({ error: 'Email not found', errorType: 'email' })

	// Checking if Entered Password is Correct
	const validPassword = await bcrypt.compare(req.body.password, user.password)
	if (!validPassword) return res.send({ error: 'Password is Incorrect', errorType: 'password' })

	// Checking if User has Checked Remember Me
	let oneHour = 60 * 60
	let oneMonth = 60 * 60 * 24 * 30
	let tokenAge = req.body.rememberMeToken ? oneMonth : oneHour

	// Create and Assign JWT Token
	const token = jwt.sign(
		{
			exp: Math.floor(Date.now()/1000) + tokenAge,
			_id: user._id,
			name: user.name,
			role: user.role
		}, "mytokensecret32" 
	)
	
	// Saving Token in Cookies
	const serialised = serialize("authToken", token, {
		httpOnly: false,
		secure: process.env.NODE_ENV !== "development",
		// sameSite: "strict",
		sameSite: "none",
		maxAge: tokenAge,
		// path: "/"
	})
	// res.setHeader('Set-Cookie', serialised)
	res.status(200).send({success: `Login Successful. User ID is ${user._id}`, serialised})
})

router.post('/validatetoken', async (req, res) => {
	// Destructutring Token for Body
	const { authToken } = req.body

	// Verify Token
	jwt.verify(authToken, 'mytokensecret32', async (err, decoded) => {
		if(err){
			res.send({ error: 'Token is incorrect'})
			return
		}
		else{
			const user = await User.findById({ _id: decoded._id })
			if (!user) return res.send({ error: 'Token is Tempered' })
			// const serialised = serialize("done", true, {
			// 	httpOnly: false,
			// 	secure: process.env.NODE_ENV !== "development",
			// 	sameSite: "strict",
			// 	maxAge: 60 * 10,
			// 	path: "/"
			// })
			// res.setHeader('Set-Cookie', serialised)
			res.send({ success: { id: user._id, name: user.name} })
		}
	})
})

module.exports = router