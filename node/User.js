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
 * Get a JSON serializable version of the user
 *
 * @return {object}
 */
User.prototype.serialize = function()
{
    return {
        'username': this.username,
        'roles': this.roles
    };
};

module.exports = User;