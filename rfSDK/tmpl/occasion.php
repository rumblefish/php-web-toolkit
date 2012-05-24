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
    <h2 class="column">What's the occasion for your video?</h2>
</div>
<div id="occassionselectbox" class="row">
    <div class="three columns selector" id="gparents" rel="parents">
        <ul>
            <?php foreach ($grandparents as $id => $name) { ?>
                <li rel="<?php echo $id; ?>"><?php echo $name; ?></li>
            <?php } ?>
        </ul>
    </div>
    <div class="column selectarrow"></div>

    <div class="three columns selector" id="parents" rel="childs" rev="gparents">
        <ul>
            <?php foreach ($parents as $gid => $rows) { ?>
                <?php foreach ($rows as $row) { ?>
                    <li rel="<?php echo $row['id']; ?>" rev="<?php echo $gid; ?>"><?php echo $row['name']; ?></li>
                <?php } ?>
            <?php } ?>
        </ul>
    </div>
    <div class="column selectarrow"></div>

    <div class="three columns selector margin-0" id="childs" rev="parents">
        <ul>
            <?php foreach ($children as $pid => $rows) { ?>
                <?php foreach ($rows as $row) { ?>
                    <li rel="<?php echo $row['id']; ?>" rev="<?php echo $pid; ?>"><?php echo $row['name']; ?></li>
                <?php } ?>
            <?php } ?>
        </ul>
    </div>
    <div style="clear: both;"></div>
    <div id="oc_table">
    </div>
</div>

<script type="text/javascript">
    $().ready(function(){
        $('#occassionselectbox div.selector[rev]').each(function(idx,el) {
            curdiv = el.id;
            $('#'+curdiv+' > ul > li').hide();
        });
        $('#occassionselectbox div.selector ul li').live('click', function(event, trueclick){
            if(!$(this).hasClass('selected')){
                $(this).siblings().removeClass('selected');
                $(this).addClass('selected');
                var curdiv = $(this).parent('ul').parent('div');
                var curdivid = curdiv.attr('id');
                var therel = $('#'+curdivid+'[rel]').attr('rel');

                if(therel !== undefined){
                    $('#'+therel+' > ul > li').removeClass('selected');
                    $('#'+therel+' > ul > li').hide();
                    $('#'+therel+' > ul > li[rev="'+$(this).attr('rel')+'"]').show();
                    $('#'+therel+' > ul > li[rev="'+$(this).attr('rel')+'"]:first').trigger('click');
                    return true;

                }
                if(trueclick !== true){
                    //run the ajax here!!!!!
                    alert('playlist ID: '+$(this).attr('rel'));
                    $('#oc_table').html('<div class="rf-main-loader"></div>');
                    $('#oc_table').load('/demo-ajax/occasion_table.php',{ 'playlistID': $(this).attr('rel') });
                }
            }
        });
        $('#occassionselectbox #gparents > ul > li:first').trigger('click',[true]);
    });
</script>
