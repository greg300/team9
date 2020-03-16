// Code for Arduino communication

// Using Node.js and Socket.io

// Set up npm dependencies
const process = require('process');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const serialport = require('serialport');

const port = 3000;

// Move current working directory back
process.chdir('../');

// Add any files in the /public folder plus the html file
app.use(express.static(process.cwd()));
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/index.html');
});

// Set up parser
const sp_readline = serialport.parsers.Readline;

// Set up listener to serial port on COM3 with bit rate of 9600 bps
const sPort = new serialport('COM3', {
    baudRate: 9600
});

// More parser set up
const parser = new sp_readline();
sPort.pipe(parser);

sPort.on('open', () => {
    console.log('Serial Port Opened');
    let lastValue;
    io.on('connection', socket => {
        socket.emit('connected');
        parser.on('data', data => {
            // Everytime the value changes, emit the data over the socket
            let lastValue;
            if (lastValue !== data)
            {
                socket.emit('data', data);
            }
            lastValue = data;
        })
    })
})

// Start server
http.listen(port, function(){
  console.log('Starting arduino server on port ' + port);
});
