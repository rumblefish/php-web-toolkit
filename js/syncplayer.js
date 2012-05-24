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


$(function() {
    // cookie storing informatyion about previous Tubes played
    var tmpTubes = $.JSON.decode($.cookie('zpYouTube'));
    var defaultYT = $.JSON.decode($.cookie('zpYouTubeDefault'));

    if(defaultYT) {
        $('#yt_zplayer').attr('href', 'https://youtu.be/' + defaultYT);
    }                                                      
    if(tmpTubes === null){
        tmpTubes = {};
    }                           
    
    // Initialize the YouTube Player and its bindings
    $('#yt_zplayer').zplayer({
        height: 160,
        width: 292,
        autohide: true                    
    });
    
    // mute button
    $('#yt_zplayer').zplayer('instance').bind('onSoundOff', function() {
        $('#video_muted').val(1);
        $('.vid-unmute').show();
        $('.vid-mute').hide();
        // move our knob to 0
        $('.vid-knob').css({
            left: 0
        });
    });
    // unmute
    $('#yt_zplayer').zplayer('instance').bind('onSoundOn', function() {
        $('#video_muted').val(0);
        $('.vid-unmute').hide();
        $('.vid-mute').show();
        var shift = Math.round(34*($('#video_volume').val()/100));
        // move the knob back to the correct pos
        $('.vid-knob').css({
            left: shift + 'px'
        });
    });
    // bind our mute/unmute
    $('.vid-mute, .vid-unmute').click(function() {
        $('#yt_zplayer').zplayer('toggleSound');     
    });
    // need to bind in our volume controls
    $('.vid-volume-bar').click(function(e) {
        var changeTo = e.pageX - $('.vid-volume-bar').offset().left,
        volWidth = $('.vid-volume-bar').outerWidth();
        var level = Math.round(changeTo/volWidth * 100);                                                         
        $('#yt_zplayer').zplayer('changeVolume', level);
    });
    // whenever the volume changes, store the val
    $('#yt_zplayer').zplayer('instance').bind('onVolumeChange', function(e, level) {
        // write our volume to the hidden input
        $('#video_volume').val(level);
    });
    
                                
    // trigger our initial yt volume
    //
                                
                                                                
    $('#yt_zplayer').zplayer('instance').bind('onCue.rf', function() {
        $('.zp-seek-bar').unbind('click').removeClass('bound');
        // turn off edit share if we change the video
        $('#edit_share_mode').val(0);
        $('#editmode_ul').hide();
        videoControl('off');
        audioControl('off');   
        $('#allplay').removeClass('active');
        
        // for first time visitors
        if($('#zplayer_input_yt_zplayer').val() == $('#def').val() ){
            $('.video-durationbar').hide();
            var loadmsg = $('<div></div>').attr('id', 'vid_load_message');
            loadmsg.text('Enter a YouTube video URL or username in the box to the left to add a video');
            $('#video_mask').append(loadmsg);
            videoControl('on');
            $('#video_mask').show();
            $('#video_controller').css({
                'z-index': 500
            }).removeClass('is-active');
            $('#video_controller').siblings('.vol-wrapper').addClass('disabled');
        //$('.zplayer-controls').show();
        } else {
                                        
            if($('.video-durationbar').not(':visible')) {
                $('.video-durationbar').show();
                $('#video_mask').children().remove();
                $('.zplayer-controls').hide();
                $('#video_mask').hide();
            }
        }
        $('#audio_offset').val(0);
        $('.jp-progress').animate({
            left : 0
        }, 500);
        $('#video_offset').val(0);
        $('.video-durationbar').animate({
            left : 0
        }, 500);
                
        // set our default
        $('#video_duration').val(0);
        $('#yt_zplayer').zplayer('pause');
        $('#yt_zplayer').zplayer('changeVolume', 80);
        $('#yt_zplayer').zplayer('soundOff');

        // try retrieve it from the stored video data
       /* var xhr = $.get('/rfsdk/rfYoutubedata', {
            video : $('#zplayer_input_yt_zplayer').val()
        }, function(data) {
            if(data) {*//*
                $('#video_duration').val(Number(data.duration));
                var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
                var videowidth = (Number($('#video_duration').val()) / timeline);
                var audiowidth = (Number($('#audio_duration').val()) / timeline);
                    
                $('.video-durationba').animate({
                    width: Math.round((audiowidth * 560), 0) + 'px'
                }, 500);
                    
                $('.jp-progress').animate({
                    width: Math.round((audiowidth * 560), 0) + 'px'
                }, 500);
                    
                //                    $('.video-durationbar').css({
                //                        width: videowidth + '%'
                //                    });
                //                    $('.jp-progress').css({
                //                        width: audiowidth + '%'
                //                    });

                $('#timeline_end').text(formatTime(Number($('#video_duration').val())));
                // add the ytthumbs
                $('div.video-start-thumb').css('background', 'url(//img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/1.jpg) no-repeat center left');
                $('div.video-mid-thumb').css('background', 'url(//img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/2.jpg) no-repeat center left');
                $('div.video-end-thumb').css('background', 'url(//img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/3.jpg) no-repeat center left');

                // store the last cued item in a cookie
                $.cookie('zpYouTubeDefault', $.JSON.encode($('#zplayer_input_yt_zplayer').val()), {
                    path: '/',
                    expires: 30
                });

                // make it active
                videoControl('on');
                audioControl('off');
                */

           // } else {
                // lets try get the youtube data for this video if available
                if($('#video_duration').val() == 0) {
                    $.get('//gdata.youtube.com/feeds/api/videos/' + $('#zplayer_input_yt_zplayer').val() + '?v=2&alt=jsonc', function(viddata) {

                        if(viddata && viddata.data) {
                            // we're only interested in the duration really
                            if(viddata.data.duration) {
                                // if the duration is available, write it to the db
                               /* $.post('/rf/store_youtubedata', {
                                    video : $('#zplayer_input_yt_zplayer').val(),
                                    duration : viddata.data.duration
                                });*/

                                $('#video_duration').val(viddata.data.duration);
                                var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
                                var videowidth = (Number($('#video_duration').val()) / timeline) * 100;
                                var audiowidth = (Number($('#audio_duration').val()) / timeline) * 100;

                                $('.video-durationbar').css({
                                    width: videowidth + '%'
                                });
                                $('.jp-progress').css({
                                    width: audiowidth + '%'
                                });

                                $('#timeline_end').text(formatTime(Number($('#video_duration').val())));

                                // add the ytthumbs
                                $('div.video-start-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/1.jpg) no-repeat center left');
                                $('div.video-mid-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/2.jpg) no-repeat center left');
                                $('div.video-end-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/3.jpg) no-repeat center left');

                                // store the last cued item in a cookie
                                $.cookie('zpYouTubeDefault', $.JSON.encode($('#zplayer_input_yt_zplayer').val()), {
                                    path: '/',
                                    expires: 30
                                });

                                // make it active
                                videoControl('on');
                            }

                        }
                    });
                }

                var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
                var videowidth = (Number($('#video_duration').val()) / timeline) * 100;
                var audiowidth = (Number($('#audio_duration').val()) / timeline) * 100;
                $('.video-durationbar').css({
                    width: videowidth + '%'
                });
                $('.jp-progress').css({
                    width: audiowidth + '%'
                });

                $('#timeline_end').text(formatTime(Number($('#video_duration').val())));

                // add the ytthumbs
                $('div.video-start-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/1.jpg) no-repeat center left');
                $('div.video-mid-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/2.jpg) no-repeat center left');
                $('div.video-end-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/3.jpg) no-repeat center left');

                // store the last cued item in a cookie
                $.cookie('zpYouTubeDefault', $.JSON.encode($('#zplayer_input_yt_zplayer').val()), {
                    path: '/',
                    expires: 30
                });

                // make it active
                videoControl('on');
                audioControl('off');
            //}
            var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
            var videowidth = (Number($('#video_duration').val()) / timeline) * 100;
            var audiowidth = (Number($('#audio_duration').val()) / timeline) * 100;
            $('.video-durationbar').css({
                width: videowidth + '%'
            });
            $('.jp-progress').css({
                width: audiowidth + '%'
            });

            $('#timeline_end').text(formatTime(Number($('#video_duration').val())));

            // add the ytthumbs
            $('div.video-start-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/1.jpg) no-repeat center left');
            $('div.video-mid-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/2.jpg) no-repeat center left');
            $('div.video-end-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/3.jpg) no-repeat center left');

            // store the last cued item in a cookie
            $.cookie('zpYouTubeDefault', $.JSON.encode($('#zplayer_input_yt_zplayer').val()), {
                path: '/',
                expires: 30
            });

            // make it active
            videoControl('on');
            audioControl('off');
        /*}, 'json').error(function() {
            alert('oops');
        }); */

    });
                             
    // on play, get the duration of the video
    $('#yt_zplayer').parent().bind('onPlay.rf', function() {
        if($('.video-durationbar').not(':visible')) {
            $('.video-durationbar').show();
            $('#video_mask').children().remove();
            $('.zplayer-controls').hide();
            $('#video_mask').hide();
        }
        
        if($('#zplayer_input_yt_zplayer').val() == 'P_epaFV_Ka0') {
            $('#yt_zplayer').zplayer('soundOn');
        }
                                                                               
        // we want the tube's duration
        var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
        $('#timeline_end').text(formatTime(Number($('#video_duration').val())));
        var videowidth = (Number($('#video_duration').val()) / timeline) * 100;
        var audiowidth = (Number($('#audio_duration').val()) / timeline) * 100;
        $('.video-durationbar').css({
            width: videowidth + '%'
        });
        $('.jp-progress').css({
            width: audiowidth + '%'
        });
    });
    
    $('#allplay').addClass('zplay');
                                
});

