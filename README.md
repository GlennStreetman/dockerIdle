Example Code: Use a bash script to monitor an HTTP server and shut it down automaticaly if there is no network activity on target port for X number of seconds.

## idleDocker.sh script Setup
Port: The port of underlying http server.
incrementSet: interval between idle checks.
maxIdleSeconds: max idle time.

### Development Mode

> npm run dBuild
> npm run dUp

###### Keep server alive

> curl localhost:3000/api/idle

or visit localhost:3000 in browser

### Prod

> npm run pBuild
> npm run pUp

