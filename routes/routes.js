const express = require("express")
const controller = require("../controllers/controller")
const router = express.Router()

router.get("/get-test", controller.checkServerHealth)
router.post("/create-user", controller.createUser)
router.get("/get-user/fbid/:fbUserId", controller.getUserByFbUserId)
router.post("/update-user-settings", controller.updateUserSettings)
router.post("/update-user-itinerary", controller.updateUserItinerary)
router.get("/search-buddies/:userId", controller.searchBuddies)
router.post("/send-email", controller.sendEmail)
router.post("/realtime/user-joined", controller.realTimeUserJoined)
router.post("/realtime/user-left", controller.realTimeUserLeft)

module.exports = router
