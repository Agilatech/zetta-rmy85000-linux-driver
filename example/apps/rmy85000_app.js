/*
 Copyright © 2016 Agilatech. All Rights Reserved.
 
 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

module.exports = function testApp(server) {
  
  var rmy85000DeviceQuery = server.where({type:'RMY85000_Sensor'});
  
  server.observe([rmy85000DeviceQuery], function(rmy85000Device){

  	// start the periodic data collection
  	rmy85000Device.call('start-isochronal');

  	// Now when the monitored value changes, new data will be present on the stream.
  	// The incomming message contains three fields: topic, timestamp, and data.
  	rmy85000Device.streams.speed.on('data', function(message) {
      console.log("data stream " + message.topic + " : " + message.timestamp + " : " + message.data)
    });

    rmy85000Device.streams.direction.on('data', function(message) {
        console.log("data stream " + message.topic + " : " + message.timestamp + " : " + message.data)
    });

  	// Above, note that we know the monitored data name.  This information is also available in the
  	// device meta response at http://localhost:1107/servers/testServer/meta/RMY85000_Sensor
  });
  
}