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


<script type="text/javascript" src="/js/syncplayer.js"></script>

<div id="fixed_players" style="float: left; height: auto; background: #EBE8DF; z-index: 9005; border-left: 0; border-right: 0;">
    <input type="hidden" id="def" value="<?php echo $default;?>"/>
    <div class="grid" style="width: 978px; height: 220px;">
        <div class="players row">
            <div class="youtubeplayer four columns margin-0">
                <code id="youtube_block" class="zp-static" data-call="rf youtubevid" data-params="" data-access="guest"></code>
                <div id="youtubePlayer">
                    <a href="https://youtu.be/<?php if(isset($default)){echo $default;}?>" id="yt_zplayer">Demo</a>
                </div>
                <div id="youtubePlayerMsg">
                    <div id="ytplayerAlert" class="oops">
                        <h2>Oops...</h2>
                        <p>We're sorry, but we couldn't open that video.</p>
                        <p>Please try again with a different video.</p>
                    </div>
                </div>

                <div class="youtubesearch block-yt clearfix">
                    <form id="youtube_embedder" novalidate="novalidate" action="/">
                        <input id="youtubeEmbedURL" type="text" name="youtubesearch" class="bar" placeholder="YouTube username or URL" />
                        <input id="youtubeEmbed" type="submit" value="Go" class="button youtube" />
                    </form>
                </div>
            </div>
            <!-- hidden inputs -->
            <input type="hidden" id="audio_trackid" value=""/>
            <input type="hidden" id="audio_offset" value="0"/>
            <input type="hidden" id="video_offset" value="0"/>
            <input type="hidden" id="elapsed" value="0"/>
            <input type="hidden" id="video_duration" value="0"/>
            <input type="hidden" id="audio_duration" value="0"/>
            <input type="hidden" id="audio_current_duration" value="0"/>
            <input type="hidden" id="audio_current_time" value="0"/>
            <input type="hidden" id="video_volume" value="0"/>
            <input type="hidden" id="audio_volume" value="0"/>
            <input type="hidden" id="video_muted" value="0"/>
            <input type="hidden" id="audio_muted" value="0"/>
            <input type="hidden" id="video_current_duration" value="0"/>
            <input type="hidden" id="video_current_time" value="0"/>
            <input type="hidden" id="edit_share_mode" value="0"/>

            <div class="musicplayer eight columns right margin-0">

                <div id="jquery_jplayer_1" class="jp-jplayer clearfix"></div>

                <div id="jp_container_1" class="jp-audio">
                    <div class="jp-type-playlist">

                        <div class="jp-gui jp-interface block-yt">
                            <div class="jp-progress-loading clearfix">
                            </div>

                            <div class="jp-userdata clearfix"></div>

                            <div class="jp-progress-wrapper clearfix">
                                <div class="timeline-status-wrapper">
                                    <div class="timeline-status">
                                        <div class="aud-wrap-time">
                                            <div class="aud-current-time">0:00</div>
                                            <div class="jp-time-arrow"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="jp-video-wrapper">
                                    <div class="clearfix" id="video_mask"></div>
                                    <div class="jp-block-left">
                                        <div id="video_c_mask" class="jp-block-mask"></div>
                                        <a class="clear-fix jp-controller" href="javascript:;" id="video_controller">Video</a>
                                        <div class="clearfix vol-wrapper">
                                            <a href="javascript:;" class="vid-mute" title="mute">mute</a>
                                            <a href="javascript:;" class="vid-unmute" title="unmute">unmute</a>
                                            <div class="vid-volume-bar">
                                                <div class="vid-knob"></div>
                                                <div style="display: none;" class="vid-volume-bar-value"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="jp-block-right">
                                        <div class="video-durationbar">
                                            <div class="video-start-thumb"></div>
                                            <div class="video-mid-thumb"></div>
                                            <div class="video-end-thumb"></div>
                                            <div id="display_video_offset" class="display-offset">
                                                <div class="offset-arrow-t"></div>
                                                <div class="current-offset">0:00</div>
                                                <div class="offset-arrow-b"></div>
                                            </div>

                                            <div class="zp-seek-bar">

                                                <div class="zp-play-bar">
                                                    <div class="jp-wrap-time">
                                                        <div class="zp-current-time">0:00</div>
                                                        <div class="jp-time-arrow"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div id="vidtime_start" class="timeline_start">0:00</div>
                                        <div id="timeline_end" class="timeline_end">0:00</div>
                                    </div>
                                </div>

                                <div class="jp-progress-inner clearfix">
                                    <div class="clearfix" id="audio_mask"></div>
                                    <div class="jp-block-left">
                                        <div id="audio_c_mask" class="jp-block-mask"></div>
                                        <a class="clear-fix jp-controller" href="javascript:;" id="audio_controller">Audio</a>
                                        <div class="clearfix vol-wrapper">
                                            <a href="javascript:;" class="jp-mute" title="mute">mute</a>
                                            <a href="javascript:;" class="jp-unmute" title="unmute">unmute</a>
                                            <div class="jp-volume-bar">
                                                <div class="jp-knob"></div>
                                                <div style="display: none;" class="jp-volume-bar-value"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="jp-block-right" style="left: 0px; width: 560px;">
                                        <div class="timeline_start jp-current-time">0:00</div>
                                        <div id="audio_end" class="timeline_end jp-duration">0:00</div>
                                        <div class="jp-progress">

                                            <div id="display_audio_offset" class="display-offset">
                                                <div class="offset-arrow-t"></div>
                                                <div class="current-offset">0:00</div>
                                                <div class="offset-arrow-b"></div>
                                            </div>
                                            <div class="jp-seek-bar">

                                                <div class="jp-play-bar">
                                                    <div class="jp-wrap-time">
                                                        <div class="jp-current-time"></div>
                                                        <div class="jp-time-arrow"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul id="editmode_ul">
                                <li id="edittext">Editing Mode</li>
                                <li class="saveMe"><a href="#">Save</a></li>
                            </ul>
                            <div class="jp-controls-wrapper clearfix">
                                <div class="jp-controls-mask clearfix"></div>
                                <ul class="jp-controls first">
                                    <li class="button-holder"><a href="javascript:;" id="allplay" class="fake-play" >play</a></li>
                                </ul>

                                <div class="jp-title" style="display: block;">
                                    <ul>
                                        <li></li>
                                    </ul>
                                    <div class="jp-playlist">
                                        <ul>
                                            <!-- The method Playlist.displayPlaylist() uses this unordered list -->
                                            <li>This is mine</li>
                                            <li>This is mine</li>
                                            <li>This is mine</li>
                                            <li>This is mine</li>
                                            <li>This is mine</li>
                                            <li>This is mine</li>
                                        </ul>
                                    </div>
                                </div>

                                <span class="jp-duration"></span>
                                <div class="loadTrack" style="float: right;padding: 5px 20px 0 0;cursor: pointer;">
                                    <a href="#" class="playthistrack" data-id="18443" data-track="Action House" data-length="1:19" data-artist="His Boy Elroy" tooltip="Play this Song">Load Track1</a><br />
                                    <a href="#" class="playthistrack" data-id="19498" data-track="To Show You My Love" data-length="4:41" data-artist="Mike Schmid" tooltip="Play this Song">Load Track2</a>
                                </div>
                            </div>
                        </div>

                        <div class="jp-no-solution">
                            <span>Update Required</span>
                            To play the media you will need to either update your browser to a recent version or update your <a href="https://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <a href="#nogo" id="hideshow">Toggle</a>
    </div>
