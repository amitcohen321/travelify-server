const socket = require("../socket")
const connectedUsers = require("./realtime")
const {validationResult} = require("express-validator/check")

;({compareAsc} = require("date-fns"))
const User = require("../models/user")
const Itinerary = require("../models/Itinerary")

exports.checkServerHealth = (req, res, next) => {
	console.log("request has arrived to server")
	res.send("server is working")
}

exports.getUserByFbUserId = (req, res, next) => {
	User.find({"loginInfo.fbUserId": req.params.fbUserId})
		.populate("itinerary")
		.then(user => {
			res.status(200).send(user)
		})
		.catch(err => console.log(err))
}

exports.createUser = (req, res, next) => {
	console.log("server: creating user and itinerary")
	console.log(req.body.fbProfileLink)

	new Itinerary({
		destinations: req.body.destinations
	})
		.save()
		.then(newItinerary => {
			new User({
				name: req.body.userInfo.name,
				about: req.body.userInfo.about,
				age: req.body.userInfo.age,
				email: req.body.userInfo.email,
				fbProfileLink: req.body.userInfo.fbProfileLink,
				gender: req.body.userInfo.gender,
				imageUrl: req.body.userInfo.imageUrl,
				residence: req.body.userInfo.residence,
				language: {
					mainLang: req.body.userInfo.language.mainLang,
					speaksEnglish: req.body.userInfo.language.speaksEnglish
				},
				preferneces: {
					discoverable: req.body.preferneces.discoverable,
					radius: req.body.preferneces.radius
				},
				loginInfo: {
					token: req.body.loginInfo.token,
					fbUserId: req.body.loginInfo.fbUserId
				},
				itinerary: newItinerary._id
			})
				.save()
				.then(newUser => {
					res.status(201).send(newUser._id) // send back to client
				})
				.catch(err => console.log(err))
		})
		.catch(err => console.log(err))
}

exports.updateUserSettings = (req, res, next) => {
	const errors = validationResult(req).array()
	if (errors.length === 0) {
		// no validation errors
		User.findById(req.body.userInfo.id)
			.then(user => {
				user.about = req.body.userInfo.about
				user.language.mainLang = req.body.userInfo.language.mainLang
				user.language.speaksEnglish = req.body.userInfo.language.speaksEnglish
				user.preferneces.radius = req.body.preferneces.radius
				user.preferneces.discoverable = req.body.preferneces.discoverable
				return user
					.save()
					.then(user => res.status(204).send(user))
					.catch(err => console.log(err))
			})
			.catch(err => console.log(err))
	} else {
		// console.log(errors[0].msg)
		console.log(errors)
		return res.status(422).send({errors: errors})
	}
}

exports.updateUserItinerary = (req, res, next) => {
	User.findById(req.body.userInfo.id)
		.then(user => {
			Itinerary.findById(user.itinerary)
				.then(itinerary => {
					itinerary.destinations = [...req.body.destinations]
					itinerary
						.save()
						.then(itinerary => {
							console.log("itinerary updated for user")
							res.status(200).send(itinerary)
						})
						.catch(err => console.log(err))
				})
				.catch(err => console.log(err))
		})
		.catch(err => console.log(err))
}

// TODO: Refactor this function
exports.searchBuddies = (req, res, next) => {
	const usersThatMatch = []
	User.findById(req.params.userId)
		.then(user => {
			Itinerary.findById(user.itinerary)
				.then(itinerary => {
					itinerary.destinations.forEach(userDestination => {
						const destId = userDestination.location.placeId
						const userStart = userDestination.startDate
						const userEnd = userDestination.endDate

						User.find()
							.then(users => {
								users.forEach(user => {
									Itinerary.findById(user.itinerary)
										.then(itinerary => {
											itinerary.destinations.forEach(destination => {
												if (destination.location.placeId === destId) {
													if (
														areDatesParallel(
															userStart,
															userEnd,
															destination.startDate,
															destination.endDate
														) &&
														user.preferneces.discoverable
													) {
														usersThatMatch.push(user)
													}
												}
											})
										})
										.catch(err => console.log(err))
								})
							})
							.catch(err => console.log(err))
					})
				})
				.catch(err => console.log(err))
		})
		.catch(err => console.log(err))

	// TODO: CHANGE IT TO WORK without settimeout function
	setTimeout(function() {
		res.status(200).send(usersThatMatch)
	}, 3000)
}

exports.sendEmail = (req, res, next) => {
	console.log(req.body)
	const msg = {
		to: req.body.recipient,
		from: req.body.sender,
		subject: "You've got a new message from Travelify!",
		// text: req.body.message,
		html: `
		<div style="background-color: 'lightblue'; text-align: 'center'">
		<h1> Travelify </h1>
		<h3>${req.body.senderName} just sent you a message!</h3>
		<p> ${req.body.message} </p>
		<span>Click <a href='${req.body.fbProfileLink}' target='_blank'>HERE</a> to check out ${
			req.body.senderName
		}'s Facebook profile and reply if you feel like </span>
		</div>
		`
	}
	req.sgMail
		.send(msg)
		.then(response => {
			res.status(200).send("email_sent")
			console.log("message sent")
		})
		.catch(err => {
			console.log(err)
			res.send("error with sending an email")
		})
}

// UTIL FUNCS
function areDatesParallel(start1, end1, start2, end2) {
	//TODO: shrink this logic
	if (
		compareAsc(new Date(start1), new Date(start2)) === 0 ||
		compareAsc(new Date(end1), new Date(end2)) === 0 ||
		(compareAsc(new Date(start1), new Date(start2)) === -1 &&
			compareAsc(new Date(start2), new Date(end1)) === -1) ||
		(compareAsc(new Date(start2), new Date(start1)) === -1 &&
			compareAsc(new Date(start1), new Date(end2)) === -1) ||
		(compareAsc(new Date(start1), new Date(start2)) === -1 &&
			compareAsc(new Date(end2), new Date(end1)) === -1) ||
		(compareAsc(new Date(start1), new Date(start2)) === 1 &&
			compareAsc(new Date(end2), new Date(start1)) === 1) ||
		(compareAsc(new Date(start2), new Date(start1)) === 1 &&
			compareAsc(new Date(start2), new Date(end1)) === 1) ||
		(compareAsc(new Date(start1), new Date(start2)) === 1 &&
			compareAsc(new Date(end2), new Date(end1)) === 1)
	) {
		return true
	}
}

exports.realTimeUserJoined = (req, res, next) => {
	const userWithLocation = req.body
	connectedUsers.addUser(userWithLocation)
	console.log("user joined real time")
	socket.getSocket().emit("user_joined", connectedUsers.getUsers())
	res.end()
}

exports.realTimeUserLeft = (req, res, next) => {
	const userWithLocation = req.body
	const filteredArr = connectedUsers
		.getUsers()
		.filter(user => user.user.id !== userWithLocation.user.id)
	connectedUsers.setUsers(filteredArr)
	socket.getSocket().emit("user_left", connectedUsers.getUsers())
	console.log("user left real time")
	res.end()
}
