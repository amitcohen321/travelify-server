const mongoose = require("mongoose")
const Schema = mongoose.Schema

const itinerarySchema = new Schema({
	destinations: []
})

module.exports = mongoose.model("Itinerary", itinerarySchema)
