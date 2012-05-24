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
    .lic{
        cursor: pointer;
    }
</style>

<div style="width: 900px">
<ul class="faketable clearfix">
    <li class="thead clearfix">
        <span class="th" style="width: 60px;"></span>
        <span class="th" style="width: 295px; padding-left: 50px;">Title</span>
        <span class="th" style="width: 120px;">Occasion</span>
        <span class="th pager-nav" style="width: 280px; text-align: right; float: right;"></span>
    </li>
    <?php
    if ($results) {
        foreach ($results as $result) {
            ?>
            <li class="tr clearfix media_track_id_<?php echo $result['id']; ?> playlistinfoshow">
                <span class="generic-cell" style="width: 55px;">
                    <?php
                    if (isset($result['image_url'])){
                    ?>
                        <img height="45" src="<?php echo $result['image_url'];?>" />
                    <?php
                    }?>
                </span>
                <span class="play-cell">
                    <a href="#nogo" class="rf-play-icon playthisplaylist" data-id="<?php echo $result['id']; ?>">Play</a>
                </span>
                <span  class="text-cell big horizontal_scroller" tooltip="<?php echo htmlentities($result['title']); ?>">
                    <?php echo $result['title']; ?>
                </span>
        <?php
            if(isset($result['album_name']) && $result['album_name']) { ?>
             <span class="text-cell artist horizontal_scroller songartistcell" tooltip="<?php echo htmlentities($result['album_name']); ?>">
                    <?php echo $result['album_name']; ?>
                </span>
            <?php
            }else{ ?>
                <span class="text-cell artist horizontal_scroller songartistcell" tooltip="<?php echo isset($result['artist_tooltip'])?htmlentities($result['artist_tooltip']):''; ?>">
                    <?php echo isset($result['artist'])?$result['artist']:''; ?>
                </span>
            <?php
            }
            ?>
                <span class="text-cell" style="width: 120px;">
                    <?php echo $result['occasion']; ?>
                </span>
                <span class="text-cell lic" style="width: 220px; padding-right: 10px; text-align: right;" rel="<?php echo $result['id']; ?>" data-state="closed">
                    Click to open
                </span>
                <span class="end-cell">
                </span>
                <div class="loadthe_playlist"></div>
            </li>
        <?php
        }
        ?>
    <?php } else { ?>
        <tr><td colspan="10"><h3 style="margin-top: 10px;">No results</h3></td></tr>
    <?php } ?>

</ul>
</div>
<script type="text/javascript">
    $(function() {
        $('.lic').click(function () {

            if ($(this).attr('data-state') == 'closed'){
                //run the ajax here!!!!!
                alert('Load this playlist-ID: '+$(this).attr('rel'));
                $(this).siblings('.loadthe_playlist').html('<div class="rf-main-loader"></div>');
                $(this).siblings('.loadthe_playlist').load('/demo-ajax/playlist_table.php',{ 'playlistID': $(this).attr('rel') });
                $(this).attr('data-state', 'open');
            }else{
                $(this).attr('data-state', 'closed');
                $(this).siblings('.loadthe_playlist').html('');
            }
        });
    });
</script>
