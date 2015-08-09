---
title: Drupal Development On A Mac With Homebrew
date: 2012-04-10
tags: drupal
---

Hot on the heals of my efforts to set up a Linux VM for Drupal development (and a borked up Macports installation) I ran across [this article](http://blog.urbaninsight.com/2012/04/09/drupal-os-x-using-homebrew) describing how to set things up on a Mac for Drupal development. Since I had already gooned up my Macports installation I decided to give it a go. After removing Macports I just did the following.
<!-- break -->

* Ensure that the "Web Sharing" box is checked under the "Sharing" section in System Preferences. That enables the apache server.
* Install [Homebrew](http://mxcl.github.com/homebrew/) using the instructions on the website.
* Install git and mysql (no need to install apache or php, I'm using the versions that come with OSX).
        
        brew install git
        brew -v install mysql
{: .language-bash }
        
* Follow the instructions at the end of the mysql installation.
* Install Drush.
        
        sudo pear channel-discover pear.drush.org
        sudo pear install drush/drush
{: .language-bash }
        
* Edit /etc/apache2/httpd.conf and make sure the following lines are uncommented.
        
        LoadModule php5_module        libexec/apache2/libphp5.so
        Include /private/etc/apache2/extra/httpd-vhosts.conf
{: .language-bash }
        
* Add the following line after the Include line above. The directory used here can be anything you want and can include any file pattern you want to use. I like to keep mine simple so I put in in a directory under my home directory and just include every file. Just make sure all users have access to the directory as apache runs under a non-privileged (or whatever you want to call it) user. I had to open up the privileges on my home directory in order for this to work.
        
        Include /Users/kkedrovsky/vhosts/*
{: .language-bash }
        
* Edit /etc/apache2/extra/httpd-vhosts.conf and make sure the following line is uncommented.
        
        NameVirtualHost *:80
{: .language-bash }
        
* For each site I create a new virtual host file under /Users/kkedrovsky/vhosts that looks like this (assuming the site is called "foobar"). You'll need to adjust things like the email address and where you put the docroot of your site. 
        
        <VirtualHost *:80>
            ServerAdmin karl@kedrovsky.com
            ServerName foobar
            
            DocumentRoot /Users/kkedrovsky/workspace/foobar/htdocs
        
            AddType text/html html
            AddHandler server-parsed .html
        
            <Directory />
                Options FollowSymLinks
                AllowOverride All
            </Directory>
            <Directory /Users/kkedrovsky/workspace/foobar/htdocs>
                Options Indexes FollowSymLinks MultiViews Includes
                AllowOverride All
                Order allow,deny
                allow from all
            </Directory>
        
            ErrorLog /var/log/apache2/foobar-error.log
        
            # Possible values include: debug, info, notice, warn, error, crit,
            # alert, emerg.
            LogLevel warn
            
            CustomLog /var/log/apache2/foobar-access.log combined
            ServerSignature On
        
        </VirtualHost>
{: .language-bash }
        
* Add the following to /etc/hosts
        
        127.0.0.1    foobar
{: .language-bash }
        
* Restart apache.
        
        sudo apachectl restart
{: .language-bash }

That's all there is to it. The two downsides (from my perspective) of doing this instead of using a VM are the lack of email server capabilities and the fact that I'm developing in OSX and deploying on Linux. I'm also a bit more confortable using Linux since I've used it for so long. There are definitely upsides to this approach though, the biggest being that it's a LOT easier to set up.
