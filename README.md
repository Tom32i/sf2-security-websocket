Symfony 2 Security & Websockets
===============================

Requirements:
-------------

* PHP >= 5.3.3
* NodeJS >= 0.10.*

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
