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


var totalDuration = 0;
                            
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
    var pixelspersecond = timeline / 483;

    var videooffset = pixelspersecond * Number($('#video_offset').val());
    var audiooffset = pixelspersecond * Number($('#audio_offset').val());
    
    // we want the longest duration.
    var true_timeline = 0;
    if((Number($('#audio_duration').val()) + audiooffset) > (Number($('#video_duration').val()) + videooffset)) {
        true_timeline = Number($('#audio_duration').val()) + audiooffset;
    } else {
        true_timeline = Number($('#video_duration').val()) + videooffset;
    }

    if($('#yt_zplayer').zplayer('player').getVideoBytesLoaded() > -1) {
        var loadedAmount = ($('#yt_zplayer').zplayer('player').getVideoBytesLoaded() / $('#yt_zplayer').zplayer('player').getVideoBytesTotal());
        //console.log('loaded ' + loadedAmount);
        if(isNaN(loadedAmount)) {
            loadedAmount = 0;
        }
        //console.log((487 * loadedAmount) + 'px')
        $('#overlayer').css('width', (487 * loadedAmount) + 'px' );
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
        $('#big_play').trigger('click');
        //$('#allplay').removeClass('active');
        
    }
} 
    
    
    
$(function() {
    $('#yt_zplayer').zplayer({
        height: 260,
        width: 477
    });
        
    $("#jquery_jplayer_1").jPlayer({
        ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: mp3_to_load
            });
        },
        solution: 'flash, html',
        swfPath: "/lib/js/jplayer",
        supplied: "mp3",
        wmode: "window",
        errorAlerts: false,
        warningAlerts: false
    });
    
    $('#yt_zplayer').parent().bind('onEnd', function() {
        $('#big_play').removeClass('active playing');
    });
        
    $("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event) {
        $('#audio_current_time').val(event.jPlayer.status.currentTime);
    });
          
    $("#jquery_jplayer_1").bind($.jPlayer.event.ended, function(event) {
        $('#big_play').removeClass('active playing');
    });       
        
    $('#big_play').show();
    $('#jquery_jplayer_1').bind($.jPlayer.event.ready, function(event) {
        var wf = $('<img id="jpWaveform" src="' + waveform_to_load + '" width="100%" style="display: none;position: absolute; height:78px; left: 0;"/>');
        
        //$('#audio_duration').val(event.jPlayer.status.duration);
        var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
        //$('.timeline_end').text(formatTime(timeline));
        
        $('div.video-start-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/1.jpg) no-repeat center left');
        $('div.video-mid-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/2.jpg) no-repeat center left');
        $('div.video-end-thumb').css('background', 'url(https://img.youtube.com/vi/' + $('#zplayer_input_yt_zplayer').val() + '/3.jpg) no-repeat center left');

                                      
        // calculate the overall timeline in terms of width
        //var audiowidth = (Number($('#audio_duration').val()) / timeline) * 100;
        var audiowidth = (Number($('#audio_duration').val()) / timeline);
        var videowidth = (Number($('#video_duration').val()) / timeline);
        
        $('.jp-progress').animate({left : $('#audio_offset').val()}, 500);
        
        $('.jp-progress').animate({
            width: Math.round((audiowidth * 483), 0) + 'px'
        }, 500, function() {
            
            $('.jp-progress').prepend(wf);
            $('#timeline_end').text(formatTime(timeline));
//            wf.animate({
//                width: Math.round((audiowidth * 483), 0) + 'px'
//            }, 100);
            wf.fadeIn('fast');
        });

        
//        $('.jp-progress').css({
//            width: audiowidth + '%'
//        });
        $('.video-durationbar').animate({left : $('#video_offset').val()}, 500);
        
        $('.video-durationbar').animate({
            width: Math.round((videowidth * 483), 0) + 'px'
        }, 500);
                                      
//        $('.video-durationbar').css({
//            width: videowidth + '%'
//        });
                                      
        //$('#big_play').addClass('jplay');
        
        
        
        
        
        
        
        
        
        
        
        
        
//        $('#yt_zplayer').zplayer('instance').find('.zplayer-controls').hide();
//        var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
//        var videowidth = (Number($('#video_duration').val()) / timeline) * 100;
//        var audiowidth = (Number($('#audio_duration').val()) / timeline);
//        //$('.video-durationbar').css({width: videowidth + '%'});
//            
//        $('.jp-progress').css({
//            left: $('#audio_offset').val() + 'px'
//            });
//        $('.jp-progress').animate({
//            width: Math.round((audiowidth * 483), 0) + 'px'
//        }, 1000, function() {
//            var wf = $('<img id="jpWaveform" src="' + waveform_to_load + '" width="1px" style="position: absolute; height:78px; left: 0;"/>');
//            $('.jp-progress').prepend(wf);
//            $('#timeline_end').text(formatTime(timeline));
//            wf.animate({
//                width: Math.round((audiowidth * 483), 0) + 'px'
//            }, 100);
//        });

            

            
    });
                                
                               
    //                                $('#big_play').toggle(function() {
    //                                    $('#yt_zplayer').zplayer('play');
    //                                    $("#jquery_jplayer_1").jPlayer("play");
    //                                    $(this).addClass('playing');
    //                                }, function() {
    //                                    $('#yt_zplayer').zplayer('pause');
    //                                    $("#jquery_jplayer_1").jPlayer("pause");
    //                                    $(this).removeClass('playing');
    //                                });
                                
    $('#big_play').toggle(function() {
        $(this).addClass('active');
        $(this).addClass('playing');
        $('.timeline-status').show();
        //$.jGrowl("Starting Audition : <br/><b style='font-weight: normal;'>Please note player controls are disabled during audtions</b>", {theme: 'information'});

        // rewind both players
        $('#yt_zplayer').zplayer('seekTo', 0);
        $("#jquery_jplayer_1").jPlayer("playHead", 0);
        $('.aud-current-time').text(formatTime(Number($('#elapsed').val())));

        // sync up the seeks
        //                                    $("#jquery_jplayer_1").bind($.jPlayer.event.seeked + ".audition", function(event) {
        //                                        alert('jplayer Seek');
        //                                    });
        //                                jQuery.tubeplayer.defaults.onSeek = function() {
        //                                    alert('yt seek');
        //                                };
        $('#yt_zplayer').zplayer('soundOff');
        //$('#yt_zplayer').zplayer('play');
        $('#yt_zplayer').zplayer('instance').find('.zplayer-controls').hide();
        //$('.jp-controls-mask').show();
        //$('.jp-controls li a.jp-play').css({
        //    'z-index' : 50000
        //});
        //$('.jp-controls li a.jp-pause').css({
        //    'z-index': 50000
        //});


        sync();

    }, function() {
        $(this).removeClass('active');
        $(this).removeClass('playing');
        $('.timeline-status').hide();
                                        
        $("#jquery_jplayer_1").removeClass('delayed');
        $('#yt_zplayer').removeClass('delayed');

        clearInterval(totalDuration);

        $('#yt_zplayer').zplayer('seekTo', 0);
        $("#jquery_jplayer_1").jPlayer("playHead", 0);
        

        $('#yt_zplayer').zplayer('pause');
        $("#jquery_jplayer_1").jPlayer("pause");

        //$('#yt_zplayer').zplayer('soundOn');
        //$('#yt_zplayer').zplayer('instance').find('.zplayer-controls').show();
        //$('.jp-controls-mask').hide();
        //$('.jp-controls li a.jp-play').css({'z-index': 500});
        //$('.jp-controls li a.jp-pause').css({'z-index': 500});

        // reset our audition area
        $('#elapsed').val(0);
        $('.aud-current-time').text(formatTime(Number($('#elapsed').val())));
        $('.timeline-status').css('width', '0%');
        $('#timeline_start').text(formatTime(0));
    });
            
    $('#big_play').click(function() {
        $(this).addClass('firstclick');
    });
        
    $('#video_holder_sharing').hover(function() {
        $('a.firstclick').show();
    }, function() {
        $('a.firstclick').hide();
    });
    
    $('#overlayer').click(function(e) {
        if(!$('#big_play').hasClass('active')) {
            return false;
        }
        // pause both before seeking
        $('#yt_zplayer').zplayer("pause");
        $('#jquery_jplayer_1').jPlayer("pause");
        
        var skipTo = e.pageX - $('.jp-progress-inner').offset().left,
        statusWidth = $('.jp-progress-inner').width(); 
        
        var timeline = Number($('#audio_duration').val()) + Number($('#video_duration').val());
        
        //console.log('timeline' + timeline);
        var pixelspersecond = timeline / 483;
        
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

        $('.timeline-status').css({width : (skipTo / statusWidth) * 100 + '%'});

        $("#yt_zplayer").removeClass('delayed');
        
        $('#elapsed').val((skipTo/483)*timeline);
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

});
