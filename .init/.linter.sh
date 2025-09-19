#!/bin/bash
cd /home/kavia/workspace/code-generation/travel-photo-explorer-54981-55027/travel_photo_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