var totalDuration = 0;
// function to make video controls active 
function videoControl(state) {
    if(state == 'on') {
        $('#video_controller').addClass('is-active');
        $('#video_controller').siblings('.vol-wrapper').removeClass('disabled');
        //$('#video_mask').hide();
        $('#allplay').addClass('zplay');                                

        if($('#audio_controller').hasClass('is-active')) {
            $('.thisliceneceshared').show();
            $('#jp_option').text($('#jp_option').siblings('ul').children('li:first').find('a').text());
            $('#jp_option').attr('data-option', $('#jp_option').siblings('ul').children('li:first').find('a').attr('data-val'));
            $('#jp_option').attr('data-shared', $('#jp_option').siblings('ul').children('li:first').find('a').attr('data-shared'));
            $('.jp-cart').addClass('allowed');
                                        
            $('.timeline_start').show();
            $('.timeline_end').show();
            $('.timeline-status-wrapper').hide();
            $('.jp-wrap-time').hide();
        }
    } else {
        $('#video_controller').removeClass('is-active');
        $('.thisliceneceshared').hide();
        $('#jp_option').attr('data-option', $('#jp_option').siblings('ul').children('li').not('.thisliceneceshared').first().find('a').attr('data-val'));
        $('#jp_option').attr('data-shared', 0);
        $('#jp_option').text($('#jp_option').siblings('ul').children('li').not('.thisliceneceshared').first().find('a').text());
        $('.jp-cart').addClass('allowed');
                                    
        $('#video_controller').siblings('.vol-wrapper').addClass('disabled');
        //$('#video_mask').show();
        $('#allplay').removeClass('zplay');
        $('.timeline_start').hide();
        $('.timeline_end').hide();
        $('.timeline-status-wrapper').hide();
        $('.jp-wrap-time').show();
        $('#yt_zplayer').zplayer("pause");
    }
}
                            
function audioControl(state) {
   /* if($('#jp_option').text() != '-- / --') {
        $('.jp-cart').addClass('allowed');
    } else {
        $('.jp-cart').removeClass('allowed');
    }*/
    if(state == 'on') {
        $('#audio_controller').addClass('is-active');
        $('#audio_controller').siblings('.vol-wrapper').removeClass('disabled');
        //$('#audio_mask').hide();
        $('#allplay').addClass('jplay');

        if($('#video_controller').hasClass('is-active')) {
            $('.thisliceneceshared').show();
                                        
            $('.timeline_start').show();
            $('.timeline_end').show();
            $('.timeline-status-wrapper').hide();
            $('.jp-wrap-time').hide();
        }
    } else {
        $('#audio_controller').removeClass('is-active');                                                         
        $('#audio_controller').siblings('.vol-wrapper').addClass('disabled');
        $('#allplay').removeClass('jplay');
        $('.timeline_start').hide();
        $('.timeline_end').hide();
        $('.timeline-status-wrapper').hide();
        $('.jp-wrap-time').show();
        $("#jquery_jplayer_1").jPlayer("pause"); 
    }
}

function waitThenPlay() {
    $("#jquery_jplayer_1").jPlayer("unmute");
    $('#audio_offset').val(0);
    $("#jquery_jplayer_1").removeClass('deferred');
    $("#jquery_jplayer_1").jPlayer("play");
}
                            
function sync() {
    //stop both players
    $("#jquery_jplayer_1").jPlayer("stop");  
    $('#yt_zplayer').zplayer('pause');
    totalDuration = setInterval('updateTimeline()', 250);
}
                            
