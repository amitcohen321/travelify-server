var connectedUsers = []

module.exports = {
	addUser: function(user) {
		connectedUsers.push(user)
	},
	getUsers: function() {
		return connectedUsers
	},
	setUsers: function(arr) {
		connectedUsers = [...arr]
	}
}
