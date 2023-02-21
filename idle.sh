#!/bin/sh

keepAlive="$(date +%s)"
alive=true
lastMsg=""

echo "starting next server"
node server.js >> serverlogs.log &

while [ "$alive" = true]
do
    #print node server updates
    newestMsg=$(tail serverlogs.log -n 1)
    if [$newestMsg -ne  $lastMsg]
    then
        lastMsg=$newestMsg
        echo $newestMsg
    fi
    #use ss line count to check for open tcp connections
    connection=$(ss | wc -l)
    if [ connection -gt 1 ]
    then
        keepAlive=$(date +%s)
    fi
    #check idle state greater than 60 seconds
    now=$(date +%s)
    if[($(now) - $(keepAlive) -gt 60000)]
    then
        echo "Idle time limit exceeded, exiting"
        alive=false
    fi

echo
echo "shutting down"
echo





#https://oracle-base.com/articles/linux/linux-scripts-running-in-the-background
# Redirect to log file.
/home/my_user/scripts/my_script.sh >> /home/my_user/scripts/logs/my_script.log 2>&1 &
#tail -f /home/my_user/scripts/logs/my_script.log
#check background jobs 
# > jobs