function updateTimeline() {                                     
    var elapsed = Number($('#elapsed').val());
    var offset = $('#audio_offset').val();
    var vidoffset = $('#video_offset').val();
    var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
    
    //console.log('timeline' + timeline);
    var pixelspersecond = timeline / 560;

    var videooffset = pixelspersecond * Number($('#video_offset').val());
    var audiooffset = pixelspersecond * Number($('#audio_offset').val());
    
    // we want the longest duration.
    var true_timeline = 0;
    if((Number($('#audio_duration').val()) + audiooffset) > (Number($('#video_duration').val()) + videooffset)) {
        true_timeline = Number($('#audio_duration').val()) + audiooffset;
    } else {
        true_timeline = Number($('#video_duration').val()) + videooffset;
    }

    if(elapsed < (true_timeline)) {
        // sync up the audio offset
        if($('.timeline-status').width() >= (offset-1) && !$("#jquery_jplayer_1").hasClass('delayed')) {
            $("#jquery_jplayer_1").addClass('delayed');
            $("#jquery_jplayer_1").jPlayer("play");
        }
                                    
        if(Number($('#audio_current_time').val()) < (Number($('#audio_duration').val())-0.5)) {     
        // do nothing...
        } else {
            $("#jquery_jplayer_1").jPlayer("pause");
        }
                                    
        // sync up the video offset
        if($('.timeline-status').width() >= (vidoffset-1) && !$("#yt_zplayer").hasClass('delayed')) {
            
            //console.log('timeline status : ' + $('.timeline-status').width());
            var fff = (Number($('.video-durationbar').width()) + Number(vidoffset-1));
            // console.log(' status : ' + fff);
            
            if($('.timeline-status').width() < fff) {
                $("#yt_zplayer").addClass('delayed');
                $('#yt_zplayer').zplayer("play");
            }
        } 
                                    
        if(Number($('#video_current_time').val()) < (Number($('#video_duration').val()) -0.5)) {     
        // do nothing...
        } else {
            $('#yt_zplayer').zplayer("pause");
        }
                                    
        var videoPosition = (Number(elapsed) / timeline) * 100;

        $('.timeline-status').css('width', videoPosition + '%');
        $('#timeline_start').text(formatTime(elapsed));
                                    
        if($('#video_offset').val() == 0){
            // fake the video time if offset is 0
            if(elapsed <= Number($('#video_duration').val())) {
                $('#vidtime_start').text(formatTime(elapsed));
            } else {
                $('#vidtime_start').text(formatTime(Number($('#video_duration').val())));
            }
        } else {
            $('#vidtime_start').text(formatTime(Number($('#video_current_time').val())));
        }
       
        $('#elapsed').val(elapsed + 0.25);
        $('.aud-current-time').text(formatTime(Number($('#elapsed').val())));
    //console.log(totalDuration + ' running');
    } else {
        //alert('end');
        //console.log(totalDuration);
        
        clearInterval(totalDuration);
        //$('#yt_zplayer').zplayer('player').stopVideo();
        //$('#yt_zplayer').zplayer('player').clearVideo();
        //$('#elapsed').val(0);
        //$("#jquery_jplayer_1").jPlayer("stop");
        $('#allplay').trigger('click');
    //$('#allplay').removeClass('active');
        
    }
} 
                            
