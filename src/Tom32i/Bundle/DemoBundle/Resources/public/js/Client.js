function Client()
{
    console.log(Object.keys(io));
    console.log(io);

    console.log("http://" + window.location.hostname + "/");

    this.socketConnection = io.connect(
        "http://" + window.location.hostname + "/",
        {
            port: 8000,
            transports: ["websocket"]
        }
    );

    this.socketConnection.on("connect", this.onSocketConnected.bind(this));
    this.socketConnection.on("disconnect", this.onSocketDisconnected.bind(this));
}

Client.prototype.onSocketConnected = function ()
{
    console.log("Connected to socket server: ", this.socketConnection);
};

Client.prototype.onSocketDisconnected = function(e)
{
    console.log("Disconnected from socket server: %o", e);
};