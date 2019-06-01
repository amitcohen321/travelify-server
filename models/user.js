const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	gender: {
		type: String
	},
	imageUrl: {
		type: String
	},
	age: {
		type: Number
	},
	residence: {
		type: String
	},
	fbProfileLink: {
		type: String
	},
	about: {
		type: String
	},
	language: {
		mainLang: {
			type: String
		},
		speaksEnglish: {
			type: String
		}
	},
	preferneces: {
		radius: {
			type: Number
		},
		discoverable: {
			type: Boolean
		}
	},
	loginInfo: {
		token: String,
		fbUserId: String
	},
	itinerary: {
		type: Schema.Types.ObjectId,
		ref: "Itinerary"
	}
})

module.exports = mongoose.model("User", userSchema)
