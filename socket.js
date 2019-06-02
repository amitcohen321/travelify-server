let io

module.exports = {
	initSocket: httpServer => {
		io = require("socket.io")(httpServer)
		return io
	},
	getSocket: () => {
		if (!io) {
			throw new Error("[my-error]Socket.io not initialized")
		} else {
			return io
		}
	}
}
