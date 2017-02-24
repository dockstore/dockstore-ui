#!/bin/bash

set -o errexit -o nounset

if [ ! -z "$TRAVIS_TAG" ]
then
  echo "Building ngdocs.  $TRAVIS_TAG is a new tag"
else
  echo "This commit was made against the $TRAVIS_BRANCH and not a tag"
  exit 0
fi

rev=$(git rev-parse --short HEAD)
grunt ngdocs
cd docs
git init
git config user.name "garyluu"
git config user.email "garylau.work@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/ga4gh/dockstore-ui.git"
git fetch upstream
git reset upstream/gh-pages

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
