// IMPORTS
const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes/routes")
var cors = require("cors")
const SENDGRID_API_KEY = require("./consts").SENDGRID_API_KEY
const MONGO_DB_CONNECT_STRING = require("./consts").MONGO_DB_CONNECT_STRING

//email
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY || SENDGRID_API_KEY)

// CONSTS
const app = express()

// MIDDLEWARE
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "https://travelify.amitco.info")
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE")
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
	next()
})
app.use(cors())
app.use((req, res, next) => {
	req.sgMail = sgMail
	next()
})
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(routes)

// DB
const User = require("./models/user")
mongoose
	.connect(process.env.MONGO_DB_CONNECT_STRING || MONGO_DB_CONNECT_STRING, {
		useNewUrlParser: true
	})
	.then(result => {
		const server = app.listen(process.env.PORT || 4000)
		const io = require("./socket").initSocket(server)
		io.on("connection", socket => {
			console.log("[SOCKET] client connected")
		})
		console.log("Server is running")
	})
	.catch(err => console.log(err))
