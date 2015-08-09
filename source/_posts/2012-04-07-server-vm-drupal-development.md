---
title: A Server VM For Drupal Development
date: 2012-04-07
tags: drupal
---

For some time now I've wanted to have a way for to do Drupal development locally without all the platform specific issues (especially on Windows) that constantly plague folks just starting Drupal development. I've been thinking that setting up a VM using VirtualBox might be a good solution so I gave it a try.
<!-- break -->

### Goals

*  Runs a standard LAMP stack (Apache, PHP and MySQL)
*  Files can be edited from the host so folks can use their favorite editor or IDE.
*  Set up with a dynamic ip for internet access from the guest (for updates, etc.) and static host only interface so the server can be accessed by a browser running on the host.

### High Level Steps

* Install VirtualBox.
* Install Ubuntu Server with two network interfaces (one NAT with DHCP and one Host Only with a static IP).
* Configure the network connections.
* Install and configure shared folders to access files on the host system.
* Configure the mail server to use gmail to send mail.

### Installing and Configuring VirtualBox

I'm assuming you can install VirtualBox and can run through the basic set up of a new VM. The only thing "odd" with the VMs we'll set up here is the network interface.

* In the VirtualBox Preferences screen choose "Network", there should be a network labeled "vboxnet0". Highlight the network, click the "edit" icon and make note of the IP address. We'll use that when we configure the second network interface in the VM.
* After you've set up the new VM (I just take the defaults with the exception of memory which I set to at lease 512MB and hard disk space which I set to 20GB) go to the Network section.
* The first adapter should be set to NAT. This is the adapter that will be used to access the internet.
* Under "Adapter 2" check the "Enable Network Adapter" box, set the "Attached to" to "Host-only Adapter" and name to "vboxnet0". This will allow us to assign a static IP address to the VM that will only be accessible from the host machine.
* Boot the new VM.

### Installing Ubuntu

I used Ubuntu 12.04 and everything from here on assumes that you did too. 

* When asked how to partition disks choose "Guided - use entire disk".
* During the install check the "OpenSSH server", "LAMP server" and "Mail server" software packages. When asked what kind of mail server to configure select "Local only", we'll configure the server to forward to gmail in a future step.
* After everything is set up run "sudo apt-get update" and "sudo apt-get dist-upgrade" to make sure everything is up to date and reboot of the kernel was upgraded.

### Installing The Software Stack

* Install the VirtualBox guest additions with "sudo apt-get install virtualbox-guest-utils". 
* Run the following to install the dependencies for Drush.

        sudo apt-get install php-pear
        sudo pear install Console_Table
{: .language-bash }

* Install Drush.

        pear channel-discover pear.drush.org
        pear install drush/drush
{: .language-bash }

* I also use a view other tools for development. Your toolset may vary but here's what I use to install mine

        sudo apt-get install git subversion zsh
{: .language-bash }

* Install the VirtualBox guest additions.

        sudo apt-get install virtualbox-guest-utils
{: .language-bash }

* Don't forget to update your php.ini files to set the proper memory limits, file upload sizes, etc.

### Setting Up The Host Only Network Interface

* Edit /etc/network/interfaces and add the following to the end. The address may be different but the below should work. The IP address of my host-only adapter gathered from the VirtualBox preferences screen above was 192.168.56.1. If yours is different you'll need to adjust accordingly, just change the last octet of the IP address of your adapter to be something other than 1 when you assign the address below.
        
        auto eth1
        iface eth1 inet static
        address 192.168.56.2
        netmask 255.255.255.0
{: .language-bash }
    
* Bring up the new interface with "sudo ifup eth1". You should now be able to go to a browser on the host machine and browse to 192.168.56.2 and see the default Apache page.

### Setting Up Host File System Access

* In the VirtualBox Manager click "Shared Folders" under the virtual machine.
* Click the add icon, select the folder you want to share, give it a name (e.g. hostdir) and select "Make Permanent".
* In the virtual machine create a directory to use as a mount point (e.g. "sudo mkdir /mnt/hostdir;chmod 777 /mnt/hostdir") and mount it with the following command "sudo mount -t vboxfs -o uid=1000,gid=1000 hostdir /mnt/hostdir". This assumes your uid and gid are 1000 (which they are for the user created during the OS install) and allows your normal user full access to the files under the host directory mounted in the VM.
* To mount the directory at boot time add the following to /etc/fstab
        
        hostdir /mnt/hostdir vboxfs uid=1000,gid=1000 0 0
{: .language-bash }

