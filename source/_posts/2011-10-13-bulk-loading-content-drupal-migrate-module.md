---
title: Bulk Loading Content With The Drupal Migrate Module
date: 2011-10-13
tags: drupal
---

For a lot of new site builds the folks creating or gathering the content need to do so before the system is ready for users to start creating the content directly on the site. One common way to do this is to create a document (e.g. Word doc, spreadsheet) to hold all of the content then have some poor slob copy and paste it into the site when it's ready. As I was already looking for an excuse to work with the [migrate module](http://drupal.org/project/migrate) anyway I thought I'd use this scenario as an excuse to see how easy it is to bulk load content from a spreadsheet (csv file).
<!-- break -->

In order to keep things tidy I decided to keep each different content type in a different csv file, which as it turns out matches up pretty nicely with the way the migrate module examples and documentation are written.

Everything that I describe below can be found in the migrate module's documentation and examples. I'm documenting the simple case that I used here just so I can remember what I did and maybe help someone get started with migrate. I make no claim at all to any original content...

## Setup
First, make sure you've enabled the Migrate and Migrate UI modules.

To create a new migration you create a custom module, for this example we'll just call it "foo" (creative naming is not my strong suit). 

Create a directory sites/all/modules/foo.

Inside that directory create a file named foo.info that contains

    name = "Migrate Foo"
    description = "Imports foo data."
    package = "Development"
    core = 7.x
    dependencies[] = migrate

    files[] = page.inc
{: .language-php }

and a file named foo.module that contains

    <?php
    
    /*
     * Impmentation of hook_migrate_api()
     */
    function foo_migrate_api() {
      $api = array(
        'api' => 2,
        'migrations' => array(
          'Page' => array('class_name' => 'PageMigration')
        ),
      );
      return $api;
    }
{: .language-php }

In the foo.info file the files[] array contains a list of include files, one file per content type (in this simple example I'm only importing Pages). How you break up the files is completely up to you but from the simple tests I've run the migration code can get complicated and confusing pretty quickly if it's all kept in a single file. 

The page.inc file looks like this.

    <?php
    
    class PageMigration extends Migration {
      public function __construct() {
        parent::__construct();
    
        //The defintion of the collumns. Keys are integers. values are array(field name, description).
        $columns = array(
          0 => array('id_csv', 'Id'),
          1 => array('title_csv', 'Title'),
          2 => array('body_csv', 'Body'),
        );
    
        //The Description of the import. This desription is shown on the Migrate GUI
        $this->description = t('Import of page content.');
    
        //The Source of the import
        $this->source = new MigrateSourceCSV(DRUPAL_ROOT . '/../data/page.csv', $columns, array('delimiter' => ',', 'header_rows' => 1));
    
        //The destination CCK (boundle)
        $this->destination = new MigrateDestinationNode('page');
    
        //Source and destination relation for rollbacks
        $this->map = new MigrateSQLMap(
          $this->machineName,
          array(
            'id_csv' => array(
              'type' => 'int',
              'unsigned' => TRUE,
              'not null' => TRUE,
              'alias' => 'import'
            )
          ),
          MigrateDestinationNode::getKeySchema()
        );
    
        //Field ampping
        $this->addFieldMapping('title', 'title_csv');
        $this->addFieldMapping('body', 'body_csv');
      }
    }
{: .language-php }

## Importing Content
Enable you new Migrate Foo module and navigate to "Content -> Migrate to make sure the new migration is available.

Create a page.csv file that looks something like this. The directory this file is stored in is specified in the MigrateSource constructor above, in this example it goes in a directory named "data" that's at the same level as the Drupal root in the file system.

    "Id","Title","Body"
    1,"Test Title One","Content for the first hunk of test content"
    2,"Test Title Two","Content for the second hunk of test content"
{: .language-php }

The first field is a unique identifier used by the migrate module to keep track of what content was previously imported and allows it to roll back changes as well as update content items already imported. 

**Note** - Any time you update your module(s) make sure you clear the Drupal cache so it picks up your new migrations. 

To run your new migration you can do it from the admin page in the site (admin/content/migrate) or by using [Drush](http://drupal.org/project/drush). I prefer using Drush myself, it makes things go a lot faster as I'm updating things in the module code. Here are some examples to get you going.

Get help on all the migrate commands.

    drush help --filter=migrate
{: .language-bash }

Run the Page migration import.

    drush mi Page
{: .language-bash }

Roll back the Page migration import.

    drush mr Page
{: .language-bash }

Get the status of all your migrations.

    drush ms
{: .language-bash }

## Conclusion
Once you get all this set up and running it's very easy to use migrate to bulk load content. Where it gets even more attractive is when you need to start applying some data scrubbing logic, add default field values, etc. as adding this kind of thing to your migrate classes is dead simple. 
