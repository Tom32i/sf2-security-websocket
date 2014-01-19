function User(username, roles)
{
    this.username = username;
    this.roles    = typeof(roles) != 'undefined' ? roles : [];
    this.socket   = null;
    this.element  = null;
}

User.prototype.setSocket = function(socket)
{
    this.socket = socket;
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