### Configure The Mail Server

The following come from http://www.lucidlynx.com/how-to-install-postfix-to-relay-mail-through-gmail-in-ubuntu. I use Google Apps so my gmail address is karl@kedrovsky.com, just use your Google Apps or Gmail address in place of that one below. Configuring this bit can be pretty tricky, google is your friend...

* Run the following to create the files needed.
        
        sudo touch /etc/postfix/generic
        sudo touch /etc/postfix/generic.db
        sudo touch /etc/postfix/sasl/passwd
        sudo touch /etc/postfix/sasl/passwd.db
{: .language-bash }

2. Modify /etc/postfix/main.cf. 

    Update the relay_host line so that it looks like this:
        
        relayhost = [smtp.gmail.com]:587
{: .language-bash }

    Comment out the following lines:

        mailbox_command = procmail -a "$EXTENSION"
        default_transport = error
        relay_transport = error
{: .language-bash }

    Add the following to the end of the file:
        
        smtp_tls_loglevel = 1
        smtp_tls_security_level = encrypt
        smtp_sasl_auth_enable = yes
        smtp_sasl_password_maps = hash:/etc/postfix/sasl/passwd
        smtp_sasl_security_options = noanonymous
        smtp_generic_maps = hash:/etc/postfix/generic
{: .language-bash }

    For reference, my entire main.cf looks like this:
        
        # See /usr/share/postfix/main.cf.dist for a commented, more complete version
        
        # Debian specific:  Specifying a file name will cause the first
        # line of that file to be used as the name.  The Debian default
        # is /etc/mailname.
        #myorigin = /etc/mailname

        smtpd_banner = $myhostname ESMTP $mail_name (Ubuntu)
        biff = no
        
        # appending .domain is the MUA's job.
        append_dot_mydomain = no
        
        # Uncomment the next line to generate "delayed mail" warnings
        #delay_warning_time = 4h
        
        readme_directory = no
        
        # TLS parameters
        smtpd_tls_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
        smtpd_tls_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
        smtpd_use_tls=yes
        smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
        smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache
        
        # See /usr/share/doc/postfix/TLS_README.gz in the postfix-doc package for
        # information on enabling SSL in the smtp client.
        
        myhostname = drupal
        alias_maps = hash:/etc/aliases
        alias_database = hash:/etc/aliases
        mydestination = drupal, localhost.localdomain, localhost
        relayhost = [smtp.gmail.com]:587
        mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128
        # mailbox_command = procmail -a "$EXTENSION"
        mailbox_size_limit = 0
        recipient_delimiter = +
        inet_interfaces = loopback-only
        inet_protocols = all
        # default_transport = error
        # relay_transport = error
        
        smtp_tls_loglevel = 1
        smtp_tls_security_level = encrypt
        smtp_sasl_auth_enable = yes
        smtp_sasl_password_maps = hash:/etc/postfix/sasl/passwd
        smtp_sasl_security_options = noanonymous
        smtp_generic_maps = hash:/etc/postfix/generic
{: .language-bash }

* Update the /etc/postfix/generic so that it looks something like this, just add a pair of lines for each local user that will need to send mail. You'll need to substitute the host name of your VM for "drupal" and your gmail account for "karl@kedrovsky.com".

        karl@localhost karl@kedrovsky.com
        karl@drupal karl@kedrovsky.com
        root@localhost karl@kedrovsky.com
        root@drupal karl@kedrovsky.com
{: .language-bash }

* Create the generic.db file by running.
        
        cd /etc/postfix
        sudo postmap generic
{: .language-bash }

* Update the /etc/postfix/sasl/passwd file so that it looks like this.
        
        [smtp.gmail.com]:587 karl@kedrovsky.com:your_gmail_password
{: .language-bash }

* Generate the passwd.db file by running.
        
        cd /etc/postfix/sasl
        sudo postmap passwd
        sudo chown root:root passwd passwd.db
        sudo chmod 600 passwd passwd.db
{: .language-bash }

* Restart postfix.
        
        sudo /etc/init.d/postfix restart
{: .language-bash }

* Test

        echo 'test email' | mail -s 'this is a test' karl@kedrovsky.com
        sudo sendmail -bv karl
        sudo sendmail -bv karl@kedrovsky.com
{: .language-bash }

* Check your junk mail filter, there's a good chance that the test mail message will end up there.

After all that you'll have a server that's all set up for Drupal development. Exactly how you go about using it is up to you but I'll describe how I do thing in my next blog post.
