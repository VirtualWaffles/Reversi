/******************************************************************************
Author:  Jesse Shewfelt
Updated: 28/03/2020
******************************************************************************/
"use strict";

let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

let PORT = 7253;

//start server
http.listen(PORT, function(){
    console.log("Server started on port " + PORT);
});

//serve client files
app.use(express.static(__dirname + '/client'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/reversi.html');
  });

io.on('connection', function(socket){
    //code goes here
});