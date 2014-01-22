/**
 * Client
 */
function Client()
{
    this.me    = null;
    this.users = {};
    this.list  = document.getElementById('user-list');

    this.socketConnection = io.connect(
        "http://" + window.location.hostname + "/",
        {
            port: 8000,
            transports: ["websocket"]
        }
    );

    this.attachEvents();

    this.list.style.height = window.innerHeight + 'px';
}

/**
 * Attach Websocket and window events
 */
Client.prototype.attachEvents = function()
{
    this.socketConnection.on("connect", this.onSocketConnected.bind(this));
    this.socketConnection.on("disconnect", this.onSocketDisconnected.bind(this));

    this.socketConnection.on("me:authenticated", this.onAuthenticated.bind(this));
    this.socketConnection.on("user:join", this.onUserJoin.bind(this));
    this.socketConnection.on("user:leave", this.onUserLeave.bind(this));
    this.socketConnection.on("user:move", this.onUserMove.bind(this));

    document.body.onmousemove = this.onMouseMove.bind(this);
};

/**
 * On socket connected
 */
Client.prototype.onSocketConnected = function ()
{
    console.log("Connected to socket server");

    this.me = new User();

    this.me.setSocket(this.socketConnection.socket);
};

/**
 * On socket disconnected
 */
Client.prototype.onSocketDisconnected = function()
{
    console.log("Disconnected from socket server.");

    this.me = null;
};

/**
 * On client authenticated
 *
 * @param {object} data
 */
Client.prototype.onAuthenticated = function(data)
{
    console.log("authenticated: %o", data);

    this.me.setUsername(data.username);
    this.me.setRoles(data.roles);

    this.addUser(this.me);
};

/**
 * On user join
 *
 * @param {object} data
 */
Client.prototype.onUserJoin = function(data)
{
    console.log("User join: %o", data);

    var user = new User(data.username, data.roles);

    this.addUser(user);
};

/**
 * On user leave
 *
 * @param {object} data
 */
Client.prototype.onUserLeave = function(data)
{
    console.log("User leave: %o", data);

    if (typeof this.users[data.username] != 'undefined') {
        var user = this.users[data.username];

        user.detach();

        delete this.users[data.username];
    }
};

/**
 * Add user to the list
 *
 * @param {User} user
 */
Client.prototype.addUser = function(user)
{
    this.users[user.username] = user;

    this.list.appendChild(user.getElement());
};

/**
 * On user move
 *
 * @param {object} data
 */
Client.prototype.onUserMove = function(data)
{
    //console.log("User leave: %o", data);

    if (typeof this.users[data.username] != 'undefined' && typeof(data.x) != 'undefined' && typeof(data.y) != 'undefined') {
        this.users[data.username].setPosition(data.x, data.y);
    }
};

/**
 * On mouse move
 *
 * @param {object} e
 */
Client.prototype.onMouseMove = function(e)
{
    this.me.setPosition(e.clientX, e.clientY);
    this.socketConnection.emit('user:move', {'x': this.me.x, 'y': this.me.y});
};