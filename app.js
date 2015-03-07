var app = require('express')();
var http = require('http');
var irc = require('irc');
var config = require('./config.js');
var winston = require('winston');
var client = new irc.Client(
        config.irc.server,
        config.irc.bot_nick,
        {
            channels: [config.irc.channel],
            debug:true
        }
);

// init http server
var server = http.createServer(app);

// init socket io object
var io = require('socket.io').listen(server);

client.addListener('error', function(message) {
    winston.info('[IRC] error: ', message);
});

client.join(config.irc.channel + ' ' + config.irc.bot_pwd);

client.addListener('message', function (from, to, message) {
    winston.info("[IRC] channel : " + config.irc.channel + " from : " + from + ', to : ' + to + ', message : ' + message);
    io.sockets.emit('irc_msg', message);
});

server.listen(3001);
