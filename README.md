# DRONER

Droner is an ExpressJS app to control an ardrone drone with a wifi PS4 controller.  Using a headset provides an excellent FPV experience.


## TO INSTALL:
```
npm install tsd -g
npm install
```


## TO START APP:
```
npm start
```


## VIDEO FEED:
 * http://localhost:3000
 * Note: Works in Safari and Firefox.  There's an issue I need to look into causing it to not work on Chrome.


## PS4 CONTROLLER:
 * Left Joystick:  pitch & roll
 * Right Joystick: yah
 * L2:             lower altitude
 * R2:             raise altitude
 * Triangle:       land / takeoff
 * Share:          reset



## PAIRING A PS4 CONTROLLER
 * 1) Put the PS4 controller in Discovery Mode by holding down the PlayStation button and Share button at the same time.
 * 2) The light on the front of the controller will flash quickly, and Wireless Controller will appear in the Bluetooth window. Click Pair.
 * 3) WON'T PAIR, BLINKING BLUE LIGHT: Deleting /Library/Preferences/com.apple.Bluetooth.plist
        make sure it's not being communicated to another mac/machine




