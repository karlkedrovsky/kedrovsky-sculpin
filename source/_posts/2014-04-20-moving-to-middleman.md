---
title: Moving To Middleman
date: 2014-04-20
---

Over the last few years my long-neglected blog has been running on
[Drupal](http://drupal.org). That was mostly due to the fact that I
use Drupal in my day job (and most side projects) and when I needed a
way to stand up a simple site it was the path of least
resistance. Other than that and the ability to easily enable comments
(more on that later) there was no real reason why I needed a CMS, the
site is pretty much just static content.
<!-- break -->

## Why Move?

Drupal is a great CMS platform but it also requires a bit of care and
feeding (e.g. security updates) and takes more resources to run than a
static site. That's not a huge deal but the simplicity of creating and
deploying a static site turned out to be a bigger deal (at least in my
mind) than I thought. Also, being able to create posts as simple
markdown files in my
[favorite editor](http://www.gnu.org/software/emacs/) instead of using
a web-based admin is a **ton** better for a developer, or anyone else
that lives in their editor all day long.

I also like to use my personal site as a sandbox for technologies I'm
interested in at the moment and right now those have skewed toward the
front-end technologies in web development. I've been looking for ways
to use some of the newer features in [Sass](http://sass-lang.com/) and
[Susy](http://susy.oddbird.net/) and while I've only been able to do
that a small amount on this site but at least I have a sandbox that's
a "real" site where I can try things out. Sure you can do things like
this on a Drupal site but it's a lot easier without all the trappings
of a CMS getting in the way.

## Why Middleman?

Another one of those technologies that I've been hankering to use more
is a static site generator. While the idea isn't new (I remember using
[blosxom](http://blosxom.sourceforge.net/) back in the day) they have
gotten a lot of mind share recently and there is a lot of work going
into them right now.

Having a [ton of options](http://staticsitegenerators.net/) to pick
from I settled on two: [Middleman](http://middlemanapp.com/) and
[Assemble](http://assemble.io/). I was looking for something that was
well supported, had plenty of online resources and was more of a
general purpose static site generator as opposed to a blogging engine,
etc. In the end I picked Middleman, it had good documentation, plenty
of tutorials and help online, and had ready-made solutions for
blogging and deployment that worked great out of the box. It also used
Compass and Sass which fit my need to have a platform to fiddle with
the latest Sass and Susy bits. Assemble looks like a really cool
project but it was a bit more "build it yourself" than I wanted and
the wild west that is the node ecosphere right now (Assemble is a
javascript project) was more hassle than I wanted to deal with. I
really like Ruby (which is what Middleman uses) as a language and I'm
already comfortable with it's ecosystem so that helped make it a good
fit too.

The only bump in the Middleman road was getting everything to work
with the latest version of Sass. It turned out to not be all that big
of a deal but using the latest versions of Sass and Susy means you
have to use a pre-release version of Compass with Middleman. Again,
it's not a big deal but if you want to go this route yourself just be
prepared for a bit of wonkiness until Compass 1.0 is out and Middleman
is updated to use it. If you want to see how I've set it all up just
take a look at the
[Github repo](https://github.com/karlkedrovsky/kedrovsky-middleman)
that houses the source code for this site.

## What About Those Comments?

Having comments on my blog taught me a few things. On the upside, they
are a good way to get valuable feedback from folks but on the downside
it's a pain to manage all the spam (even with spam filtering) and I
found that for some reason I just don't respond to comments like I
should. I have no idea why comments don't grab my attention like email
or twitter but for some reason they just don't. I had to disable
comments on the Drupal version of the site a while back due to all the
problems with spam and I've decided to just leave them off this new
version for now. I may add them back later, and I'm hoping to add the
archived comments to old blog posts, but for now I'm sticking to email
and twitter for feedback.
