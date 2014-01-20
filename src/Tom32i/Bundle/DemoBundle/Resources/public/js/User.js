function User(username, roles)
{
    this.username = username;
    this.roles    = typeof(roles) != 'undefined' ? roles : [];
    this.socket   = null;
    this.element  = null;
    this.x        = 0;
    this.y        = 0;
}

User.prototype.setSocket = function(socket)
{
    this.socket = socket;
};

User.prototype.setUsername = function(username)
{
    this.username = username;
};

User.prototype.setRoles = function(roles)
{
    this.roles = roles;
};

User.prototype.getElement = function()
{
    if (this.element == null) {
        this.element = document.createElement('li');
        this.element.id        = 'user-' + this.username;
        this.element.innerHTML = this.username;
    }

    return this.element;
};

User.prototype.detach = function()
{
    if (this.element) {
        this.element.parentNode.removeChild(this.element);
    }
};

User.prototype.setPosition = function(x, y)
{
    this.x = x;
    this.y = y;

    this.updateElement();
};

User.prototype.updateElement = function()
{
    this.element.style.left = this.x + 'px';
    this.element.style.top  = this.y + 'px';
};