/*
 Rumblefish Web Toolkit (PHP)
 
 Copyright 2012 Rumblefish, Inc.
 
 Licensed under the Apache License, Version 2.0 (the "License"); you may
 not use this file except in compliance with the License. You may obtain
 a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations
 under the License.
 
 Use of the Rumblefish Sandbox in connection with this file is governed by
 the Sandbox Terms of Use found at https://sandbox.rumblefish.com/agreement
 
 Use of the Rumblefish API for any commercial purpose in connection with
 this file requires a written agreement with Rumblefish, Inc.
 */


videoTimer = {}
videoTimer.startCount = 4357000;
videoTimer.startTimestamp = Date.parse("Jun 14, 2011");
videoTimer.msPerVideo = 22541; // based on 3833 videos per day
		
videoTimer.updateVideos = function() {
    var tsDiff = new Date().getTime() - this.startTimestamp
			
    var videos = parseInt(this.startCount + tsDiff / this.msPerVideo)
			
    // insert number formatting code
			
    $('#video_counter').text( this.formatCounter(videos) );
};
	
videoTimer.formatCounter = function(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

$('document').ready( function() {
    videoTimer.updateVideos();
    setInterval('videoTimer.updateVideos();', 5000)
});
