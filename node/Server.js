// Requirements
var io = require("socket.io")
    User = require("./User");

/**
 * Websocket Server
 *
 * @param {object} config
 */
function Server(config)
{
    this.config = config;
    this.socket = this.createSocket(config);
    this.users  = {};

    this.socket.sockets.on("connection", this.onSocketConnection.bind(this));
}

/**
 * Create a websocket listener
 *
 * @param {object} config
 *
 * @return {object}
 */
Server.prototype.createSocket = function(config)
{
    var socket = io.listen(config.socket_port),
        server = this;

    socket.configure(
        function() {
            socket.set('transports', ["websocket"]);
            socket.set('log level', 2);
            socket.set('origin', config.allowed_domain);
        }
    );

    return socket;
};

/**
 * On websocket Connexion
 *
 * @param {object} socket
 */
Server.prototype.onSocketConnection = function(socket)
{
    console.log("Client connected: ", socket.id);

    var server = this,
        user = new User(socket.id);

    socket.on('disconnect', function () { server.onSocketDisconnection(this); });

    user.setSocket(socket);

    this.addUser(user);
};

/**
 * On websocket disconnexion
 *
 * @param {Object} client
 */
Server.prototype.onSocketDisconnection = function(socket)
{
    var user = null;

    for (var username in this.users) {
        if (this.users[username].socket.id === socket.id) {
            user = this.users[username];
            break;
        }
    }

    if (user) {
        user.socket.broadcast.emit('user:leave', {username: user.username});

        delete this.users[username];
    }
};

/**
 * Add an user to the list
 *
 * @param {User} user
 */
Server.prototype.addUser = function(user)
{
    if (typeof this.users[user.username] == 'undefined') {
        user.socket.emit('me:authenticated', user.serialize());
        user.socket.broadcast.emit('user:join', user.serialize());

        for (var username in this.users) {
            user.socket.emit('user:join', this.users[username].serialize());
        }

        this.users[user.username] = user;
    }
};

module.exports = Server;