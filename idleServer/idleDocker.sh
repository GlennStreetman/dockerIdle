#!/bin/sh

#setup
port=3000 # HTTP server localhost post
incrementSet=10 #Warning/idle check timer.
maxIdleSeconds=31 #Set 1 second higher than multiple of incrementSet.
nodeServer=server.js

#Global scripts vars
keepAlive="$(date +%s)";
now="$(date +%s)";
lastMsg=0;
tcpCount=0
IdleNextWarn=$incrementSet #next warning fires off on
idleIncrement=0 #reset to zero, trails idleNextWarn by incrementSet
requestCount=0 #count of inbound requests. New inbound requests reset idle timer.

# iptables -A OUTPUT -p tcp --dport $port
# iptables -A INPUT -p tcp --dport $port
# iptables -A INPUT -p tcp --dport 3000 --syn -j LOG --log-level 4 --log-prefix "HTTPS SYN: "


# aws lambda invoke \ 
#     --function-name updateDNS \
#     response.json

echo "starting next server";
> ./serverlogs.log #emptpy logs for run. Remove this line if script runs in container.
node $nodeServer >> ./serverlogs.log & # start node server
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
        
        connectionCount=$( wc -l ./access.log | awk '{ print $1 }' )
        # connectionCount=$(iptables -n -L -v -x -w | grep 3000 |  awk '{sum+=$1} END  {print sum}')
        if [ $connectionCount -ne $tcpCount ]
        then
            # echo "reset triggered"
            tcpCount=$connectionCount
            keepAlive=$(date +%s)
        fi
    fi
    reset increment
    if [ $idleIncrement -gt $(( $now - $keepAlive )) ] 
    then
        echo "resetting queue"
        IdleNextWarn=$incrementSet
        idleIncrement=0
    fi
    
done

echo
echo "Idle time limit exceeded, shutting down."
echo
# run shutdown lambda
# aws lambda invoke \ 
#     --function-name toggle-ec2-instance \
#     --payload '{ "hibernate": "true" }' \
#     response.json

