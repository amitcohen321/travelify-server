// IMPORTS
const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes/routes")
const cors = require("cors")
const SENDGRID_API_KEY = require("./consts").SENDGRID_API_KEY
const MONGO_DB_CONNECT_STRING = require("./consts").MONGO_DB_CONNECT_STRING

//email
const sgMail = require("@sendgrid/mail")
sgMail.setApiKey(SENDGRID_API_KEY)

// CONSTS
const app = express()
const port = process.env.port || "4000"

// MIDDLEWARE
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE")
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
	next()
})
app.use((req, res, next) => {
	req.sgMail = sgMail
	next()
})
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(routes)

// DB
const User = require("./models/user")
mongoose
	.connect(MONGO_DB_CONNECT_STRING, {
		useNewUrlParser: true
	})
	.then(result => {
		app.listen(4000)
		console.log("Server is running at " + port)
	})
	.catch(err => console.log(err))
