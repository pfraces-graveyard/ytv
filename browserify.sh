#!/bin/bash
browserify viewmodels/player.js | uglifyjs -o public/javascripts/player.js
browserify viewmodels/search.js | uglifyjs -o public/javascripts/search.js
browserify viewmodels/detail.js | uglifyjs -o public/javascripts/detail.js
