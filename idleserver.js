var http = require('http');
const { exec, fork } = require("child_process");

let keepAlive = Date.now()

console.log('starting next server')
var nextServer = fork(`./server.js`);

console.log('starting idle server')
var idleServer =http.createServer(function (req, res) {
    console.log("Received msg", req?.headers?.host )
    keepAlive = Date.now()
    res.write('Updating Idle Timer'); //write a response to the client
    res.end(); //end the response
  }).listen(8080); //the server object listens on port 8080

function CheckIdle(){
    console.log('idle time: ', Date.now() - keepAlive)
    if ((Date.now() - keepAlive) < 60000){
        setTimeout(()=>{
            CheckIdle()
        }, 1000)
    } 
        else 
    {
        console.log('idle time limit exceeded, shutting down')
        nextServer.kill('SIGINT')
        idleServer.close()
        setTimeout(()=>{
            console.log('down')
            process.exit(0);
        }, 5000)
    }
}

CheckIdle()