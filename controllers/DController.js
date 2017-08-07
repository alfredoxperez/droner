'use strict';
var ps4Controller = require('../controllers/ps4Controller');
var DMC = require('../services/DMissionControl');

const dPadCenter = 127.5;

// DController
//  Intermediary between the controller implementation and the drone mission
//  control.  Abstracts out the rxjs subscriptions from both.
//
//  DController is the entry point for controlling the drone. It is initialized
//  in app.js and loads both the requester for action (ps4Controller) and the
//  doer of those actions (DMissionControl). Think of this as the
//  'routes' for a gamepad that gets 'requests' with certain input and we
//  define what to do with them.
var DController = function(){
    console.log("Drone Controller: started");

    var shareButtonPressSubscription = ps4Controller.onError().subscribe(
        x => console.log('DController: onError: onError: %s', x),
        e => console.log('DController: onError: onError: %s', e),
        () => console.log('DController: onError: onCompleted')
    );

    var shareButtonPressSubscription = ps4Controller.onShareButtonPress().subscribe(
        x => DMC.reset(),
        e => console.log('DController: onPsxButtonPress: onError: %s', e),
        () => console.log('DController: onPsxButtonPress: onCompleted')
    );

    var trianglePressSubscription = ps4Controller.onTrianglePress().subscribe(
        x => DMC.toggleTakeOff(),
        e => console.log('DController: onTrianglePress: onError: %s', e),
        () => console.log('DController: onTrianglePress: onCompleted')
    );

    var onLeftDMoveSubscription = ps4Controller.onLeftDMove().subscribe(
        x => ps4LeftDPadToDroner(x),
        e => console.log('DController: onLeftDMove: onError: %s', e),
        () => console.log('DController: onLeftDMove: onCompleted')
    );

    var onRightDMoveSubscription = ps4Controller.onRightDMove().subscribe(
        x => ps4RightDPadToDroner(x),
        e => console.log('DController: onRightDMove: onError: %s', e),
        () => console.log('DController: onRightDMove: onCompleted')
    );

    var l2Subscription = ps4Controller.onL2Press().subscribe(
        x => ps4L2ToDroner(x),
        e => console.log('DController: onL2Press: onError: %s', e),
        () => console.log('DController: onL2Press: onCompleted')
    );

    var r2Subscription = ps4Controller.onR2Press().subscribe(
        x => ps4R2ToDroner(x),
        e => console.log('DController: onR2Press: onError: %s', e),
        () => console.log('DController: onR2Press: onCompleted')
    );
}

var ps4LeftDPadToDroner = function(leftD) {
    let roll = 0;
    let pitch = 0;

    if(leftD.x < dPadCenter) {
        // roll left
        roll = (leftD.x - 127)*(1/127);
    } else {
        // roll right
        roll = (leftD.x - 128)*(1/127);
    }

    if(leftD.y < dPadCenter) {
        // pitch forward
        pitch = (leftD.y - 127)*(-1/127);
    } else {
        // pitch backward
        pitch = (leftD.y - 128)*(-1/127);
    }

    DMC.roll(roll);
    DMC.pitch(pitch);
};

var ps4RightDPadToDroner = function(rightD) {
    let yaw = 0;

    if(rightD.x < dPadCenter) {
        // counterclockwise
        yaw = (rightD.x - 127)*(1/127);
    } else {
        // clockwise
        yaw = (rightD.x - 128)*(1/127);
    }

    DMC.yaw(yaw);
};

var ps4L2ToDroner = function(x) {
    // down
    DMC.alt(x * (-1/255));
};

var ps4R2ToDroner = function(x) {
    // up
    DMC.alt(x * (1/255));
};


module.exports = DController;