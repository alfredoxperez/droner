'use strict';
var Stream = require('../lib/navdata/UdpNavdataStream');
var stream = new Stream();

var inboundDroneData = 'data';
var outboundDroneData = 'dronerStats';

var NavDataService = {
    instance: null,
    _io: null
};

function initialize(io) {
    NavDataService._io = io;
    NavDataService._io.on('connection', function(socket){
        socket.on(outboundDroneData, function(msg){
            NavDataService.emit(outboundDroneData, msg);
        })
    });

    stream.resume();
    stream.on(inboundDroneData, function(data){
        if(data.demo) {
            NavDataService._io.emit(outboundDroneData, data.demo);
        };
    });
};


module.exports = {
    init: function(io) {
        if(NavDataService.instance == null) {
            initialize(io);
            console.log('NavDataService initialized.');
        }
        return NavDataService.instance;
    },
    emit: function(msg) {
        NavDataService.emit(outboundDroneData, msg);
    }
};