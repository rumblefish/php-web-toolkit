<?php
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
?>

<style>
    #mpcontent {
        position: relative;
        overflow: visible;
    }
    #mainmapcontainer {
        background: url(img/circlefill.png) no-repeat 0px -3px transparent;
    }
    #mappicker svg {
        overflow:visible !important;
    }
</style>

<div class="row">
    <h2 class="column">Select the mood of your video to get soundtrack recommendations.</h2>
</div>
<div id="moodmapblock" class="gray8bg row">
    <div  class="row">
        <div class="row" id="mainmapcontainer">
            <a class="mmaptooltip sunny" tooltip="Positive"></a>
            <a class="mmaptooltip smile" tooltip="Serene"></a>
            <a class="mmaptooltip smileyellow" tooltip="Happy"></a>
            <a class="mmaptooltip sheep" tooltip="Subdued"></a>
            <a class="mmaptooltip lion" tooltip="Intense"></a>
            <a class="mmaptooltip sad" tooltip="Sad"></a>
            <a class="mmaptooltip angry" tooltip="Angry"></a>
            <a class="mmaptooltip storm" tooltip="Negative"></a>
            <div class="four columns margin-0" style="width:355px;">&nbsp;</div>
            <div class="four columns margin-0" style="overflow: visible;" >
                <div style="height:44px;"></div>
                <div id="mpcontent" style="overflow: visible;">
                    <div id="mappicker" style="overflow: visible;"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="playlistid"><img src="img/loader.gif" /></div>

<script>
    function moodmapDraw(x , y){

        var moodmapcircle = Raphael.colorpicker($('#mpcontent').offset().left, $('#mpcontent').offset().top , 222, "#eee",'mappicker');
        // assigning onchange event handler
        var onchange = function (item) {
            return function (clr) {

                this.cpicon.attr('stroke',clr.replace(/^#(.)\1(.)\2(.)\3$/, "#$1$2$3"));
                if(!theglower){
                    theglower = this.cpicon.glow({width : 10, color: '#FFFFFF', opacity: 0.75});
                    this.cpicon.attr('stroke-opacity',1);
                }
            };
        };

        if(x !== undefined){
            moodmapcircle.setHS(x,y);
        }
        moodmapcircle.onchange = onchange(moodmapcircle);
        return moodmapcircle;
    }

    $(document).ready( function() {
        moodmapcircle = moodmapDraw();
        $(window).resize(function() {
            x = moodmapcircle.cursor[0].attrs.cx;
            y = moodmapcircle.cursor[0].attrs.cy;
            if(moodmapcircle){
                moodmapcircle.remove();
            }
            moodmapcircle = moodmapDraw(x,y);
            moodmapcircle.cpicon.attr('stroke-opacity',0);
        });

<?php
if (isset($x) && isset($y)) {
    echo "mappicker_ondrop($x,$y,moodmapcircle);";
} else {
    echo "mappicker_ondrop(111,111,moodmapcircle);";
}
?>
});

$(document).ready( function() {
});

</script>
