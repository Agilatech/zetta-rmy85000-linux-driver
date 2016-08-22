/*
Copyright © 2016 Agilatech. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const device = require('zetta-device');
const sensor = require('@agilatech/rmy85000');
const util = require('util');

var rmy85000 = module.exports = function(options) {
  device.call(this);

  this.options = options || {};
  this.file  = this.options['file'] || "/dev/ttyS0";
  this.chronPeriod  = this.options['chronPeriod']  || 60000; //milliseconds
  this.streamPeriod = this.options['streamPeriod'] || 10000;

  this.speed           = 0;
  this.speedStream     = 0;
  this.direction       = 0;
  this.directionStream = 0;
  this._chronInterval     = null;
  this._speedInterval     = null;
  this._directionInterval = null;

  this.rmy85000_sensor = new sensor.Rmy85000(this.file);
};

util.inherits(rmy85000, device);

rmy85000.prototype.init = function(config) {

  config
        .type('RMY85000_Sensor')
        .state('chron-off')
        .when('chron-off', {allow: ['start-isochronal']})
        .when('chron-on', {allow: ['stop-isochronal']})
        .stream('speedStream', this.streamSpeed)
        .monitor('speed')
        .stream('directionStream', this.streamDirection)
        .monitor('direction')
        .map('stop-isochronal', this.stopIsochronal)
        .map('start-isochronal', this.startIsochronal)
        .name(this.rmy85000_sensor.rmy85000())
        .remoteFetch(function() {
            return {
                active: this.rmy85000_sensor.deviceActive(),
                speed: this.readSpeed(),
                direction: this.readDirection()
            };
        });
};

rmy85000.prototype.startIsochronal = function(callback) {
  this.state = 'chron-on';
  
  // load values right away before the timer starts
  this.speed = this.readSpeed();
  this.direction = this.readDirection();

  var self = this;
  
  this._chronInterval = setInterval(function() {
    self.speed = self.readSpeed();
    self.direction = self.readDirection();
  }, this.chronPeriod);
  
  callback();
}

rmy85000.prototype.stopIsochronal = function(callback) {
  this.state = 'chron-off';

  this.speed = 0;
  this.direction = 0;

  clearTimeout(this._chronInterval);
  callback();
};

rmy85000.prototype.streamSpeed = function(stream) {
  // a stream period of 0 disables streaming
  if (this.streamPeriod <= 0) { 
    stream.write(0);
    return;
  }

  var self = this;
  this._speedInterval = setInterval(function() {
      stream.write(self.readSpeed());
  }, this.streamPeriod);
};

rmy85000.prototype.streamDirection = function(stream) {
  // a stream period of 0 disables streaming
  if (this.streamPeriod <= 0) {
    stream.write(0);
    return;
  }
  
  var self = this;
  this._directionInterval = setInterval(function() {
    stream.write(self.readDirection());
  }, this.streamPeriod);
};

rmy85000.prototype.readSpeed = function() {
    
    if (this.rmy85000_sensor.deviceActive()) {
      return this.rmy85000_sensor.valueAtIndexSync(0);
    }
};

rmy85000.prototype.readDirection = function() {
  
  if (this.rmy85000_sensor.deviceActive()) {
    return this.rmy85000_sensor.valueAtIndexSync(1);
  }
};



