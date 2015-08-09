---
title: Clojure, Emacs, nREPL and Leiningen
date: 2012-08-19
tags: clojure, emacs
---

**UPDATE:** - I had a couple of mistakes in the original post below and a thing or two has changed since I wrote it. I've updated the post to hopefully clear those things up.

I've just started learning Clojure and for whatever reason I've had a hard time finding the "right" way of just setting up an environment to play with the language and try things out. I think a lot of my problems stem from the fact that clojure is still very new and the speed at which things change is pretty high. Googling for solutions to my problem leads to all sorts of solutions but trying to figure out which approach is the latest/greatest/best is all but impossible. Below is the solution that I've found that works great for me (at least for now).
<!-- break -->

### Overview
When I first (naively) approached clojure the first thing I did was create a directory with a file test.clj, stuck some clojure code in it and then tried to figure out how to run the "clojure interpreter" to execute my shiny new code. That was not a good idea. Clojure runs in the JVM and while there is a way to run a command that will read your clojure source file and run it (or to [run a REPL](http://clojure.org/getting_started)) that's not the way it's typically done and it becomes a real pain as soon as you get past the simplest things. In a nutshell, here's what you do instead:

* Create a new clojure project. We'll use leiningen to set up and manage the project which will take care of a lot of the details. This was my first stumbling block when I first started looking at clojure - I thought it would be easier just to just create a file with clojure code and then figure out how to run it (kinda like ruby or python). That is *not* the case, it's a ton easier to just use leiningen.
* Fire up a JVM that's running clojure and provides a REPL (Read Eval Print Loop). If you've never used a REPL, it's the bee's knees. It allows you to interact with a running clojure environment which for the purposes of this post you can think of as the thing that replaces the "clojure interpreter" that I was looking for initially.
* Connect your coding environment (in this case emacs) to the running JVM/REPL so you can send it clojure code to evaluate.

### Clojure

**Update Note:** In the original post I had instructions here for installing clojure. As Arthur points out in the comments below you don't need to do this and furthermore it can cause problems if you do. 

### Leiningen

I'm using leiningen 2 so I did the install manually as installing using my different package managers got me the old version. Since the leiningen command is just a bash script it's as easy as the following.

    cd ~/bin
    wget https://raw.github.com/technomancy/leiningen/preview/bin/lein
    chmod 755 lein
{: .language-bash }

You can put it in any directory that's on your PATH, I just happen to like to stuff it in the bin directory of my home directory.

Now we're finally ready to try something. To create a project and test it by creating a REPL do:

    cd ~/workspace # or wherever you like to put projects
    lein new testclj
    cd testclj
    lein repl
{: .language-bash }

This will create a project structure, download all the dependencies, start the JVM and leave you at the REPL prompt where you can try some simple clojure commands but like I said earlier it doesn't work all that well, what we really want is to be able to start and interact with the REPL from emacs. To do that just exit out of the REPL you started above and move on to the next section.

### nREPL and Emacs

The first thing you'll want to do is add the clojure-mode and nrepl emacs packages, I'm using emacs24 and the package manager to get both. You can just look at my emacs [init.el](https://github.com/karlkedrovsky/config/blob/master/emacs.d/init.el) file to see how I do this, the important part is below.


    (require 'package)
    (add-to-list 'package-archives
    	     '("marmalade" . "http://marmalade-repo.org/packages/"))
    (package-initialize)
    (when (not package-archive-contents)
      (package-refresh-contents))
    (defvar my-packages '(clojure-mode
    		       nrepl))
    (dolist (p my-packages)
      (when (not (package-installed-p p))
        (package-install p)))
{: .language-bash }

What this does is check the package archives (including marmalade) for all the packages in "my-packages" and installs them if they aren't there when I start emacs.

**Update Note:** In the original post I had instructions at this point for adding org.clojure/tools.nrepl to the project.clj file. That doesn't appear to be necessary to get nrepl running in emacs for the project and honestly I'm not sure it ever was.

Now run

    M-x nrepl-jack-in
{: .language-bash }

That will start a new JVM and REPL, connect emacs to it and open a new emacs buffer/window (named \*nrepl\*) with the REPL in it. To try it out edit the ~/workspace/testclj/src/testclj/core.clj, which should look something like this.

    (ns testclj.core)

    (defn foo
      "I don't do a whole lot."
      [x]
      (println x "Hello, World!"))
{: .language-bash }

Put your cursor at the end of the new function "foo" and do

    C-x C-e
{: .language-bash }

That will send the function definition to the REPL and evaluate it. To see it in action just move your focus to the REPL window and run

    (foo "bar")
{: .language-bash }

You should see something like this:

    ; nREPL 0.1.4-preview
    user> (foo "bar")
    bar Hello, World!
    nil
    user> 
{: .language-bash }

At this point you're ready to go and have an environment that's very efficient and effective at running clojure code. There are other ways to accomplish much the same way, such as using [swank](https://github.com/technomancy/swank-clojure) in emacs to connect to a running REPL but this is a bit simpler and seems to work great for me. 

## Links

Here are a few links that can give you more details about all of the above.

[Clojure](http://clojure.org/)  
[Leiningen](https://github.com/technomancy/leiningen)  
[nrepl.el](https://github.com/clojure/tools.nrepl)  

Hopefully this helps a couple of folks and let me know if you run into any problems with it or know of A Better Way.
