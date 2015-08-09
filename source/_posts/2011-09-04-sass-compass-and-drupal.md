---
title: Sass, Compass and Drupal
date: 2011-09-04
tags: drupal
---

[Sass](http://sass-lang.com) is, according to it's website, "an extension of CSS3, adding nested rules, variables, mixins, selector inheritance, and more". It allows developers to better structure their CSS making easier to maintain. [Compass](http://www.compass-style.org) is a framework that's built on top of Sass that provides additional functionality. The [Sass Drupal module](http://drupal.org/project/sass) makes it easy to integrate these two frameworks into your Drupal theme.
<!-- break -->

###Installation
You'll need the PHamlP PHP library that the Drupal module uses so first download PHamlP_3.2.zip from http://code.google.com/p/phamlp/downloads/list. Assuming your modules are installed in sites/all/modules just do the following (I started at the docroot of the site).

    drush dl sass
    cd sites/all/modules/sass
    mkdir phamlp
    cd phamlp
    unzip /path/to/PHamlP_3.2.zip
{: .language-bash }

The Sass module's project page says that it's better to use the [PHamlP code from GitHub](https://github.com/codeincarnate/phamlp), which is what I ended up doing. I just cloned the repository and copied the files and directories that were included int he PHamlP_3.2.zip file from the Git repository to sites/all/modules/sass/phamlp. If you're using Git as your version control system you could use a Git submodule which would make it easier to keep up to date with the latest version of the PHamlP code.

At this point you should go to the Drupal modules page and enable the Sass module. After the module is enabled you can find the configuration page under Configuration -> SASS/SCSS. By default the settings are appropriate for development but you'll need to change them when you deploy to production so the module doesn't check for changes on every page request.

###Usage

List the css files in your theme's .info files as you normally would, create these files and make them writable by the web server. Since the work I do that modifies any theme files is always local I just do something like the following.

In mytheme.info:

    stylesheets[all][] = css/style.css
{: .language-bash }

Then on the command line (from within my theme directory):

    touch css/style.css
    chmod 777 css/style.css
{: .language-bash }

Now just create a new file (or files) named the same as your css file with ".scss" appended. In the example above this would be "css/style.css.scss". Now all you have to do is make all your changes and additions to the scss file and a new css file will be generated each time a page is loaded and the scss file has been changed. 

###Final Thoughts

I prefer not to keep any generated files in version control so I don't typically check these files in, and I add them to my .gitignore file so they won't be picked up automatically. However, this means that in order for the css files to be regenerated when new code is deployed the css files would have to be writable by the web server and the module would have to be enabled in all of your deployment environments. I'm sure there are other options as well, such as having a command line tool generate the css on deployment. In my opinion any of these approach is acceptable in this case and whether or not you check in the generated css files would depend more on your own personal workflow, deployment procedures and/or team structure. 

For production deployments this is one of the modules I would simply disable. There is a configuration option that allows you to disable the functionality but one of the steps in my deployment checklist is to disable unnecessary modules (e.g. devel) so I add this one to the list.
