function Client(ticket)
{
    this.me    = null;
    this.users = {};
    this.list  = document.getElementById('user-list');

    this.socketConnection = io.connect(
        "http://" + window.location.hostname + "/",
        {
            port: 8000,
            transports: ["websocket"],
            query: 'ticket=' + encodeURIComponent(ticket)
        }
    );

    this.attachEvents();
}

Client.prototype.attachEvents = function()
{
    this.socketConnection.on("connect", this.onSocketConnected.bind(this));
    this.socketConnection.on("disconnect", this.onSocketDisconnected.bind(this));

    this.socketConnection.on("me:authenticated", this.onAuthenticated.bind(this));
    this.socketConnection.on("user:join", this.onUserJoin.bind(this));
    this.socketConnection.on("user:leave", this.onUserLeave.bind(this));
};

Client.prototype.onSocketConnected = function (e)
{
    console.log("Connected to socket server: ", e, this.socketConnection);
};

Client.prototype.onSocketDisconnected = function(e)
{
    console.log("Disconnected from socket server: %o", e);
};

Client.prototype.onAuthenticated = function(data)
{
    this.me = new User(data.username, data.roles);

    this.me.setSocket(this.socketConnection);

    this.addUser(this.me);
};

Client.prototype.onUserJoin = function(data)
{
    var user = new User(data.username, data.roles);

    this.addUser(user);
};

Client.prototype.onUserLeave = function(data)
{
    if (typeof this.users[data.username] != 'undefined') {
        var user = this.users[data.username];

        user.detach();

        delete this.users[data.username];
    }
};

Client.prototype.addUser = function(user)
{
    this.users[user.username] = user;

    this.list.appendChild(user.getElement());
};