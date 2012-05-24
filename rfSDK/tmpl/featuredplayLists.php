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


if($playlists){?>
<div class="row">
    <h2 class="column">Browse hand-selected playlists in editor's picks.</h2>
</div>
<div class="row" id="playlistselectbox">
    <div id="scroll_wrap">
    <a class="main_prev browse left"></a>
        <div class="scrollable_main">
            <div class="itemsdiv">
            <?php 
            foreach($playlists as $playlist){
            ?>
            <div>
                <a class="inner_prev browse left"></a>
                    <div class="scrollable_inner">
                    <h3><?php echo $playlist['title']; ?></h3>
                        <div class="items_inner">

                        <?php $y = 0;
                        foreach ($playlist['lists'] as $prow):
                            if ($y == 0) {
                                echo '<div>';
                            }
                            $y++;
                        ?>
                            <p class="playlistscrollitem" data-rel="<?php echo $prow['id']; ?>">
                                <img width="120" src="<?php echo $prow['image_url']; ?>" /><br />
                                <span style="width: 125px; text-align: center; display: block;"><?php echo $prow['title']; ?></span>
                            </p>

                        <?php
                        if ($y == 3) {
                            echo '</div>';
                            $y = 0;
                        }
                        endforeach;
                        if ($y > 0) {
                            echo '</div>';
                        }
                        ?>

                    </div>
                </div>
                <a class="inner_next browse right"></a>
            </div>
            <?php
            }?>
        </div>
    </div>
    <a class="main_next browse right"></a>
    </div>

   <br style="clear: both;" />
</div>

<div id="table"></div>

<script type="text/javascript">

    $(function() {
	$(".scrollable_main").scrollable({
            circular : true,
            next : ".main_next",
            prev : ".main_prev"
        }).autoscroll({ autoplay: true,interval: 5000 });;
        $(".scrollable_inner").scrollable({
            circular : true,
            next : ".inner_next",
            prev : ".inner_prev",
            items: ".items_inner"
        });

        $('.playlistscrollitem').click(function () {
            //run the ajax here!!!!!
            alert('playlist ID: '+$(this).attr('data-rel'));
            $('#table').html('<div class="rf-main-loader"></div>');
            $('#table').load('/demo-ajax/playlist_table.php',{ 'playlistID': $(this).attr('data-rel') });
        });

        <?php
        if($defaultPID) { ?>
            $('.playlistsub').html('<div class="clearfix rf-main-loader"></div>');
            $.get('<?php echo $defaultPID; ?>',function(data){
            $('.playlistsub').html(data.output);
        },'json');
        <?php } ?>
    });
</script>
<?php
}else{ ?>
    <div class="row" id="playlistselectbox"></div>
    <script>
        $(function () {
            $('#playlist').html('<img src="../img/loader.gif" />');
            $.get('<?php echo $defaultPID; ?>',function(data){
                $('#playlist').html(data.output);
            },'json');
        });
    </script>
<?php
}?>
