#!/bin/bash

set -e

echo "Building project..."
npm run build

echo "Copying Logo.png to dist/..."
cp analyserWeb/Logo.png dist/analyserWeb/Logo.png

echo "Removing old docs folder..."
rm -rf docs

echo "Moving build output to docs..."
mv dist docs

echo "Adding docs to Git..."
git add docs

echo "Checking git status..."
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  echo "Committing changes..."
  git commit -m "deploy build to Github Pages"
fi

echo "Pushing to remote..."
git push

echo "Publish complete."
