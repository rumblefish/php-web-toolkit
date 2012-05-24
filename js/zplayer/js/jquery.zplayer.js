/*!
 * zPlayer - a jQuery YouTube Chromeless Player Plugin
 * http://www.blissfulthroes.com/zplayer
 * 
 * @version: 1.0
 * @requires jQuery 1.6.4+ 
 *
 * Copyright (c) 2011 Rory Cottle (rory@blissfulthroes.com)
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html 
 *   
 *   Tested in FF8, Safari, Opera, Chrome, IE 9 - 7
 *   TODO : IE 7 doesn't register click events on the seekBar
 */
(function($) {
    
    var zplayer,
    zinstances = {},
    methods,
    getError,
    settings,
    interval,
    logIndex = 0,
    version = '1.0';
    
    zplayer = {
        
        defaults : {
            width  : 560, // width of the player (or false to use the source element's width)
            height : 315, // height of the player (or false to use the source element's height)
            volume : 70, // initial volume level
            autohide : true, // hide controls on mouseout
            autoplay : false, // play cued video on start
            automute : false, // start muted
            draggableBars : false, // use ui.draggable for the seekBar and volume
            identifier : 'zplayer', // used to generate instance ids
            theme : 'zplayer', // used to generate the css prefix used for classes
            linked_form : false,
            // flash params
            params : { 
                allowScriptAccess: 'always',
                wmode: 'transparent'
            }
        },
        
        // log a message to the console
        logMessage : function(id, msg) {
            if(!window.console || !window.console.log) {
                return;
            }
            if(!logIndex) {
                console.log('JQUERY.ZPLAYER -> Version ' + version + ' : "Starting Log"');
            }
            
            logIndex++;
            var out = 'JQUERY.ZPLAYER Entry ' + logIndex + ' -> Message from #' + id + ' : "' + msg + '"';
            console.log(out);
        },
        
        // logs an error to the console
        logError : function(id, msg) {
            if(!window.console || !window.console.log) {
                return;
            }
            if(!logIndex) {
                console.log('JQUERY.ZPLAYER -> Version ' + version + ' : "Starting Log"');
            }
            logIndex++;
            var out = 'JQUERY.ZPLAYER Entry ' + logIndex + ' -> an Error has occurred in #' + id + ' : "' + msg + '"';
            console.log(out);
        }, 

        call : function(element, method, arguments) {
            return methods[method].apply(element, arguments);
        },
        
        // get a stripped and clean videoId
        getVideoId : function(value) {
                
            var videoId = value.replace("https://youtu.be/", '');
            videoId = videoId.replace("http://youtu.be/", '');
            videoId = videoId.replace("https://www.youtube.com/watch?v=", '');
            videoId = videoId.replace("http://www.youtube.com/watch?v=", '');
            
            videoId = videoId.replace(/[^a-z0-9_\-]/ig,'');
            
            return videoId;
        },
        
        // get the players state based on the state code returned from the jsAPI
        getState : function(state) {
            var ret = '';
            switch(state) {
                case -1:
                    ret = 'unstarted';
                    break;
                    
                case 0:
                    ret = 'ended';
                    break;
                
                case 1:
                    ret = 'playing';
                    break;
                    
                case 2:
                    ret = 'paused';
                    break;
                    
                case 3:
                    ret = 'buffering';
                    break;
                    
                case 5:
                    ret = 'cued';
                    break;
                    
                default:
                    ret = 'error';
            }            
            return ret;
        },
        
        // checks whether needle is found in haystack
        foundIn : function(needle, haystack) {
            return (new RegExp('^(?:' + haystack.join('|') + ')$').test(needle));  
        },
        
        // show formatted time
        showTime : function(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            return ((h > 0 ? h + ":" : "") + (m > 0 ?
                (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s); 
        }
    };
    
    getError = function(error) {
        alert(error);
    };
    
    // all our internal methods
    methods = {
        // builds the sucker
        init : function(options) {
            // build main settings before element iteration
            settings = $.extend(zplayer.defaults, options);

            // iterate over matching elements and build players for each
            this.each(function(idx) {
                var $this = $(this),                
                instanceId = $this.attr('id') || settings.identifier + idx,
                playerWidth = settings.width || $this.outerWidth(),
                playerHeight = settings.height || $this.outerHeight();
                
                if(zinstances[instanceId]) {
                    return this;
                }
                
                // store a copy of our original in its parrent
                $(this).parent().data('zplayer_instance_' + instanceId, $(this).clone());
                
                var $instance = $this.wrap('<div id="zplayer_' + instanceId + '" class="' + settings.theme + '-player"></div>').parent(),
                $errorMessage = $('<div class="' + settings.theme + '-error-message"></div>'),
                $controlBar = $('<div class="' + settings.theme + '-controls"></div>'), 
                $inputInput = $('<input class="' + settings.theme + '-video-id" type="hidden" id="zplayer_input_' + instanceId + '" value=""/>'),
                $playControl, 
                $muteControl, 
                $seekBar, 
                $barWrapper, 
                $volumeBar, 
                $loadBar, 
                $progressBar, 
                $volumeLevelBar, 
                $volumeWrapper, 
                $durationText, 
                $currentText,
                $grip,
                $volumeGrip,
                $timer;
                
                // our $viewArea goes here
                $instance.append($errorMessage);
                
                var initialVideoId = zplayer.getVideoId($this.attr('href'));
                $inputInput.val(initialVideoId);
                $instance.append($inputInput);
                
                // set minimum height and width (16:9 as suggested by YouTube
                playerWidth = (playerWidth > 256) ? playerWidth : 256;
                playerHeight = (playerHeight > 144) ? playerHeight : 144;
                
                // our anchor will proxy for the player
                $this.attr('id', instanceId);
                
                $instance.width(playerWidth).height(playerHeight).css({
                    overflow : 'hidden'
                });
                
                // check for position or set the default of relative
                if (!/relative|absolute|fixed/i.test($this.css('position'))) {
                    $instance.css('position', 'relative');
                } else {
                    $instance.css('position', $this.css('position'));
                }
                
                $controlBar.width(playerWidth);
                $instance.append($controlBar);
                
                // before adding our controls, lets create some namespaced events we can bind to
                $instance.bind('onChangeState.zplayer', function() {});
                
                $instance.bind('onEnd.zplayer', function() {});
                
                $instance.bind('onError.zplayer', function(e, msg) {});
                
                $instance.bind('onStyle.zplayer', function(e, css) {
                    $instance.css(css);
                });
                
                $instance.bind('onDestroy.zplayer', function() {
                    $instance.destroy();
                });
                
                $instance.bind('onTogglePlay.zplayer', function() {
                    $instance.togglePlay();
                });
                
                $instance.bind('onPlay.zplayer', function() {
                    $instance.play();
                });
                
                $instance.bind('onPause.zplayer', function() {
                    $instance.pause();
                });
                
                $instance.bind('onToggleSound.zplayer', function() {
                    $instance.toggleSound();
                });
                
                $instance.bind('onSoundOff.zplayer', function() {
                    $instance.soundOff();
                });
                
                $instance.bind('onSoundOn.zplayer', function() {
                    $instance.soundOn();
                });
                
                $instance.bind('onVolumeChange.zplayer', function(e, position) {
                    $instance.changeVolume(position);
                });
                
                $instance.bind('onSeek.zplayer', function(e, seekPosition) {
                    $instance.seekTo(seekPosition);
                });
                
                $instance.bind('onUpdate.zplayer', function() {
                    $instance.update();
                });
                
                $instance.bind('onCue.zplayer', function() {
                    var videoId = $instance.find('input.' + settings.theme + '-video-id').val();
                    //$instance.player.stopVideo();
                    $instance.pause();
                    $durationText.text(' / 00:00');
                    $currentText.text('00:00');
                    $instance.player.cueVideoById(zplayer.getVideoId(videoId));
                });
                
                try {
                    // initialise the chromeless player (version 3)
                    swfobject.embedSWF(
                        'https://www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=' + instanceId,
                        instanceId, 
                        playerWidth, 
                        playerHeight, 
                        '8', 
                        null, 
                        null, 
                        settings.params, 
                        {
                            id: instanceId
                        },
                        function(e){
                            var player = document.getElementById(instanceId);
                            $instance.player = player;
                        });
                } catch(error) {
                    $instance.error('SWFObject failed to create a SWF instance');
                }

                var control_inner = $('<div class="' + settings.theme + '-controls-wrapper"></div>').appendTo($controlBar);

                // play/pause button
                $playControl = $('<a/>', {
                    href: 'javascript:;',
                    'class': settings.theme + '-toggle-play',
                    text: 'Play',
                    title: 'Play',
                    click: function() {
                        $instance.trigger('onTogglePlay');
                        return false;
                    }
                }).appendTo(control_inner);
                
                $volumeWrapper = $('<div class="' + settings.theme + '-volume-wrapper"></div>').appendTo(control_inner);
                                 
                // mute button
                $muteControl = $('<a/>', {
                    href: 'javascript:;',
                    'class': settings.theme + '-toggle-sound',
                    text: 'Volume',
                    title: 'Mute',
                    click: function() {
                        $instance.trigger('onToggleSound');
                        return false;
                    }
                }).appendTo($volumeWrapper);
                                
                $volumeBar = $('<div/>', {
                    'class': settings.theme + '-volume-bar',
                    click: function(e) {
                        var changeTo = e.pageX - $volumeBar.offset().left,
                        volWidth = $volumeBar.outerWidth();
                        
                        var level = Math.round(changeTo/volWidth * 100);                       
                        var newgrippos = changeTo - $volumeGrip.outerWidth();
                        
                        if(newgrippos < 0) {
                            newgrippos = 0;
                        }
                        
                        $volumeGrip.css('left', newgrippos + 'px');
                        $instance.trigger('onVolumeChange', [level]);
                    }
                }).appendTo($volumeWrapper);
                
                $volumeWrapper.hover(function() {
                    if(!$muteControl.hasClass(settings.theme + '-muted')) {
                        $volumeBar.stop(true, true).show().animate({
                            width: '60px'
                        }, 100);
                    }
                }, function() {
                    $volumeBar.stop(true, true).delay(500).animate({
                        width: '0px'
                    }, 300, function() {
                        $(this).hide();
                    });
                }); 
                
                // seek/progress bar
                $seekBar = $('<div/>', {
                    'class': settings.theme + '-seek-bar',
                    click: function(e) {
                        var skipTo = e.pageX - $seekBar.offset().left,
                        // we pad the bar's width by 4px to prevent a weird "locking" bug that causes the player to shit itself
                        statusWidth = $seekBar.width() + 4; 
                        $instance.trigger('onSeek', [skipTo/statusWidth]);
                    }
                }).prependTo($controlBar);

                $barWrapper = $('<div class="' + settings.theme + '-bar-wrapper"></div>').appendTo($seekBar);
                $loadBar = $('<div class="' + settings.theme + '-loaded"></div>').appendTo($barWrapper);
                $progressBar = $('<div class="' + settings.theme + '-progress"></div>').appendTo($barWrapper);
                $grip = $('<div class="' + settings.theme + '-grip"></div>').appendTo($barWrapper);
                $volumeLevelBar = $('<div class="' + settings.theme + '-volume-level"></div>').appendTo($volumeBar);
                $volumeGrip = $('<div class="' + settings.theme + '-handle"></div>').appendTo($volumeLevelBar);
                                
                // use draggables?
                if($.ui && settings.draggableBars) {
                    if($.ui.draggable) {
                        $volumeGrip.draggable({
                            axis : 'x',
                            containment : $volumeBar,
                            cursorAt: {
                                right: 0, 
                                top: '50%'
                            },
                            start: function(event, ui) {
                                $volumeWrapper.trigger('mouseover');
                            },
                            drag: function(event, ui) {
                                $volumeWrapper.trigger('mouseover');
                                var newpos = ui.position.left;

                                var volWidth = $volumeBar.width() - $volumeGrip.outerWidth()
                                if(ui.position.left > volWidth) {
                                    ui.position.left = volWidth;
                                }
                          
                                var level = Math.round(newpos/volWidth * 100);
                                if(level < 0) {
                                    level = 0;
                                }
                                if(level > 100) {
                                    level = 100;
                                }
                                $instance.trigger('onVolumeChange', [level]);
                            },
                            stop : function(event, ui) {
                                $volumeWrapper.trigger('mouseout');
                            }
                        });
                        
                        $grip.draggable({
                            axis : 'x',
                            containment : $seekBar,
                            cursorAt: {
                                right: 0, 
                                top: '50%'
                            },
                            drag: function(event, ui) {
                                $progressBar.hide();
                            },
                            stop: function(event, ui) {           
                                var newpos = ui.position.left;

                                if(ui.position.left > $seekBar.width()) {
                                    ui.position.left = $seekBar.width();
                                }
                          
                                var level = newpos/$seekBar.width();

                                if(level >= 1) {
                                    level = 0.99;
                                }

                                $instance.trigger('onSeek', [level]);
                                $progressBar.fadeIn('slow');
                            }
                        });
                    }
                }
                               
                // finally, add our duration and cuurent time
                $timer = $('<div class="' + settings.theme + '-timer"></div>').appendTo(control_inner);
                $currentText = $('<span class="' + settings.theme + '-current"></span>').appendTo($timer);
                $durationText = $('<span class="' + settings.theme + '-duration"></span>').appendTo($timer);
                $durationText.text(' / 00:00');
                $currentText.text('00:00');
                                
                // check whether the height of the player is less than the $controlBar
                var controlbarHeight = $controlBar.outerHeight();
                if(controlbarHeight > $instance.height()) {
                    $instance.height(controlbarHeight);
                    settings.autohide = true;
                }

                if(settings.autohide) {
                    // set the initial position
                    $controlBar.css({
                        bottom : '-' + controlbarHeight + 'px'
                    });

                    // add our hoverstate to autohide the controlbar
                    $instance.hover(function() {
                        $controlBar.stop(true, true).animate({
                            bottom : '0px'
                        }, 300);
                    }, function() {
                        $controlBar.stop(true, true).delay(500).animate({
                            bottom : '-' + controlbarHeight + 'px'
                        }, 300);
                    });
                }
                                                       
                // required by the YoyTube jsAPI
                onYouTubePlayerReady = function(element) {

                    var playerId = decodeURIComponent(element);
                    var thisplayer = document.getElementById(playerId);
                    var obj = $(thisplayer).parent();
                     
                    var state = zplayer.getState(thisplayer.getPlayerState());
                    // check for errors
                    thisplayer.addEventListener("onError", function(error) {
                        //console.log(error);
                    });
                    
                    
                    obj.addClass(settings.theme + '-state-' + state); 
                    // set the initial vol
                    thisplayer.setVolume(settings.volume);
                    
                    if(settings.volume <= 50) {
                        obj.find('.' + settings.theme + '-toggle-sound').addClass(settings.theme + '-low');
                    };
                    // generate our initial vol level
                    obj.find('.' + settings.theme + '-volume-level').css({
                        width : thisplayer.getVolume() + '%'
                    });
                    
                    if(settings.automute) {
                        obj.trigger('onSoundOff');
                    }
                    
                    if(settings.autoplay) {
                        obj.trigger('onPlay');
                    }
                    
                    interval = setInterval(function(){
                        obj.trigger('onUpdate');
                    }, 250);
    		  
                    obj.trigger('onCue');
                };
                
                // extend $instance to have internal methods
                $.extend($instance, {
                    
                    error : function(error) {
                        zplayer.logError($this.attr('id'), error);
                        $instance.addClass(settings.theme + '-state-error');
                        $instance.trigger('onError', [error]);
                        $instance.find('#' + instanceId).hide();
                        $errorMessage.text(error).show();
                        return;
                    },
                    
                    getState : function() {
                        try {
                            return zplayer.getState($instance.player.getPlayerState());
                        } catch (error) {
                            $instance.error('No video loaded');
                        }
                    },
                    
                    togglePlay : function() {                                              
                        if($playControl.hasClass(settings.theme + '-playing') ) {
                            $instance.trigger('onPause');
                        } else {
                            // the button will only trigger the play event if the previous state was paused (preventa double trigger)
                            if($instance.getState() == 'pause') {
                                $instance.trigger('onPlay');
                            } else {
                                $instance.play();
                            }
                        }
                        return false;
                    },
                    
                    play : function() {
                        try {
                            $instance.player.playVideo();
                            $playControl.removeClass(settings.theme + '-paused').addClass(settings.theme + '-playing').text('Pause');
                        } catch (error) {
                            $instance.error('The video could not be played');
                        }
                    },
                    
                    pause : function() {
                        try {
                            $instance.player.pauseVideo();
                            $playControl.removeClass(settings.theme + '-playing').addClass(settings.theme + '-paused').text('Play');
                        } catch (error) {
                            $instance.error('The video could not be paused');
                        }
                    },
                    
                    toggleSound : function() {
                        if($muteControl.hasClass(settings.theme + '-muted') ) {
                            $instance.trigger('onSoundOn');
                        } else {
                            $instance.trigger('onSoundOff');
                        }
                        return false;
                    },

                    // mute the video
                    soundOff : function() {
                        try {
                            $instance.player.mute();
                            $muteControl.addClass(settings.theme + '-muted').text('Mute Off'); 
                            $volumeBar.hide();
                        } catch (error) {
                            $instance.error('The sound could not be muted');
                        }
                    },  

                    // unmute
                    soundOn : function() {
                        try {
                            $instance.player.unMute();
                            $muteControl.removeClass(settings.theme + '-muted').text('Mute');
                            $volumeWrapper.trigger('mouseover');
                            $volumeBar.show();
                        } catch (error) {
                            $instance.error('The sound could not be turned on');
                        }
                    },
                    
                    changeVolume : function(level) {
                        try {
                            var newPosition = level;
                            $instance.player.setVolume(level);
                            $volumeLevelBar.css({
                                width : level + '%'
                            });
                                                        
                            if(level <= 50) {
                                $muteControl.addClass(settings.theme + '-low');
                            } else {
                                $muteControl.removeClass(settings.theme + '-low');
                            }
                            if($muteControl.hasClass(settings.theme + '-muted') ) {
                                $instance.trigger('onSoundOn');
                            }
                        } catch (error) {
                            $instance.error('The sound volume could not be changed');
                        }
                    },
                    
                    //Seek to a position in the video
                    seekTo : function(seekPosition) {
                        try {
                            var seekToPosition = Math.round($instance.player.getDuration() * seekPosition);
                            $instance.player.seekTo(seekToPosition, false);
                        } catch(error) {
                            $instance.error('Seeking to the new position failed');
                        }
                    },
                    
                    destroy : function() {
                        zplayer.logMessage($this.attr('id'), 'Instance destroyed');
                        var original = $(this).parent().data('zplayer_instance_' + instanceId);
   
                        $(original).insertBefore($instance).css('visibility', 'visible');
                        $instance.remove();
                        $(original).unbind('.zplayer');
                        
                        $(original).parent().removeData('zplayer_instance_' + instanceId);
                        
                        delete zinstances[instanceId];
                        return $(original);
                    },
                    
                    update : function() {
                        try {
                            if($instance.player && $instance.player.getDuration()) {
                                // get our current state
                                var state = zplayer.getState($instance.player.getPlayerState());
                                $durationText.text(' / ' + zplayer.showTime($instance.player.getDuration()));
                                                                
                                // check whether the status has changed                    
                                if(!zplayer.foundIn(settings.theme + '-state-' + state, $instance.attr('class').split(/\s+/))) {
                                    // state has changed
                                    $instance.trigger('onChangeState');
                                    // remove all other state classes
                                    $instance.removeClass(settings.theme + '-state-unstarted ' + settings.theme + '-state-ended ' + settings.theme + '-state-playing ' + settings.theme + '-state-paused ' + settings.theme + '-state-cued ' + settings.theme + '-state-error').addClass(settings.theme + '-state-' + state);
                                    //  + settings.theme + '-state-buffering '
                                    
                                    if(state == 'playing') {
                                        $instance.trigger('onPlay');
                                    } else if (state == 'ended') {
                                        $instance.trigger('onPause');
                                        $instance.trigger('onEnd');
                                    }
                                }

                                if($instance.player.getVideoBytesLoaded() > -1) {
                                    var loadedAmount = ($instance.player.getVideoBytesLoaded() / $instance.player.getVideoBytesTotal())  * 100;
                                    $loadBar.css( 'width', loadedAmount + '%' );
                                    $instance.addClass(settings.theme + '-state-buffering');
                                } else {
                                    $instance.removeClass(settings.theme + '-state-buffering');
                                }

                                if($instance.player.getCurrentTime() > 0 ) {
                                    $currentText.text(zplayer.showTime($instance.player.getCurrentTime()));
                                    var videoPosition = ($instance.player.getCurrentTime() / $instance.player.getDuration() ) * 100;
                                    $grip.css('left', $progressBar.width());
                                    $progressBar.css( 'width', videoPosition + '%' );
                                }
                            }
                        } catch (error) {
                            $instance.error('No video loaded');
                        }
                    }                   
                });
                
                zinstances[instanceId] = $instance;
                
                // test the state of the player to see no errors were encountered
                // NOTE : this causes kak, leave it out
               //$instance.getState();
            });
        },
        
        // set css
        css : function(option) {           
            return this.each(function() {
                $(this).parent().trigger('onStyle', [option]);
            });
        },
        
        // returns the first matching $instance - Always use the instanceId - this allows us to bind against it without having to call parent()
        instance : function() {
            //return this.parent();
            return zinstances[this.attr('id')];
        },
        
        // return a handle on the actual player object
        player : function() {
            var p = zinstances[this.attr('id')];
            return p.player;
        },
        
        // function fired when the play/pause button is hit
        togglePlay : function() {
            return this.each(function() {
                $(this).parent().trigger('onTogglePlay');
            });
        },

        // play the video
        play : function() {
            return this.each(function() {
                $(this).parent().trigger('onPlay');
            });
        },
        
        // pause the video
        pause : function() {
            return this.each(function() {
                $(this).parent().trigger('onPause');
            });
        },
        
        // toggle the sound
        toggleSound : function() {
            return this.each(function() {
                $(this).parent().trigger('onToggleSound');
            });
        },
        
        // turn the sound on
        soundOn : function() {
            return this.each(function() {
                $(this).parent().trigger('onSoundOn');
            });
        },
        
        // turn the sound off
        soundOff : function() {
            return this.each(function() {
                $(this).parent().trigger('onSoundOff');
            });
        },
        
        // set the volume between 0-100
        changeVolume : function(volume) {
            return this.each(function() {
                $(this).parent().trigger('onVolumeChange', [volume]);
            });
        },
        
        // seekTo a new position (0 - 100)
        seekTo : function(seek) {
            return this.each(function() {
                $(this).parent().trigger('onSeek', [seek]);
            });
        },
        
        // destroy the player and restore the source element
        destroy : function() {
            return this.each(function() {
                $(this).parent().trigger('onDestroy');
            });
        },
        
        // cue a video by its video id
        cue : function(videoId) {
            return this.each(function() {              
                var p = $(this).parent('.' + settings.theme + '-player');
                p.find('input.' + settings.theme + '-video-id').val(zplayer.getVideoId(videoId));
                p.trigger('onCue');
            });
        }               

    };

    // exposed zplayer methods
    $.fn.zplayer = function(method) {
        
        if(methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('zplayer does not support a "' + method + '" method');
        }       
    };
    
})(jQuery);

