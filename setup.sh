#!/bin/bash

echo "🔧 Install nodejs and nodejs package manager..."
sudo apt update
sudo apt install nodejs npm -y

echo "🔧 Initialising analyser-web project..."

set -e

echo "📦 Installing dependencies..."
npm install

echo "🚀 Setup complete. You're ready to develop or run the full pipeline with ./run.sh"