// testing queue for synching
var rfPlaylist;
var myPlaylist = [];
$(function() {
    $('.saveMe').find('a').click(function() {
        // we need to save the current snapshot data against the user
        var shareId = $('#edit_share_mode').val();
        var trackId = $('#audio_trackid').val();
        var videoId = $('#zplayer_input_yt_zplayer').val();
        var audio_offset = $('#audio_offset').val();
        var video_offset = $('#video_offset').val();
        var video_duration = $('#video_duration').val();
        var audio_duration = $('#audio_duration').val();
        var audio_volume = $('#audio_volume').val();
        var video_volume = $('#video_volume').val();
        var audio_muted = $('#audio_muted').val();
        var video_muted = $('#video_muted').val();

        $.post('/rf/snapshot', {
            shareid : shareId,
            track : trackId,
            video : videoId,
            audioOffset : audio_offset,
            videoOffset : video_offset,
            videoDuration : video_duration,
            audioDuration : audio_duration,
            videoVolume : video_volume,
            audioVolume : audio_volume,
            audioMuted : audio_muted,
            videoMuted : video_muted
        }, function(data) {
            if(data) {
                $('#editmode_ul').hide();
                $('#edit_share_mode').val(0);
            } else {
                $.jGrowl("We were not able to take a snapshot of yout Audition Settings", {
                    theme: 'error'
                });
                $('#editmode_ul').hide();
                $('#edit_share_mode').val(0);
            }
        });          
    });
        
    $('.jp-cart').click(function() {
        if($(this).hasClass('allowed')) {
            var shared = 0;
            var lic = 0;
            if($('#jp_option').attr('data-option') == 0 && $('#jp_option').attr('data-shared') == 0) {
                shared = 0;
                $('#jp_option').attr('data-option', $('#jp_option').siblings('ul').children('li').not('.thisliceneceshared').first().find('a').attr('data-val'));
                lic = $('#jp_option').attr('data-option');
            } else {
                shared = $('#jp_option').attr('data-shared');
                lic = $('#jp_option').attr('data-option');
            }
            var trackid = $('#audio_trackid').val();
                                        
            switch(Number(shared)) {
                case 1:
                    // we need to save the current snapshot data against the user
                    var shareId = $('#edit_share_mode').val();
                    var trackId = $('#audio_trackid').val();
                    var title = $('.jp-title').find('li:first').html();
                    var videoId = $('#zplayer_input_yt_zplayer').val();
                    var audio_offset = $('#audio_offset').val();
                    var video_offset = $('#video_offset').val();
                    var video_duration = $('#video_duration').val();
                    var audio_duration = $('#audio_duration').val();
                    var audio_volume = $('#audio_volume').val();
                    var video_volume = $('#video_volume').val();
                    var audio_muted = $('#audio_muted').val();
                    var video_muted = $('#video_muted').val();

                    $.post('/rf/snapshot', {
                        shareid : shareId,
                        track : trackId,
                        trackTitle: title,
                        video : videoId,
                        audioOffset : audio_offset,
                        videoOffset : video_offset,
                        videoDuration : video_duration,
                        audioDuration : audio_duration,
                        videoVolume : video_volume,
                        audioVolume : audio_volume,
                        audioMuted : audio_muted,
                        videoMuted : video_muted
                    }, function(data) {
                        if(data) {
                            videoRfToCart(trackid, lic, data);
                        } else {
                            $.jGrowl("We were not able to take a snapshot of yout Audition Settings", {
                                theme: 'error'
                            });
                        }
                    });                
                                           
                    break;
                                                
                default:
                    rfToCart(trackid, lic);
            }
            
        }
        return false;
    });
                                
    //                                $('.jp-progress-inner').hover(function() {
    //                                    // count how many items are in the platlist seeing as how jplayer doesn't do this
    //                                    if($('#audio_duration').val() && $('#video_duration').val()) {
    //                                        $('#audition').show();
    //                                        $('#snapshot').show();
    //                                    }
    //                                }, function() {
    //                                    $('#audition').hide();
    //                                    $('#snapshot').hide();
    //                                });
                                                                                           
    //                                var queued = new jPlayerPlaylist({
    //                                    jPlayer: "#jquery_jplayer_1",
    //                                    cssSelectorAncestor: "#jp_container_1"
    //                                }, myPlaylist, {
    //                                    playlistOptions: {
    //                                        enableRemoveControls: true
    //                                    },
    //                                    solution: 'flash,html',
    //                                    swfPath: "/lib/js/jplayer",
    //                                    supplied: "mp3",
    //                                    wmode: "window",
    //                                    errorAlerts: false,
    //                                    warningAlerts: false
    //                                });
    //                                rfPlaylist = queued;

    $("#jquery_jplayer_1").jPlayer({
        ready: function() {
            if(!$('#audio_trackid').val()) {
                var loadmsg = $('<div></div>').attr('id', 'aud_load_message');
                loadmsg.text('To load a soundtrack');
                $('#audio_mask').append(loadmsg);
                $('#audio_mask').show();
                $('#audio_controller').css({
                    'z-index': 500
                }).removeClass('is-active');
                $('#audio_controller').siblings('.vol-wrapper').addClass('disabled');
            }
        },
        solution: 'flash, html',
        swfPath: "/js/jplayer",
        supplied: "mp3",
        wmode: "window",
        errorAlerts: false,
        warningAlerts: false
    });
                                
    //                                var currentQueued = $.JSON.decode($.cookie('zpQueued'));
    //                                if(currentQueued !== null){
    //                                    $(currentQueued).each(function (i, el) {
    //                                        rfPlaylist.add(el);
    //                                    });
    //                                }
                                
    $.jPlayer.timeFormat.padMin = false;

    // toggle our playlist display
    $('.jp-queue').click(function(){
        var waitondash, waitonq;
        $('a[rel="/mymusic"]').trigger('click');
        if(!$('a[href=#mymusic-dash]').length) {
            waitondash = setInterval(function() {
                //console.log('waiting for mymusic-dash...');
                if($('a[href=#mymusic-dash]').length) {
                    $('a[href=#mymusic-dash]').trigger('click');
                    clearInterval(waitondash);
                //console.log('mymusic-dash cleared');
                }
            }, 5);
        } else {
            $('a[href=#mymusic-dash]').trigger('click');
        }
        
        // if there is no queueditem yet, set an interval
        if(!$('#queueditems').length) {
            waitonq = setInterval(function() {
                //console.log('waiting for queueditems...');
                if($('#queueditems').length) {
                    $('#queueditems').trigger('click');
                    clearInterval(waitonq);
                //console.log('queueditems cleared');
                }
            }, 5);
        } else {
            $('#queueditems').trigger('click');
        }
    });
                                

                                
    $('.jp-volume').toggle(function(){
        $('.jp-vol-wrapper').fadeIn('slow');
    }, function() {
        $('.jp-vol-wrapper').fadeOut('slow');
    });
                                
    // override the playlist default behaviour to hide the title
    $('.jp-title').show();
                                
    $("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event) {
        $('#audio_current_time').val(event.jPlayer.status.currentTime);
    });
    
    $("#jquery_jplayer_1").bind($.jPlayer.event.ended, function(event) {
        $('#allplay').removeClass('active');
    });
                            
    $('#jquery_jplayer_1').bind($.jPlayer.event.loadeddata, function(event) {
        $('.jp-progress-loading').hide();
        $('.jp-controls-mask').hide();
        $('.jp-progress-wrapper').show();
    });
                                
    $("#jquery_jplayer_1").bind($.jPlayer.event.volumechange, function(event) {
        $('#audio_muted').val(event.jPlayer.options.muted);
        $('#audio_volume').val(event.jPlayer.options.volume);                          
    });
                             
    $('.jp-mute').click(function() {
        $('.jp-knob').css({
            left: 0
        });
    });
                                
    $('.jp-unmute').click(function() {
        var shift = Math.round(30*($('#audio_volume').val()));
        $('.jp-knob').css({
            left: shift + 'px'
        });
    });
                            
    $("#jquery_jplayer_1").bind($.jPlayer.event.play, function(event) {
        $('.jp-progress-wrapper').unblock();                           
        $('.jp-controls-mask').show();
                                        
        //$('#audio_duration').val(event.jPlayer.status.duration);
        var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
        //$('.timeline_end').text(formatTime(timeline));
                                      
        // calculate the overall timeline in terms of width
        //var audiowidth = (Number($('#audio_duration').val()) / timeline) * 100;
        var audiowidth = (Number($('#audio_duration').val()) / timeline);
        var videowidth = (Number($('#video_duration').val()) / timeline);
        
        $('.jp-progress').animate({
            width: Math.round((audiowidth * 560), 0) + 'px'
        }, 500, function() {
            $('#jpWaveform').animate({
                width : $('.jp-progress').width() + 'px'
                }, 200);
        });

        
        //        $('.jp-progress').css({
        //            width: audiowidth + '%'
        //        });
        
        $('.video-durationbar').animate({
            width: Math.round((videowidth * 560), 0) + 'px'
        }, 500);
                                      
        //        $('.video-durationbar').css({
        //            width: videowidth + '%'
        //        });
                                      
        $('#allplay').addClass('jplay');
                                                                                
                                                                                                                  
                                        
                                    
        $('.jp-progress-loading').hide();
        $('.jp-controls-mask').hide();
        $('.jp-progress-wrapper').show();
                                        
        //        if(!$('#allplay').hasClass('zplay') && !$('#allplay').hasClass('jplay')) {
        //            audioControl('on');
        //            videoControl('off');
        //        }
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                    
                                
        //CRAIG HERE:          
        //$.jGrowl("Now Playing : " + $.stripslashes(event.jPlayer.status.media.title) ,{theme: 'information'});
        var tmpPlaylist = $.JSON.decode($.cookie('zpPlayRecent'));
        if(null === tmpPlaylist){
            tmpPlaylist = new Array();
            var currentPlay = [event.jPlayer.status.media.track_id];
            array_unshift(tmpPlaylist,currentPlay);
        }else{
            var lastPlayed = parseInt(tmpPlaylist[0]);
            var currentPlay = parseInt([event.jPlayer.status.media.track_id]);
            //  //console.log(lastPlayed);
            //  //console.log(currentPlay);
            if(lastPlayed == currentPlay){
                                            
            //    //console.log('ignored');
            }else{
                array_unshift(tmpPlaylist,[event.jPlayer.status.media.track_id]);
            ////console.log('cookied');
            }
        }
                      
        $.cookie('zpPlayRecent', $.JSON.encode(tmpPlaylist.slice(0, 25)), {
            path: '/',
            expires: 30
        });
        
    // unblock the ui
    //$('.jp-progress-wrapper').unblock();                            
    });               

    // these are our toggle controls
    $('#video_controller').click(function() {
        if($('#allplay').hasClass('active')) {
            $('#allplay').trigger('click');
        }
        if($('#video_controller').hasClass('is-active')) {
            videoControl('off');
        } else {
            videoControl('on');
        }
    });
                                
    $('#audio_controller').click(function() {
        if($('#allplay').hasClass('active')) {
            $('#allplay').trigger('click');
        }
        
        if($('#audio_controller').hasClass('is-active')) {
            audioControl('off');
        } else {
            audioControl('on');
        }
    });
                                
    $('#snapshot').click(function() {                                                                       
        // we need to save the current snapshot data against the user
        var trackId = $('#jp_poster_0').attr('src');
        var title = $('.jp-title').find('li:first').html();
        var videoId = $('#zplayer_input_yt_zplayer').val();
        var audio_offset = $('#audio_offset').val();
        var video_offset = $('#video_offset').val();
        var video_duration = $('#video_duration').val();
        var audio_duration = $('#audio_duration').val();
                                    
        $.post('/rf/snapshot', {
            track : trackId,
            trackTitle: title,
            video : videoId,
            audioOffset : audio_offset,
            videoOffset : video_offset,
            videoDuration : video_duration,
            audioDuration : audio_duration
        }, function(data) {
            if(data) {
                $.jGrowl("A snapshot of your Audition Settings has been saved", {
                    theme: 'success'
                });
            } else {
                $.jGrowl("We were not able to take a snapshot of yout Audition Settings", {
                    theme: 'error'
                });
            }
        });                                   
    });
                                
    //                                playSingleSong: function(songData) {
    //                                if( songData !== null ) {
    //                                    // set the playlist index to -1
    //                                    // this prevents the playlist plugin from playing the next song in the playlist after this song has finished
    //                                    this.playlist.current = -1;
    //
    //                                    // add all 3 versions of the song when setting the media
    //                                    this.jPlayerEl.jPlayer("setMedia", {
    //                                        mp3: songData.song,
    //                                        m4a: songData.song.replace(/(mp3)/g, "m4a"),
    //                                        oga: songData.song.replace(/(mp3)/g, "ogg")
    //                                    }).jPlayer("play", 0);
    //                                }
    //                            }
                                
    $('#allplay').click(function() {
        // calculate our function matrix 
                                    
        if(!$('#audio_trackid').val()) {
            audioControl('off');
        } else {
            $('#aud_load_message').remove();
        }
                                    
        var matrix = 0;
        matrix += ($(this).hasClass('zplay')) ? 1 : 0;
        matrix += ($(this).hasClass('jplay') && $('#audio_trackid').val()) ? 2 : 0;
        matrix += ($(this).hasClass('active')) ? 3 : 0;
                                    
        // switch according to our matrix
        switch(matrix) {
            case 1:
                // play zplayer
                $(this).addClass('active');
                $('#video_controller').css('z-index', 500);
                $('#audio_controller').css('z-index', 500);
                $('.jp-controls-mask').show();
                $('#video_c_mask').show();
                $('#yt_zplayer').zplayer("play");
                break;
                                            
            case 2:
                // play jplayer
                $(this).addClass('active');
                $('#video_controller').css('z-index', 500);
                $('#audio_controller').css('z-index', 500);
                $('.jp-controls-mask').show();
                $('#audio_c_mask').show();
                $("#jquery_jplayer_1").jPlayer("play");
                $('.playthistrack.loaded').addClass('playing');
                break;
                                            
            case 3:
                // play audition
                $('.timeline-status-wrapper').show();
                $(this).addClass('active');
                // rewind both players
                $('#yt_zplayer').zplayer('seekTo', 0);
                $("#jquery_jplayer_1").jPlayer("playHead", 0);
                $('.zp-play-bar').css({
                    width : 0
                });
                $('a.playthistrack').addClass('do-not');
                                                                                        
                $('#video_controller').css('z-index', 500);
                $('#audio_controller').css('z-index', 500);
                $('.jp-controls-mask').show();
                $('#video_c_mask').show();
                $('#audio_c_mask').show();
                $('.jp-play-bar').hide();
                $('.zp-play-bar').hide();

                sync();
                break;
                                            
            case 4:
                // zplayer pause
                $(this).removeClass('active');
                $('.jp-controls-mask').hide();
                $('#video_c_mask').hide();
                $('#video_controller').css('z-index', 11000);
                $('#audio_controller').css('z-index', 11000);
                $('#yt_zplayer').zplayer('pause');
                break;
                                            
            case 5:
                // jplayer pause
                $('.jp-progress-wrapper').unblock(); 
                $(this).removeClass('active');
                $('.jp-controls-mask').hide();
                $('#audio_c_mask').hide();
                $('#video_controller').css('z-index', 11000);
                $('#audio_controller').css('z-index', 11000);
                $("#jquery_jplayer_1").jPlayer("pause");
                $('.playthistrack.loaded').removeClass('playing');
                break;
                                            
            case 6:
                // audition end
                $(this).removeClass('active');
                $("#jquery_jplayer_1").removeClass('delayed');
                $('#yt_zplayer').removeClass('delayed');
                $('.jp-play-bar').show();
                $('.zp-play-bar').show();
                $('.zp-play-bar').css({
                    width : 0
                });
                $('a.playthistrack').removeClass('do-not');

                clearInterval(totalDuration);
                $('.timeline-status-wrapper').hide();
                $('#yt_zplayer').zplayer('seekTo', 0);
                $("#jquery_jplayer_1").jPlayer("playHead", 0);

                $('#yt_zplayer').zplayer('pause');
                $("#jquery_jplayer_1").jPlayer("stop");
                //$("#jquery_jplayer_1").jPlayer("pause");

                //$('#yt_zplayer').zplayer('soundOn');
                //$('#yt_zplayer').zplayer('instance').find('.zplayer-controls').show();
                $('.jp-controls-mask').hide();
                $('#video_c_mask').hide();
                $('#audio_c_mask').hide();
                $('#video_controller').css('z-index', 11000);
                $('#audio_controller').css('z-index', 11000);

                // reset our audition area
                $('#elapsed').val(0);
                $('.timeline-status').css('width', '0%');
                $('#timeline_start').text(formatTime(0));
                $('#vidtime_start').text(formatTime(0));
                break;
                                            
            default:
        // do nothing
        }
    });
});
                         
