'use strict';

var util = require('util');
var arDrone         = exports;
exports.UdpControl  = require('../lib/control/UdpControl');
var control         = new arDrone.UdpControl()

var enableLogging = false;


let cmd = {
    ref: {},
    pcmd: {}
};

var status = {
    inflight: false
};

var resetACK = function() {
    if(enableLogging)
        console.log('DMissionControl: reset config ACK ...');
    control.ctrl(5, 0);

    console.log('DMissionControl: Recovering from emergency mode if there was one ...');
    cmd.ref.emergency = true;
};

var init = function() {

    resetACK();
    control.config('general:navdata_demo', 'TRUE');

    setInterval(function() {
        control.ref(cmd.ref);
        control.pcmd(cmd.pcmd);
        control.flush();
    }, 30);
};

var takeOff = function() {
    if(enableLogging)
        console.log('DMissionControl: Takeoff ...');

    cmd.ref.emergency   = false;
    cmd.ref.fly         = true;
    cmd.pcmd            = {};
    status.inflight     = true;
};

var land = function() {
    if(enableLogging)
        console.log('DMissionControl: Landing ...');

    cmd.ref.fly     = false;
    cmd.pcmd        = {};
    status.inflight = false;
};



/* dMissionControl
 *
 */
var dMissionControl = function(){
        init();

    this.toggleTakeOff = function() {
        let cmd = {
            ref: {},
            pcmd: {}
        };
        resetACK();
        if( status.inflight )
            land();
        else
            takeOff();
    }

    this.reset = function() {
        resetACK();
    };

    this.roll = function(roll) {
        if(enableLogging)
            console.log("DMissionControl: roll: " + roll);
        cmd.pcmd.right = roll;
    };

    this.pitch = function(pitch) {
        if(enableLogging)
            console.log("DMissionControl: pitch: " + pitch);
        cmd.pcmd.front = pitch;
    }

    this.yaw = function(yaw) {
        if(enableLogging)
            console.log("DMissionControl: yaw: " + yaw);
        cmd.pcmd.clockwise = yaw;
    };

    this.alt = function(alt) {
        if(enableLogging)
            console.log("DMissionControl: alt: " + alt);
        cmd.pcmd.up = alt;
    };
}




// -----------------
var DMissionControl = {
    instance: null
};


function initialize() {
    DMissionControl.instance = new dMissionControl();
    console.log('DMissionControl: initialized');
};


DMissionControl.getInstance = function() {
    if(DMissionControl.instance == null) {
        initialize()
    }
    return DMissionControl.instance;
}


module.exports = DMissionControl.getInstance();