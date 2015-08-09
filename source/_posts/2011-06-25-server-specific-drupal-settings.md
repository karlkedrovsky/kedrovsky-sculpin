---
title: Server Specific Drupal Settings
date: 2011-06-25
tags: drupal
---

For a while I've been thinking about the best way to keep the database settings out of the settings.php file in my Drupal sites. While this isn't a new problem (or solution) I wanted to make sure it would work on single site deployments, multi-site deployments and drush.
<!-- break -->

### Overview

The idea is to have a solution that allows the database connection parameters, password salts and anything else that may contain sensitive information to be kept in a file on the server, not in the settings.php file that's checked into a version control system. The solution has to work for both apache and drush and be usable on both the server and a developer's workstation. 

Since settings.php is just a PHP file the solution is as easy as using require_once() to include the settings. I use a simple naming convention of websitename.php for the file and the contents looks like this:

    <?php
    $db_host = 'localhost';
    $db_user = 'my_db_user_name';
    $db_pass = 'my_db_password';
    $db_name = 'my_db';
{: .language-php }

The file is then "required" in the settings.php file and the variables defined in the file above are used in place of the hard coded values. For a Drupal 7 site this looks like:

    require_once($_SERVER['DRUPAL_CONFIG'] . 'websitename.php');
    $databases = array (
      'default' => 
      array (
        'default' => 
        array (
          'database' => $db_name,
          'username' => $db_user,
          'password' => $db_pass,
          'host' => $db_host,
          'port' => '',
          'driver' => 'mysql',
          'prefix' => '',
        ),
      ),
    );
{: .language-php }

As you can see in the example above I'm using the $_SERVER['DRUPAL_CONFIG'] variable to specify the directory of the configuration file. This allows me to keep the configuration files wherever it's most convenient on the different deployment platforms.

### Apache

Setting the DRUPAL_CONFIG variable in apache is as easy as adding the following line to your apache config file (e.g. httpd.conf).

    SetEnv DRUPAL_CONFIG /path/to/drupal-config/

### Drush

In order for this to work under drush add the following to your ~/.drush/drushrc.php file.

    <?php
    $_SERVER['DRUPAL_CONFIG'] = '/path/to/drupal-config/';
{: .language-php }

### sites.php

I like to keep my settings.php file under the directory sites/prod-hostname instead of sites/default. Just helps me keep everything straight regardless if it's a single or multi site deployment. Since I use a different host name for local development and any shared development and staging servers I just create a sites/sites.php file that tells all of them to use the settings.php file under the sites/prod-hostname directory. Here's the file I use for this site.

    <?php
    $sites['kedrovsky'] = 'www.kedrovsky.com';
    $sites['kedrovsky.com'] = 'www.kedrovsky.com';
{: .language-php }

### Conclusion

I've used this on a couple of side projects (both Drupal 7) and it's working great. I haven't tried it with any server other than apache but I'm sure it would work just fine, all you would need to do is figure out how to set the DRUPAL_CONFIG variable in your server of choice.
