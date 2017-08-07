'use strict';
var dualShock = require('../lib/node-dualshock-controller/dualshock.js');
var Rx = require('rx');

const enableLogging = false;
const enableMockController = false;
var error = false;
var dualShock4 = null;


if(enableMockController){
  dualShock4 ={
    disconnect: function(){
      if(enableLogging){
        console.log("ps4Controller: mock disconnect() called.");
      }
    },
    connect: function(){
      if(enableLogging){
        console.log("ps4Controller: mock connect() called.");
      }
    }
  };
}else{
  dualShock4 = dualShock({
    config: "dualshock4-generic-driver"
  });
}



// -------------------- RXJS SOURCES ---------------------------
//SOME MORE CONTROLLER STATS...
// 'battery:change'
// 'connection:change'
// 'charging:change'

var errorSource = Rx.Observable.fromEvent(dualShock4, 'error');

if(enableLogging)
  console.log("ps4Controller", errorSource);

// 'left:move' returns {x: v1, y: v2}: 0 - 255
var leftMoveSource = Rx.Observable.fromEvent(dualShock4, 'left:move');

// 'right:move' returns {x: v1, y: v2}: 0 - 255
var rightMoveSource = Rx.Observable.fromEvent(dualShock4, 'right:move');

// 'l2:analog' returns 0 - 255
var l2Source = Rx.Observable.fromEvent(dualShock4, 'l2:analog');

// 'r2:analog' returns 0 - 255
var r2Source = Rx.Observable.fromEvent(dualShock4, 'r2:analog');

// 'triangle:press' returns "triangle"
var trianglePressSource = Rx.Observable.fromEvent(dualShock4, 'triangle:press');

// 'triangle:press' returns "triangle"
var triangleHoldSource = Rx.Observable.fromEvent(dualShock4, 'triangle:hold');

// 'shareButton:press' returns "share"
var sharePressSource = Rx.Observable.fromEvent(dualShock4, 'share:press');

// -------------------------------------------------------------

var ps4Controller = function() {

    // --------- RXJS source getters ----------------------------
    //  Allows other classes to subscribe into the ps4 controller
    //  actions through rxjs sources...
    this.onError = function() {
      return errorSource;
    }

    this.onShareButtonPress = function() {
        return sharePressSource;
    };

    this.onTrianglePress = function() {
        return trianglePressSource;
    };

    this.onLeftDMove = function() {
        return leftMoveSource;
    };

    this.onRightDMove = function() {
        return rightMoveSource;
    };

    this.onL2Press = function() {
        return l2Source;
    };

    this.onR2Press = function() {
        return r2Source;
    };

    //once everything is ready we call connect()
    if(error){
      dualShock4.disconnect();
      console.log("ps4Controller: not connected");
    }else{
      dualShock4.connect();
      console.log("ps4Controller: connected");
    }
};

module.exports = new ps4Controller();
