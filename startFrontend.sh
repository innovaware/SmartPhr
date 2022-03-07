#!/bin/bash

echo "Start Backend"
export REDISHOST=vps-d76f9e1c.vps.ovh.net
gnome-terminal --tab #-e 'nodemon /data/SmartPhr/backend/main.js'

echo "Start Frontend"
cd /data/SmartPhr/frontend/smartiphr
ng serve -o