</div>
<div id="testmp3"></div>

<script type="text/javascript">
    $(function() {
        $(document).click(function(event) {
            if($('#jp_option').siblings('ul').is(':visible')) {
                $('#jp_option').trigger('click');
            }
            if($('.plusmodal').is(':visible')) {
                $('.plusmodal').find('a.closeplus').trigger('click');
            }
            if($(event.currentTarget).hasClass('dk_toggle')) {
                var curel = $(event.currentTarget).parent().attr('id');

                $('.dk_container').removeClass('dk_focus');
                if($('#' + curel).hasClass('dk_open')){
                    $('#' + curel).addClass('dk_focus');
                }
                $('.dk_container.dk_open').each(function () {
                    if(!$(this).hasClass('dk_focus')){
                        $(this).removeClass('dk_open');
                    }
                    if(!$('#' + curel).hasClass('dk_open')){
                        $('#' + curel).addClass('dk_open');
                    }
                });
            }else{
                $('.dk_open > .dk_toggle').trigger('click');
            }
        });

        $('a#hideshow').toggle(function() {
            $('#fixed_players').animate({
                top: '-125px'
            }, 500);
            $('#buffer').animate({
                height: '140px'
            }, 500, function() {
                if(typeof moodmapDraw == 'function'){
                    x = moodmapcircle.cursor[0].attrs.cx;
                    y = moodmapcircle.cursor[0].attrs.cy;
                    if(moodmapcircle){
                        moodmapcircle.remove();
                    }
                    moodmapcircle = moodmapDraw(x,y);
                    moodmapcircle.cpicon.attr('stroke-opacity',0);
                }
            });
            $(this).addClass('open');
        }, function() {
            $('#fixed_players').animate({
                top: '75px'
            }, 500);
            $('#buffer').animate({
                height: '340px'
            }, 500, function() {
                if(typeof moodmapDraw == 'function'){
                    x = moodmapcircle.cursor[0].attrs.cx;
                    y = moodmapcircle.cursor[0].attrs.cy;
                    if(moodmapcircle){
                        moodmapcircle.remove();
                    }
                    moodmapcircle = moodmapDraw(x,y);
                    moodmapcircle.cpicon.attr('stroke-opacity',0);
                }
            });
            $(this).removeClass('open');
        });

        $('.playthistrack').click(function(e){
            // Load a track to the sync player
            e.preventDefault();
            var track = $(this).attr('data-track'); //should be retrieved from the button elem
            var artist = $(this).attr('data-artist'); //"The Stark Palace";
            var mp3 = '/media/mp3/track/' + $(this).attr('data-id');
            var poster = $(this).attr('data-id');
            var media_id = $(this).attr('data-id');

            addToPlayerQue(media_id, track, artist, mp3, poster, true, $(this));
        });

    });

    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
</script>
