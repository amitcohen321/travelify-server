const mongoose = require("mongoose")
const Schema = mongoose.Schema

// currently not in use
const itinerarySchema = new Schema({
	destinations: []
})

module.exports = mongoose.model("Itinerary", itinerarySchema)
