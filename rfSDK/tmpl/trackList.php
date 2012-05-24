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
    .lic2{
        cursor: pointer;
    }
</style>

<?php
if (isset($playlist) && $playlist) { ?>
    <div class="row playlist-detail">
        <img class="playlist-detail-img" width="99" style="float: left; padding-right: 20px;" src="<?php echo $playlist['image_url']?>" />
        <div style="float: left; width: 600px;">
            <div style="float: left; width: 99%; height: auto;">
            </div>
            <div style="float: left; clear:both;"/>
            <?php echo ($playlist['editorial'] != '')?$playlist['editorial']:$playlist['title']; ?>
        </div>
    </div>
<?php
} 
?>
<?php if (isset($artist) && $artist) { ?>
    <div class="row">

       <div class="eleven columns margin-0">
            <div class="row">
                <div class="column"><h2 class="bluetxt"><?php echo $artist['name']; ?></h2></div>
            </div>
        </div>

    </div>
<script>
    $('.hider[rel="#playlistselectbox"]').trigger('click');
    </script>
<?php } ?>
    <?php if (isset($genre) && $genre) { ?>
    <div class="row">
       <div class="eleven columns margin-0">
            <div class="row">
                <div class="column"><h2 class="bluetxt"><?php echo $genre; ?></h2></div>
            </div>
        </div>
    </div>
<script>
    $('.hider[rel="#playlistselectbox"]').trigger('click');
    </script>
<?php }
?>
    <?php if (isset($track) && $track) { ?>
    <div class="row">

       <div class="eight columns margin-0">
            <div class="row" style="float: right;">
                <div class="column"><h2><?php echo $track['title']; ?></h2>By <?php echo $track['artist_tooltip'];?></div>
            </div>
        </div>

    </div>
<script>
    $('.hider[rel="#playlistselectbox"]').trigger('click');
    </script>
<?php } ?>
    <div style="clear: both;"></div>
    <ul class="faketable clearfix onplaylist">
        <li class="thead clearfix">
            <span class="th" style="width: 90px;">
            </span>
            <span class="th" style="width: 145px;">
                ALBUM
            </span>
            <span class="th" style="width: 150px;">
                ARTIST
            </span>
            <span class="th" style="padding-left: 10px; width: 130px;">
                LENGTH
            </span>
            <span class="th" style="width: 130px;">
                GENRE
            </span>
        </li>
        <?php
        if ($media){
                foreach ($media as $result){
                    ?>
                    <li class="tr clearfix media_track_id_<?php echo $result['id']; ?> playlistinfoshow">
                        <span class="play-cell">
                            <a href="#nogo" class="rf-play-icon playthisplaylist" data-id="<?php echo $result['id']; ?>">Play</a>
                        </span>
                        <span class="generic-cell">
                            <a href="#nogo" data-id="<?php echo $result['id']; ?>" data-addtype="playlist" data-track="<?php echo addslashes($result['title']); ?>" data-artist="<?php echo isset($result['artist_tooltip'])?htmlentities($result['artist_tooltip']):''; ?>" class="pluslink rf-plus-icon">Plus<div class="plusmodal"></div></a>
                            <img style="padding-top: 13px; display: none;" src="img/loader-round.gif"/>
                        </span>

                        <span  class="text-cell big horizontal_scroller" tooltip="<?php echo htmlentities($result['title']); ?>">
                            <?php echo $result['title']; ?>
                        </span>
                        <span class="text-cell artist horizontal_scroller songartistcell" tooltip="<?php echo htmlentities($result['artist']); ?>">
                            <?php echo $result['artist']; ?>
                        </span>
                        <span class="text-cell" style="padding-left: 10px; width: 120px;">
                            <?php echo $result['length']; ?>
                        </span>
                        <span class="text-cell" style="width: 130px;">
                            <?php echo $result['genre']; ?>
                        </span>
                        <span class="text-cell lic2" style=" width: 80px; padding-right: 10px; text-align: right;" data-state="closed" rel="<?php echo $result['id']; ?>">
                            Click to open
                        </span>
                        <span class="end-cell">
                        </span>
                        <div class="loadthe_track"></div>
                    </li><?php
                }
               
        }else{ ?>
            <div style="clear: both;"></div>
            <div><h3 style="margin-top: 10px;">You stumped us! Try another search</h3></div>
        <?php
        }?>
    </ul>
<script type="text/javascript">
    $(function() {
        $('.lic2').click(function () {

            if ($(this).attr('data-state') == 'closed'){
                //run the ajax here!!!!!
                alert('Load this track-ID: '+$(this).attr('rel'));
                $(this).siblings('.loadthe_track').html('<div class="rf-main-loader"></div>');
                $(this).siblings('.loadthe_track').load('/demo-ajax/song_info.php',{ 'trackID': $(this).attr('rel') });
                $(this).attr('data-state', 'open');
            }else{
                $(this).attr('data-state', 'closed');
                $(this).siblings('.loadthe_track').html('');
            }
        });
    });
</script>
