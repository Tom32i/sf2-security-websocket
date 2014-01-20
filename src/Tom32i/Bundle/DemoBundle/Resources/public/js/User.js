/**
 * User
 *
 * @param {string} username
 * @param {object} roles
 */
function User(username, roles)
{
    this.username = username;
    this.roles    = typeof(roles) != 'undefined' ? roles : [];
    this.socket   = null;
    this.element  = null;
    this.x        = 0;
    this.y        = 0;
}

/**
 * Set socket
 *
 * @param {object} socket
 */
User.prototype.setSocket = function(socket)
{
    this.socket = socket;
};

/**
 * Set username
 *
 * @param {string} username
 */
User.prototype.setUsername = function(username)
{
    this.username = username;
};

/**
 * Set roles
 *
 * @param {object} roles
 */
User.prototype.setRoles = function(roles)
{
    this.roles = roles;
};

/**
 * Get Dom Element
 *
 * @return {DOMElement}
 */
User.prototype.getElement = function()
{
    if (this.element == null) {
        this.element = document.createElement('li');
        this.element.id        = 'user-' + this.username;
        this.element.innerHTML = this.username;
    }

    return this.element;
};

/**
 * Detach Dom Element
 */
User.prototype.detach = function()
{
    if (this.element) {
        this.element.parentNode.removeChild(this.element);
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

    this.updateElement();
};

/**
 * Update DOM Element position
 */
User.prototype.updateElement = function()
{
    this.element.style.left = this.x + 'px';
    this.element.style.top  = this.y + 'px';
};