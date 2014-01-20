/**
 * User
 *
 * @param {string} username
 * @param {array} roles
 */
function User(username, roles)
{
    this.username = username;
    this.roles    = typeof(roles) != 'undefined' ? roles : [];
    this.socket   = null;
    this.x        = 0;
    this.y        = 0;
}

/**
 * Set user socket
 *
 * @param {object} socket
 */
User.prototype.setSocket = function(socket)
{
    if (this.socket == null) {
        this.socket = socket;
    }
};

/**
 * Set user position
 *
 * @param {int} x
 * @param {int} y
 */
User.prototype.setPosition = function(x, y)
{
    this.x = x;
    this.y = y;

    this.socket.broadcast.emit('user:move', {'username': this.username, 'x': this.x, 'y': this.y});
};

/**
 * Get a JSON serializable version of the user
 *
 * @return {object}
 */
User.prototype.serialize = function()
{
    return {
        'username': this.username,
        'roles': this.roles,
        'x': this.x,
        'y': this.y
    };
};

module.exports = User;