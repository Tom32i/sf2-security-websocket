// Requirements
var io = require("socket.io")
    redis = require("redis"),
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
    this.redis  = redis.createClient();
    this.users  = {};

    this.redis.on("error", function (error) { console.error("RedisManager Error:", error); });

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
            socket.set('authorization', server.authorizationHandler.bind(server));
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
        data = socket.handshake.user,
        user = new User(data.username, data.roles);

    socket.on('disconnect', function () { server.onSocketDisconnection(this); });
    socket.on('user:move', function (data) { server.onUserMove(this, data); });

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
 * On user move
 *
 * @param {object} socket
 * @param {object} data
 *
 * @return {boolean}
 */
Server.prototype.onUserMove = function(socket, data)
{
    if (typeof(data.x) == 'undefined' || typeof(data.y) == 'undefined') {
        return false;
    }

    for (var username in this.users) {
        if (this.users[username].socket.id === socket.id) {
            this.users[username].setPosition(data.x, data.y);
            return true;
        }
    }
};

/**
 * Authorization Handler
 *
 * @param {object} handshakeData
 * @param {Function} callback
 */
Server.prototype.authorizationHandler = function(handshakeData, callback)
{
    var sessionId = handshakeData.headers.cookie.replace(/(?:(?:^|.*;\s*)PHPSESSID\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
        address = handshakeData.address.address,
        token = handshakeData.query.ticket,
        key = 'ticket:' + token;

    this.redis.get(key, function (redisError, result) {

        if (redisError || !result) {
            return callback("Ticket '" + token + "' could not be found.", false);
        }

        var ticket = JSON.parse(result);

        if (ticket.address != address) {
            return callback("Access forbidden from '" + address + "'.", false);
        }

        if (ticket.sessionId != sessionId) {
            return callback("Wrong session id.", false);
        }

        callback(null, true);

        handshakeData.user = ticket.user;
    });
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