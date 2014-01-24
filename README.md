Symfony 2 Security & Websockets
===============================

Demo branches:
--------------

* default: No security
* secured: Security Ticket pattern implementation on a specific action
* request: Security Ticket pattern implementation on each request

Requirements:
-------------

* PHP >= 5.3.3
* NodeJS >= 0.10.*
* Redis >= 2.8.*

Installation:
-------------

Install Symfony2 and its vendors:

    php composer.phar isntall

Install NodeJS modules:

    npm install

Sample Apache VHost configuration:
----------------------------------

    <VirtualHost *:80>
        ServerName websocket.symfony2.local

        DocumentRoot ~/Sites/sf2-security-websocket/web

        <Location /socket.io/>
            ProxyPass http://127.0.0.1:8000/socket.io/
            ProxyPassReverse http://127.0.0.1:8000/socket.io/
        </Location>

        <Directory ~/Sites/sf2-security-websocket/web>
                Options Indexes FollowSymLinks MultiViews
                AllowOverride All
                Order Allow,Deny
                Allow from all
        </Directory>
    </VirtualHost>

Launching the Demo Server:
--------------------------

    redis-server

    node node/launch.js

    php app/console assets:install
