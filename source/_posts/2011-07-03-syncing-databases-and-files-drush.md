---
title: Syncing Databases and Files With Drush
date: 2011-07-03
tags: drupal
---

One of the most common tasks I have to do when working on [Drupal](http://drupal.org "Drupal") sites at work is setting up a local instance of a site on my laptop and then syncing the database and contents of the "files" directory from the development or stage environment to that local environment. In the past I've used a combination of ssh, mysql and rsync but lately I've been using [drush](http://drupal.org/project/drush "Drush") to make it even easier.
<!-- break -->

### Setup
Download and install [drush](http://drupal.org/project/drush "Drush") and take a look at the documentation on the [drush.ws](http://drush.ws) website to get an overview.

Since the remote operations that drush performs are done via ssh setting up public/private key authentication is highly recommended. It's been a while since I've had to do this but [this page](http://library.linode.com/security/ssh-keys) seems to do a pretty good job at explaining the process. For more information Google is your friend.

### Drush Settings

At the office we have a development and staging server (at least) that we use for each client site we work on, for the sake of this post I'll call those servers karlsofficedev.com and karlsofficestage.com. We then set up a virtual host on both servers for each client site. For example, if the production site is www.myclient.com the dev and stage servers would be www.myclient.karlsofficedev.com and www.myclient.karlsofficestage.com.

Given all of this, I set up drush aliases for @myclient.local, @myclient.dev and @myclient.stage so I can sync the database and files from either dev or stage to my laptop. If I were working on the www.myclient.com site I would create the file ~/.drush/myclient.aliases.drushrc.php that contained the following.

    <?php
    $aliases['local'] = array(
      'uri' => 'myclient',
      'root' => '/Users/kkedrovsky/workspace/myclient/htdocs',
      'path-aliases' => array(
        '%files' => 'sites/default/files',
      ),
    );
    $aliases['dev'] = array(
      'uri' => 'myclient.karlsofficedev.com',
      'root' => '/var/www/www.myclient.com/htdocs',
      'dump-dir' => '/home/kkedrovsky/drush-dump',
      'remote-host' => 'myclient.karlsofficedev.com',
      'remote-user' => 'kkedrovsky',
      'path-aliases' => array(
        '%files' => 'sites/default/files',
      ),
    );
    $aliases['stage'] = array(
      'uri' => 'myclient.karlsofficestage.com',
      'root' => '/var/www//www.myclient.com/htdocs',
      'dump-dir' => '/home/kkedrovsky/drush-dump',
      'remote-host' => 'myclient.karlsofficestage.com',
      'remote-user' => 'kkedrovsky',
      'path-aliases' => array(
        '%files' => 'sites/default/files',
      ),
    );
{: .language-php }

My ~/.drush/drushrc.php file looks like this.

    <?php
    if (is_dir('/Users/kkedrovsky')) {
      $_SERVER['DRUPAL_CONFIG'] = '/Users/kkedrovsky/drupal-config/';
      $options['dump-dir'] = '/Users/kkedrovsky/drush-dump';
    } elseif (is_dir('/home/karl')) {
      $_SERVER['DRUPAL_CONFIG'] = '/home/karl/drupal-config/';
      $options['dump-dir'] = '/home/karl/drush-dump';
    }
{: .language-php }

This sets up the local config files for database settings, etc. (see my [previous post](/blog/server-specific-drupal-settings)) and sets the local directory that drush will use to hold the database dump files. The directory for the remote servers are specified in each site's aliases file. These directories have to exist before you run drush so make sure they're created locally and on each remote server.

### Setting Up a Local Instance

There are a lot of instances where I need to set up a local instance of a client site that's a copy of either the dev or stage site. To do this I simply do the following:

1. Create an empty mysql database.
1. Create an entry in my local hosts file for the local instance (e.g. 127.0.0.1  myclient).
1. Set up a vhost entry in my local apache config.
1. Create a new drush aliases file for the site (e.g. ~/.drush/myclient.aliases.drushrc.php).
1. Check out the site files from the version control system.
1. Update the database connection information.
1. Use drush to initialize then sync the dev or stage site to my local instance.

The last step may take a bit of explanation. The "drush sql-sync" command assumes that you have a working local Drupal instance. Since all we have before this last step is an empty database the sql-sync won't work. Drush makes it easy to create an install with the "drush site-install" command: 

    drush @myclient.local site-install
{: .language-bash }

Now we can sync the remote database and files directory to the local instance and get to work.

    drush sql-sync @myclient.dev @myclient.local
    drush rsync @myclient.dev:%files @myclient.local:%files
{: .language-bash }

### Conclusion

Now that everything is set up I can manage and inspect both my local and the remote environments as well as sync the database and user uploaded files between environments with simple, one line drush commands. 
