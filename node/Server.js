// Requirements
var io = require("socket.io")
    redis = require("redis");

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
};

/**
 * Authorization Handler
 *
 * @param {object} handshakeData
 * @param {Function} callback
 */
Server.prototype.authorizationHandler = function(handshakeData, callback)
{
    var error = null,
        authorized = true;

    console.log(handshakeData);

    callback(error, authorized);
};

module.exports = Server;