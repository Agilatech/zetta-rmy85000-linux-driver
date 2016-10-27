##Zetta RM Young 85000 Anemometer sensor driver for Linux

This driver should work on any Linux platform, and has been thoroughly tested on BeagleBone Black

###Install
```
$> npm install @agilatech/zetta-rmy85000-linux-driver
```
OR
```
$> git clone https://github.com/Agilatech/zetta-rmy85000-linux-driver zetta-rmy85000-linux-driver
```
###Usage

```
var zetta = require('zetta');
var rmy85000 = require('@agilatech/zetta-rmy85000-linux-driver');

zetta()
.use(rmy85000, [options])  // where [options] define operational paramters -- omit to accept defaults
.listen(<port number>)   // where <port number> is the port on which the zetta server should listen
```

####[options]
These options are defined in a file named 'options.json' which may be overridden by program definitions

```
"file":"<serial file device>"
/dev/ttyS0, /dev/ttyO2, etc...  Defaults to /dev/ttyS0

"chronPeriod":<period>
Period in milliseconds for monitored isochronal data

"streamPeriod":<period>
Period in milliseconds for streaming data. A value of 0 disables streaming.
```

####&lt;port number&gt;
Agilatech has definied the open port number 1107 as its standard default for IIOT (Industrial Internet 
Of Things) server application. In practice, most any port above 1024 may be used by other organizations.


###Example
Using directly in the zetta server:
```
const zetta = require('zetta');
const sensor = require('@agilatech/zetta-rmy85000-linux-driver');
zetta().use(sensor).listen(1107);
```
Initializes the rmy85000 driver on serial device /dev/ttyS0 with a data monitoring period of 60 seconds 
and streaming data every second.

To override the options defined in the options.json file, supply them in an object in the use statement like this:
```
zetta().use(sensor, { "file":"/dev/ttyS2", "chronPeriod":30000, "streamPeriod":15000 });
```
Overrides the defaults to initialize the serial device on **/dev/ttyS2** with a data monitoring period of **30 seconds** and streaming data every **1.5 seconds**


###Properties
All drivers contain the following 5 core properties:
1. **state** : the current state of the device, containing either the value *chron-on* or *chron-off* 
to indicate whether the device is monitoring data isochronally (a predefinied uniform time period of device data query).
2. **active** : a boolean value indicating whether of not the underlying hardware is operational and active.
3. **id** : the unique id for this device.  This device id is used to subscribe to this device streams.
4. **name** : the given name for this device.
5. **type** : the given type for this device, usually containing the category of either *Sensor* or *Actuator*.



####Monitored Properties
In the *chron-on* state and *active* operation, the driver software for this device monitors FIXME values in isochronal 
fashion with a period defined by *chronPeriod*:
1. **speed** - wind speed in m/s
2. **direction** - wind direction from 0-360 degrees


####Streaming Properties
If the hardware is *active*, the driver software continuously streams FIXME values with a frequency defined by 
*streamPeriod*. Note that a *streamPeriod* of 0 disables streaming.
1. **speedStream**
2. **directionStream**

###State
**chron-off** is the beginning state.  The driver also enters this state after a transition '*stop-isochronal*' command.  
In this state, all monitored data values are set to 0, and no sensor readings are updated.

**chron-on** is the state after a transition '*start-isochronal*' command.  In this state, all monitored data values are 
updated every time period as specified by '*chronPeriod*'.

###Transitions
1. **start-isochronal** : Sets the device state to *chron-on* and begins the periodic collection of sensor data. 
Property values are monitored, with a period defined by the 'chronPeriod' option (defaults to 60 sec).
2. **stop-isochronal** : Sets the device state to *chron-off* and stops data collection for the monitored values.

###Design

This device driver is designed for both streaming and periodic monitored data collection from the RM Young 85000 
series ultrasonic anemometer.  The hardware measures wind speed from 0-60 m/s with an accuracy of ±0.1 m/s. Wind 
direction is measured from 0-360 degrees with an accuracy of ±3 degrees.

Wind speed and direction values are instantaneous, with no averaging or time weighting performed.  Any analysis 
of averages and gusts will need to be performed downstream of this driver.

The hardware interfaces via RS-232 or RS-485, so your hardware must support one of these protocols.  The serial 
device file can be specified in the constructor.


### Hardware

* Beaglebone Black
* Beaglebone Green
* Should also work on Raspberry Pi as well as other Linux SBC


###Copyright
Copyright © 2016 Agilatech. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
