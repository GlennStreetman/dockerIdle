#!/bin/sh

iptables -A OUTPUT -p tcp --dport 3000
iptables -A INPUT -p tcp --dport 3000

warningSet=5 # warn every x seconds
incrementSet=5 #increment up x seconds on each warning
maxIdleSeconds=21
keepAlive="$(date +%s)";
now="$(date +%s)";
lastMsg=0;
tcpCount=0
IdleNextWarn=$warningSet #next warning fires off on
idleIncrement=0 #reset to zero, trails idleNextWarn by incrementSet

echo "starting next server";
node server.js >> ./serverlogs.log &
echo "logging to serverlogs.log"
while [ $(($now - $keepAlive)) -lt $maxIdleSeconds ]
do
    now="$(date +%s)";
    msgCount=$( wc -l ./serverlogs.log | awk '{ print $1 }' )
    #print msssages from http server
    if [ $lastMsg -ne $msgCount ]; then
        printCount="$(( $msgCount - $lastMsg ))"
        tail -$printCount ./serverlogs.log
        lastMsg=$msgCount
    fi
    #stepped warning messages
    if [ $(( $now - $keepAlive )) -gt $IdleNextWarn ] 
    then
        echo "Idle for: $IdleNextWarn"
        idleIncrement=$IdleNextWarn
        IdleNextWarn=$(( $IdleNextWarn + $incrementSet))
        
        connectionCount=$(iptables -n -L -v -x -w | grep 3000 |  awk '{sum+=$1} END  {print sum}')
        if [ $connectionCount -ne $tcpCount ]
        then
            echo "reset triggered"
            tcpCount=$connectionCount
            keepAlive=$(date +%s)
        fi
    fi
    # reset increment
    if [ $idleIncrement -gt $(( $now - $keepAlive )) ] 
    then
        echo "resetting queue"
        IdleNextWarn=$warningSet
        idleIncrement=0
    fi
    
done
lsof -ti tcp:3000 | xargs kill

echo '' > ./serverlogs.log &
echo
echo "Idle time limit exceeded, shutting down."
echo