function calcPercent(oldval, newval) {
    return ((oldval - newval) / oldval) * 100;
} 

$(function() {
    $('#jp_option').die('toggle').toggle(function() {
        $(this).siblings('ul').slideDown('fast');
    }, function() {
        $(this).siblings('ul').slideUp('fast');
    });
                                                
    $('a.licenceclicka').die('click').click(function() {
        $('#jp_option').attr('data-option', $(this).attr('data-val'));
        $('#jp_option').attr('data-shared', $(this).attr('data-shared'));
        $('#jp_option').text($(this).text());
        $('#jp_option').trigger('click');
        if($(this).text() != '-- / --') {
            $('.jp-cart').addClass('allowed');
        } else {
            $('.jp-cart').removeClass('allowed');
        }
        return false;
    });
                                                
//                                                $('#jp_option').siblings('ul').bind('mouseout', function() {
//                                                    $('#jp_option').delay(50).trigger('click');
//                                                });
});

var yt_unit = 0;
var jp_unit = 0;
            /*
$.widget( "custom.catcomplete", $.ui.autocomplete, {
    _renderMenu: function( ul, items ) {
        var self = this,
        currentCategory = "";
        $.each( items, function( index, item ) {
            if ( item.category != currentCategory ) {
                ul.append( "<li class='clearfix ui-autocomplete-category'>" + item.category + "</li>" );
                currentCategory = item.category;
            }
            self._renderItem( ul, item );
        });
    }
});*/
                          
jQuery.support.cors = true;  
                          
