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


<div class="row">
    <h2 class="column">Find great sound effects.</h2>
</div>

<div id="sfxselectbox" class="row">

    <div class="two column" style="margin-right:25px;">&nbsp;</div>
    <div class="three columns selector" id="sfxparents">
        <ul>
            <?php foreach ($tree as $row) { ?>
                <li rel="<?php echo $row['id']; ?>"><?php echo $row['name']; ?></li>
            <?php } ?>
        </ul>
    </div>
    <div class="column selectarrow"></div>
    <div class="three columns selector" id="sfxplaylists">
        <ul>

        </ul>
    </div>

</div>
<div style="clear: both;"></div>
<div id="sfxresults"></div>

<script type="text/javascript">
    var sfxParentReq = false;
    var sfxParentCnt = 0;
    $().ready(function(){
        $('#sfxselectbox div.selector[rev]').each(function(idx,el) {
            curdiv = el.id;
            $('#'+curdiv+' > ul > li').hide();
        });
        $('#sfxplaylists ul li').live('click', function(event, trueclick){

            if(!$(this).hasClass('selected')){
                $(this).siblings().removeClass('selected');
                $(this).addClass('selected');
            }
            var pid = $(this).attr('rel');
            $('#sfxresults').html('<img src="../img/loader.gif" />');
            $('#sfxresults').load('/demo-ajax/sfx_tracks.php',{ 'sfxID': pid });
        });
        $('#sfxselectbox div#sfxparents ul li').live('click', function(event, trueclick){
            if(!$(this).hasClass('selected')){
                $(this).siblings().removeClass('selected');
                $(this).addClass('selected');

                var sfx = $(this).attr('rel');
                $('#sfxplaylists ul').html('<img src="../img/loader.gif" />');
                $('#sfxplaylists ul').load('/demo-ajax/sfx_drildown.php',{ 'sfxID': sfx }, function(){
                    $('#sfxplaylists > ul > li:first').trigger('click');
                });
            }
        });
        $('#sfxselectbox #sfxparents > ul > li:first').trigger('click');
        $('a[href=\"#soundeffects\"]').trigger('click');
    });
</script>
