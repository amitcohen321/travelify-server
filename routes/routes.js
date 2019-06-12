const express = require("express")
const controller = require("../controllers/controller")
const router = express.Router()
const {body} = require("express-validator/check")

router.get("/get-test", controller.checkServerHealth)
router.post("/create-user", controller.createUser)
router.get("/get-user/fbid/:fbUserId", controller.getUserByFbUserId)

router.post(
	"/update-user-settings",
	[
		body("userInfo.about")
			.isLength({min: 10})
			.withMessage("About field has to be longer than 10 chars"),
		// body("userInfo.language.mainLang")
		// 	.matches("english", "french", "german", "hebrew", "spanish")
		// .withMessage("Spoken Language not supported"),
		// body("userInfo.language.speaksEnglish")
		// 	.matches("true", "false")
		// 	.withMessage("Speaks English invalid value"),
		body("preferneces.radius")
			.isNumeric()
			.withMessage("Radius value is not numeric")
			.isInt({min: 1, max: 30})
			.withMessage("Radius not in range")
	],
	controller.updateUserSettings
)

//req.body.userInfo.about
//req.body.userInfo.language.mainLang
//req.body.userInfo.language.speaksEnglish
//req.body.preferneces.radius
//req.body.preferneces.discoverable

router.post("/update-user-itinerary", controller.updateUserItinerary)
router.get("/search-buddies/:userId", controller.searchBuddies)
router.post("/send-email", controller.sendEmail)
router.post("/realtime/user-joined", controller.realTimeUserJoined)
router.post("/realtime/user-left", controller.realTimeUserLeft)

module.exports = router