$(function() {                            
    // autocomplete
    var autoYT = $.JSON.decode($.cookie('zpYouTubeAuto'));
    if(autoYT === null){
        autoYT = [];
    }
     /*
    $("#youtubeEmbedURL").catcomplete({
        source: autoYT.sort(compareCats)
    }); */
                        
    $(".jp-progress").draggable({ 
        axis: "x", 
        containment: ".jp-block-right", 
        scroll: false,
        start: function(event, ui) {
            $('.jp-seek-bar').hide();
            $('#display_audio_offset').show();
            $('.timeline_start').hide();
            $('.timeline_end').hide();
        },
        drag: function(event, ui) {
            var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
            var pixelspersecond = timeline / 560;
            var videooffset = pixelspersecond * Number(ui.position.left);
            $('#display_audio_offset').find('.current-offset').text(formatTime(videooffset));
        },
        stop: function(event, ui) {
            $('#audio_offset').val(ui.position.left);
            $('.jp-seek-bar').show();
            $('#display_audio_offset').hide();
            $('.timeline_start').show();
            $('.timeline_end').show();
        }
    });
                            
    $(".video-durationbar").draggable({ 
        axis: "x", 
        containment: ".jp-block-right", 
        scroll: false,
        start: function(event, ui) {
            $('.zp-play-bar').hide();
            $('#display_video_offset').show();
            $('.timeline_start').hide();
            $('.timeline_end').hide();
        },
        drag: function(event, ui) {
            var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
            var pixelspersecond = timeline / 560;
            var videooffset = pixelspersecond * Number(ui.position.left);
            $('#display_video_offset').find('.current-offset').text(formatTime(videooffset));
        },
        stop: function(event, ui) {
            $('#video_offset').val(ui.position.left);
            $('.zp-play-bar').show();
            $('#display_video_offset').hide();
            $('.timeline_start').show();
            $('.timeline_end').show();
        }
    });
                        
    $(".vid-knob").draggable({ 
        axis: "x", 
        containment: ".jp-volume-bar", 
        scroll: false,
        start: function(event, ui) {
            if($('#video_muted').val() == 1) {
                $('#yt_zplayer').zplayer('toggleSound');
            }
        },
        drag: function(event, ui) {
            var changeTo = ui.position.left,
            volWidth = 34;

            var level = Math.round(changeTo/volWidth * 100);                                 
            $('#yt_zplayer').zplayer('changeVolume', level);
        },
        stop: function(event, ui) {
            //$('#video_offset').val(ui.position.left);
            var changeTo = ui.position.left,
            volWidth = 34; // static width
            var level = Math.round(changeTo/volWidth * 100);                       
            $('#yt_zplayer').zplayer('changeVolume', level);
        }
    });
                        
    $(".jp-knob").draggable({ 
        axis: "x", 
        containment: ".jp-volume-bar", 
        scroll: false,
        start: function(event, ui) {
            //console.log($('#audio_muted').val());
            if($('#audio_muted').val() === 'true') {
                $('#jquery_jplayer_1').jPlayer('unmute');
            }
        },
        drag: function(event, ui) {
            var changeTo = ui.position.left,
            volWidth = 30; // static width of 30
            var level = Math.round((changeTo/volWidth)*100)/100;                       
            $('#jquery_jplayer_1').jPlayer('volume', level);
        },
        stop: function(event, ui) {
            var changeTo = ui.position.left,
            volWidth = 30; // static width of 30
            var level = Math.round((changeTo/volWidth)*100)/100;                       
            $('#jquery_jplayer_1').jPlayer('volume', level);
        }
    });
                        
    $('.timeline-status-wrapper').click(function(e) {
        //console.log('clicked on timeline');
        // pause both before seeking
        $('#yt_zplayer').zplayer("pause");
        $('#jquery_jplayer_1').jPlayer("pause");
        
        var skipTo = e.pageX - $('.timeline-status-wrapper').offset().left,
        statusWidth = $('.timeline-status-wrapper').width(); 
    
        //console.log('skipTo' + skipTo);
        //console.log('statusWidth' + statusWidth);
        //console.log('move to ' + skipTo / statusWidth);
        
        var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
        
        //console.log('timeline' + timeline);
        var pixelspersecond = timeline / 560;
        
        var videooffset = pixelspersecond * Number($('#video_offset').val());
        var audiooffset = pixelspersecond * Number($('#audio_offset').val());
        
        // we want the longest duration.
        var true_timeline = 0;
        if((Number($('#audio_duration').val()) + audiooffset) > (Number($('#video_duration').val()) + videooffset)) {
            true_timeline = Number($('#audio_duration').val()) + audiooffset;
        } else {
            true_timeline = Number($('#video_duration').val()) + videooffset;
        }
        
        //console.log('video offset : ' + videooffset);
        //console.log('audio offset : ' + audiooffset);

        $('.timeline-status').css({
            width : (skipTo / statusWidth) * 100 + '%'
            });

        $("#yt_zplayer").removeClass('delayed');
        
        $('#elapsed').val((skipTo/560)*timeline);
        if(skipTo >= Number($('#video_offset').val())) {
        
            //if($('#elapsed').val() >= videooffset) {
            
            
            // calc our seekto for the vid
            // we need to calculate the skipTo as if it was offset
            var calc = (skipTo - Number($('#video_offset').val())) / Number($('.video-durationbar').width());
            
            if(calc >= 0.995) {
                //                if($('#yt_zplayer').zplayer("instance").hasClass('zplayer-state-playing')) {
                $('#yt_zplayer').zplayer("pause");
                //                }
                calc = 0;
                $('#yt_zplayer').zplayer('seekTo', calc);
                $("#yt_zplayer").removeClass('delayed');
            //$('#yt_zplayer').zplayer('player').stopVideo();
            //$('#yt_zplayer').zplayer('player').clearVideo();
            } else {
                //$('.jp-title').text('video seekto : ' + calc);
                $('#yt_zplayer').zplayer('seekTo', calc);
            
                //if($('#yt_zplayer').zplayer("instance").hasClass('zplayer-state-paused')) {
                $("#yt_zplayer").addClass('delayed');
                $('#yt_zplayer').zplayer("play");
            }
        } else {
            
            //if($('#yt_zplayer').zplayer("instance").hasClass('zplayer-state-playing')) {
            //$("#yt_zplayer").removeClass('delayed');
            //$('#yt_zplayer').zplayer("pause");
            //}
            //$("#yt_zplayer").addClass('delayed');
            $('#yt_zplayer').zplayer("pause");
            $('#yt_zplayer').zplayer('seekTo', 0);
            ////console.log('called seekto inside vidoffset');
            $("#yt_zplayer").removeClass('delayed');
        //$('#yt_zplayer').zplayer("pause");
        }

    
        if($('#elapsed').val() >= audiooffset) {
            //$('#jquery_jplayer_1').jPlayer("play");
            //            if($('#yt_zplayer').zplayer("instance").hasClass('zplayer-state-paused')) {
            //                $("#yt_zplayer").addClass('delayed');
            //                $('#yt_zplayer').zplayer("play");
            //            }
            // calc our seekto for the vid
            // we need to calculate the skipTo as if it was offset
            var calc = (skipTo - Number($('#audio_offset').val())) / Number($('.jp-seek-bar').width());
            
            if(calc >= 0.995) {
                //if($('#yt_zplayer').zplayer("instance").hasClass('zplayer-state-playing')) {
                $('#jquery_jplayer_1').jPlayer("pause");
                //}
                calc = 0.995;
            }
            //$('.jp-title').text('audio seekto : ' + calc);
            $("#jquery_jplayer_1").addClass('delayed');
            $('#jquery_jplayer_1').jPlayer("playHead", calc*100);
            $('#jquery_jplayer_1').jPlayer("play");
            
        } else {
            
            //if($('#yt_zplayer').zplayer("instance").hasClass('zplayer-state-playing')) {
            //$("#yt_zplayer").removeClass('delayed');
                
            //}
            $("#jquery_jplayer_1").removeClass('delayed');
            $('#jquery_jplayer_1').jPlayer("playHead", 0);
        //$('#jquery_jplayer_1').jPlayer("pause");
        }
    });
    
    //    $('.timeline-status-wrapper').click(function(e) {
    //        var skipTo = e.pageX - $('.timeline-status-wrapper').offset().left,
    //        // we pad the bar's width by 4px to prevent a weird "locking" bug that causes the player to shit itself
    //        statusWidth = $('.timeline-status-wrapper').width() + 4; 
    //        // get our total duration
    //        var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
    //        $("#elapsed").val((skipTo/statusWidth)*timeline);
    //        // calculate the overall timeline in terms of width
    //        var audiowidth = (Number($('#audio_duration').val()) / timeline) * 100;
    //        // gives us the seconds
    //        var pixelspersecond = timeline / 560;
    //        var videooffset = pixelspersecond * Number($('#video_offset').val());
    //        
    //        //alert($("#elapsed").val());
    //        //alert(videooffset);
    //        
    //        // if the skipTo is less than the vido offset, delay.
    //        if(skipTo < Number($('#video_offset').val())) {
    //            $('#yt_zplayer').zplayer("pause");
    //        } else if (skipTo > (Number($('#video_duration').val())*pixelspersecond)) {
    //            $('#yt_zplayer').zplayer("pause");
    //        } else {
    //            $('#yt_player').zplayer('skipTo', skipTo/Number($('#video_duration').val()));
    //        }
    //
    //        
    //        
    //        // need to skipto on both audio and video with offsets added
    //        
    //        //alert((skipTo/statusWidth)*timeline);
    ////        $('#yt_zplayer').zplayer('seekTo', skipTo/statusWidth);
    //    });
                           
    $('#yt_zplayer').parent().bind('onEnd', function() {
        $('#allplay').removeClass('active');
    });

    $('#yt_zplayer').parent().bind('onUpdate', function() {
        $('#video_current_time').val($('#yt_zplayer').zplayer('player').getCurrentTime());
        if($('#allplay').hasClass('active') && $('#allplay').hasClass('jplay') && !$('#allplay').hasClass('zplay') && $('#yt_zplayer').parent().hasClass('zplayer-state-playing')) {
            //$('#jquery_jplayer_1').jPlayer("pause");
            $('#allplay').trigger('click');
            audioControl('off');
            videoControl('on');
            $('#yt_zplayer').zplayer('soundOn');
        }
        
        if(!$('#allplay').hasClass('active') && $('#yt_zplayer').parent().hasClass('zplayer-state-playing')) {
            videoControl('on');
            $('#allplay').trigger('click');
        }
                                                        
        if($('#yt_zplayer').zplayer('player').getVideoBytesLoaded() > -1) {
            var loadedAmount = ($('#yt_zplayer').zplayer('player').getVideoBytesLoaded() / $('#yt_zplayer').zplayer('player').getVideoBytesTotal())  * 100;
            $('.zp-seek-bar').css( 'width', loadedAmount + '%' );
        }
        
        if(!$('#yt_zplayer').parent().hasClass('zplayer-state-buffering') || !$('#yt_zplayer').parent().hasClass('zplayer-state-unstarted')) {
            if(!$('.zp-seek-bar').hasClass('bound')) {
                $('.zp-seek-bar').bind('click', function(e) {
                    //                    if(!$('#allplay').hasClass('active')) {
                    //                        $('#allplay').trigger('click');
                    //                    }
                    
                    //                    var state = $('#yt_zplayer').zplayer('instance').getState();
                    //                    if(state == 'unstarted') {
                    //                        $('#yt_zplayer').zplayer('pause');
                    //                    }
                    var skipTo = e.pageX - $('.zp-seek-bar').offset().left,
                    // we pad the bar's width by 4px to prevent a weird "locking" bug that causes the player to shit itself
                    statusWidth = $('.zp-seek-bar').width() + 4; 
                    $('#yt_zplayer').zplayer('seekTo', skipTo/statusWidth);
                });
                $('.zp-seek-bar').addClass('bound');
            }
        }

        if($('#yt_zplayer').zplayer('player').getCurrentTime() > 0 ) {
            $('.zp-current-time').text(formatTime($('#yt_zplayer').zplayer('player').getCurrentTime()));
            var videoPosition = ($('#yt_zplayer').zplayer('player').getCurrentTime() / $('#yt_zplayer').zplayer('player').getDuration() ) * 100;
            $('.zp-play-bar').css( 'width', videoPosition + '%' );
        }
    });
    
    $('.jp-next').click(function() {
        // is something selected in the results?
        var opentab = $('.tabcontent:visible').attr("id");
        var next, current;
        
        if(opentab == 'mymusic') {
            current = $('#queueditems').find('li.result_track.playing');
        } else {
            current = $('#' + opentab).find('.faketable').find('li.result_track.playing');
        } 
                
        //alert('clicked');
        if(current) {
            next = $(current).next();
            //alert($(next).attr('data-id'));
            if(next && typeof $(next).attr('data-id') !== "undefined") {
                if(opentab == 'mymusic') {
                    $('#queueditems').find('.queued_track_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
                } else {
                    $('#' + opentab).find('.media_track_id_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
                }
            } else {
                if(opentab == 'mymusic') {
                    next = $('#queueditems').find('li.result_track').first();
                    $('#queueditems').find('.queued_track_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
                } else {
                    next = $('#' + opentab).find('.faketable').find('li.result_track').first();
                    $('#' + opentab).find('.media_track_id_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
                }
            }
            
        } else {
            if(opentab == 'mymusic') {
                next = $('#queueditems').find('li.result_track').first();
                $('#queueditems').find('.queued_track_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
            } else {
                next = $('#' + opentab).find('.faketable').find('li.result_track').first();
                $('#' + opentab).find('.media_track_id_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
            }
        }
        
        return false;
    });
    
    $('.jp-previous').click(function() {
        // is something selected in the results?
        var opentab = $('.tabcontent:visible').attr("id");
        var next, current;
        
        if(opentab == 'mymusic') {
            current = $('#queueditems').find('li.result_track.playing');
        } else {
            current = $('#' + opentab).find('.faketable').find('li.result_track.playing');
        } 
        //alert('clicked');
        if(current) {
            next = $(current).prev();
            //alert($(next).attr('data-id'));
            if(next && typeof $(next).attr('data-id') !== "undefined") {
                if(opentab == 'mymusic') {
                    $('#queueditems').find('.queued_track_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
                } else {
                    $('#' + opentab).find('.media_track_id_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
                }
            } else {
                if(opentab == 'mymusic') {
                    next = $('#queueditems').find('li.result_track').last();
                    $('#queueditems').find('.queued_track_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
                } else {
                    next = $('#' + opentab).find('.faketable').find('li.result_track').last();
                    $('#' + opentab).find('.media_track_id_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
                }
            }
            
        } else {
            if(opentab == 'mymusic') {
                next = $('#queueditems').find('li.result_track').last();
                $('#queueditems').find('.queued_track_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
            } else {
                next = $('#' + opentab).find('.faketable').find('li.result_track').last();
                $('#' + opentab).find('.media_track_id_' + $(next).attr('data-id')).find('a.playthistrack').trigger('click');
            }
        }
        
        return false;
    });
     
                            
    $("#youtube_embedder").submit(function() {
        if($('#youtubeEmbedURL').val() != 'YouTube username or URL'  && $('#youtubeEmbedURL').val() != '') {
            // test whether we're querying the data API
            // remove any unwanted children quick
            $('.jp-userdata').children().remove();
        
            // turn off the video and the audio if they're on.
            if($('#allplay').hasClass('active')) {
                $('#allplay').trigger('click');
            };
        
            // if the playbar is min, expand it
            if($('#hideshow').hasClass('open')) {
                $('#hideshow').trigger('click');
            }
        
            // test our input to remove any extraneous characters/params
            //alert($('#youtubeEmbedURL').val());
            // split it at &
            var splitup = $('#youtubeEmbedURL').val().split('&', 1);
            $('#youtubeEmbedURL').val(splitup);
        
            $('.block-yt').block();
        
            // we allow the 25 most recent videos per user max
            var jqxhr = $.get('//gdata.youtube.com/feeds/api/videos?author=' + $('#youtubeEmbedURL').val() + '&max-results=25&v=2&alt=jsonc', 
                function(ydata){
                    // check for FF
                    if(ydata && $.browser.mozilla) {
                        //ydata = eval(ydata);
                        ydata = $.JSON.decode(ydata);
                    };
            
                    if(ydata && ydata.data) {                                      
                        if(Number(ydata.data.totalItems) > 0) {                                           
                            // add the result to our autocomplete
                            autoYT.push({
                                label : $('#youtubeEmbedURL').val(),
                                category : 'Users'
                            });
                                            
                            // use our 'duck-punched' $.unique to strip duplicates
                            autoYT = arrayUniqueByKey(autoYT, 'label');
                            autoYT.sort(compareCats);
                                            
                            $.cookie('zpYouTubeAuto', $.JSON.encode(autoYT), {
                                path: '/',
                                expires: 30
                            });
                                                                                                        
                            $('.jp-progress-wrapper').hide();
                            $('.jp-userdata').width($('.jp-progress-wrapper').outerWidth()).height($('.jp-progress-wrapper').outerHeight()).show();
                            $('.jp-controls-mask').show();
                                                
                            var main = $('<div class="yt-main"></div>');
                            var info = $('<div class="yt-info"></div>');
                                            
                            var closer = $('<a href="javascript:;" class="yt-closer">Close</a>');
                            closer.click(function() {
                                // restore our controls
                                $('.jp-userdata').hide();
                                $('.jp-progress-wrapper').show();
                                $('.jp-controls-mask').hide();
                                return false;
                            });
                            main.append(closer);
                                            
                            var detail = Number(ydata.data.totalItems);
                            if(detail > 1) {
                                detail += ' videos';
                            } else {
                                detail += ' video';
                            }
                            main.append('<h2 class="clearfix">We found ' + detail + ' by "' + $('#youtubeEmbedURL').val() + '":<h2>');
                                                                                                                                    
                            main.append('<a class="prev browse left"></a>');
                                            
                            var wrapper = $('<div class="yt-scrollable"></div>');
                            var list = $('<div class="yt-items"></div>');
                            var a;
                                            
                            $.each(ydata.data.items, function(i, item) {
                                a = '<div><a class="yt-cueVid" href="javascript:;" data-ref="#' + (i + 1) + '" rel="' + item.id + '"><img src="' + item.thumbnail.sqDefault + '" alt=""/></a>';
                                a += '<p><b>' + item.title + '</b>';
                                a += '<br/><span>Category : ' + item.category + '</span>';
                                a += '<br/><span>Duration : ' + formatTime(item.duration) + '</span>';
                                a += '<br/><span class="yt-tip">Click now to cue this video</span>';
                                a += '</p></div>';
                                list.append(a);
                            });
                                            
                            wrapper.append(list);                                            
                            main.append(wrapper);
                            main.append('<a class="next browse right"></a>');
                                            
                            // add in our info
                            info.append('<p>Cue the video of your choice to the player by clicking the thumbnail.</p>');
                            info.append('<p>The Close icon will revert to the Audio player.</p>');
                                            
                            main.append(info);                                           
                            var total = Number(ydata.data.totalItems) <= 25 ? Number(ydata.data.totalItems) : 25;
                            if(total > 1) {
                                if(total == 25) {
                                    total = '25 results (we only show the latest 25)';
                                } else {
                                    total += ' results';
                                }
                            } else {
                                total += ' result';
                            }
                            main.append('<div class="yt-totals clearfix">Video <b>#1</b> of ' + total + '</div>');
                            $('.jp-userdata').append(main);

                            $(".yt-scrollable").scrollable({
                                circular : false,
                                mousewheel: false
                            });
                                            
                            // bind our click handler
                            $('a.yt-cueVid').click(function() {
                                var cue = $(this).attr('rel');
                                $('#youtubeEmbedURL').val(cue);
                                $('#yt_zplayer').zplayer('cue', cue);
                                                
                                // add the result to our autocomplete
                                autoYT.push({
                                    label : cue,
                                    category : 'Videos'
                                });
                                            
                                // use our 'duck-punched' $.unique to strip duplicates
                                autoYT = arrayUniqueByKey(autoYT, 'label');
                                autoYT.sort(compareCats);
                                            
                                $.cookie('zpYouTubeAuto', $.JSON.encode(autoYT), {
                                    path: '/',
                                    expires: 30
                                });
                                                
                                // restore our controls
                                $('.jp-userdata').hide();
                                $('.jp-progress-wrapper').show();
                                $('.jp-controls-mask').hide();
                                return false;
                            });
                                            
                            $('a.yt-cueVid').hover(function() {
                                $(this).parent().find('span.yt-tip').show();
                            }, function() {
                                $(this).parent().find('span.yt-tip').hide();
                            });
                                            
                            var api = $(".yt-scrollable").data("scrollable");
                            $('div.yt-main').find('a.browse').click(function() {
                                var idx = api.getIndex();
                                var ix = api.getItems().get(idx);
                                $('.yt-totals').find('b').text($(ix).find('a.yt-cueVid').attr('data-ref'));
                            });
                            $('.block-yt').unblock();
                                                                                        
                        } else {
                            // add the result to our autocomplete
                            autoYT.push({
                                label : $('#youtubeEmbedURL').val(),
                                category : 'Videos'
                            });
                                            
                            // use our 'duck-punched' $.unique to strip duplicates
                            autoYT = arrayUniqueByKey(autoYT, 'label');
                            autoYT.sort(compareCats);
                                            
                            $.cookie('zpYouTubeAuto', $.JSON.encode(autoYT), {
                                path: '/',
                                expires: 30
                            });
                                            
                            $('#yt_zplayer').zplayer('cue', $('#youtubeEmbedURL').val());
                            $('.block-yt').unblock();
                        }
                    } else {
                        // add the result to our autocomplete
                        autoYT.push({
                            label : $('#youtubeEmbedURL').val(),
                            category : 'Videos'
                        });
                                            
                        // use our 'duck-punched' $.unique to strip duplicates
                        autoYT = arrayUniqueByKey(autoYT, 'label');
                        autoYT.sort(compareCats);
                                            
                        $.cookie('zpYouTubeAuto', $.JSON.encode(autoYT), {
                            path: '/',
                            expires: 30
                        });
                                            
                        $('#yt_zplayer').zplayer('cue', $('#youtubeEmbedURL').val());
                        $('.block-yt').unblock();
                    }
                })
            .error(function() {
                alert('oops');
                $('.block-yt').unblock();
            }); 
        }
        return false;
    });
                            
});


