#!/bin/bash

# Build the project
npm run build

# Transfer the 'dist' directory to the web server
rsync -avz --delete --progress dist/ mdnotes.no:/var/www/hootify-frontend/
