#!/bin/bash

# Snarfed from https://github.com/sculpin/sculpin-blog-skeleton/blob/master/publish.sh

rm -rf output_prod

sculpin generate --env=prod
if [ $? -ne 0 ]; then echo "Could not generate the site"; exit 1; fi

rsync -avz --delete output_prod/ www.kedrovsky.com:/var/www/kedrovsky-sculpin
if [ $? -ne 0 ]; then echo "Could not publish the site"; exit 1; fi
