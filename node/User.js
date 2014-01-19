function User(username, roles)
{
    this.username = username;
    this.roles    = typeof(roles) != 'undefined' ? roles : [];
    this.socket   = null;
}

User.prototype.setSocket = function(socket)
{
    if (this.socket == null) {
        this.socket = socket;
    }
};

User.prototype.serialize = function()
{
    return {
        'username': this.username,
        'roles': this.roles
    };
};

module.exports = User;