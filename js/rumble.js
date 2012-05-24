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


/**functions **/
// $.unique only cleans up an array of DOM elements to contain no duplicates
// This 'duck-punch' to the jQuery core library extends this to standard strings and numbers too
// Duck-punch? whats that?
// … if it walks like a duck and talks like a duck, it’s a duck, right? 
// So if this duck is not giving you the noise that you want, 
// you’ve got to just punch that duck until it returns what you expect.
//(function($){
// 
//    var _old = $.unique;
// 
//    $.unique = function(arr){
// 
//        // do the default behavior only if we got an array of elements
//        if (!!arr[0].nodeType){
//            return _old.apply(this,arguments);
//        } else {
//            // reduce the array to contain no dupes via grep/inArray
//            return $.grep(arr,function(v,k){
//                return $.inArray(v,arr) === k;
//            });
//        }
//
//    };
//})(jQuery);

/*
 * base64.js - Base64 encoding and decoding functions
 *
 * See: http://developer.mozilla.org/en/docs/DOM:window.btoa
 *      http://developer.mozilla.org/en/docs/DOM:window.atob
 *
 * Copyright (c) 2007, David Lindquist <david.lindquist@gmail.com>
 * Released under the MIT license
 */
var searchXHRREQ = false;
var searchXHRREQIndex = 0;

function togglePlaylistRow(rowID, tableCell, elem, callback) {
    if(!callback) {
        callback = false;
    }
    if($('#' + tableCell).length == 0) {
        $(elem).append('<ul class="clearfix" style="display:none;" id="'+tableCell+'"></ul>');
    }
        
    if ($('#' + tableCell).is(":visible")) {
        $('#' + tableCell).fadeOut('slow');
        $('#' + tableCell).parents('li.tr').removeClass('expanded');
        if(callback) {
            callback.call();
        }
        return false;
    } else {
        $('.playlistrow').slideUp('slow').removeClass('expanded');
        if ($('#' + tableCell).is(":empty")) {
            $('#' + tableCell).html('<li><div class="clearfix rf-main-loader"></div></li>');
            $('#' + tableCell).fadeIn('slow');
            $('#' + tableCell).parents('li.tr').addClass('expanded');
            //ok get the data!!!!
            $.get('/playlist/tracks/id/' + rowID + '/all/true', function (data) {
                $('#' + tableCell).html(data.output);
                if(callback) {
                    callback.call();
                }
            }, 'json');
        } else {
            $('#' + tableCell).parents('li.tr').addClass('expanded');
            if(callback) {
                $('#' + tableCell).fadeIn('slow', function() {
                    callback.call();
                });
                
            } else {
                $('#' + tableCell).fadeIn('slow');
            }
        }
        
        return false;
    }
}

function strpos (haystack, needle, offset) {
    var i = (haystack+'').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}

if (typeof btoa == 'undefined') {
    function btoa(str) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var encoded = [];
        var c = 0;
        while (c < str.length) {
            var b0 = str.charCodeAt(c++);
            var b1 = str.charCodeAt(c++);
            var b2 = str.charCodeAt(c++);
            var buf = (b0 << 16) + ((b1 || 0) << 8) + (b2 || 0);
            var i0 = (buf & (63 << 18)) >> 18;
            var i1 = (buf & (63 << 12)) >> 12;
            var i2 = isNaN(b1) ? 64 : (buf & (63 << 6)) >> 6;
            var i3 = isNaN(b2) ? 64 : (buf & 63);
            encoded[encoded.length] = chars.charAt(i0);
            encoded[encoded.length] = chars.charAt(i1);
            encoded[encoded.length] = chars.charAt(i2);
            encoded[encoded.length] = chars.charAt(i3);
        }
        return encoded.join('');
    }
}

if (typeof atob == 'undefined') {
    function atob(str) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var invalid = {
            strlen: (str.length % 4 != 0),
            chars:  new RegExp('[^' + chars + ']').test(str),
            equals: (/=/.test(str) && (/=[^=]/.test(str) || /={3}/.test(str)))
        };
        if (invalid.strlen || invalid.chars || invalid.equals)
            throw new Error('Invalid base64 data');
        var decoded = [];
        var c = 0;
        while (c < str.length) {
            var i0 = chars.indexOf(str.charAt(c++));
            var i1 = chars.indexOf(str.charAt(c++));
            var i2 = chars.indexOf(str.charAt(c++));
            var i3 = chars.indexOf(str.charAt(c++));
            var buf = (i0 << 18) + (i1 << 12) + ((i2 & 63) << 6) + (i3 & 63);
            var b0 = (buf & (255 << 16)) >> 16;
            var b1 = (i2 == 64) ? -1 : (buf & (255 << 8)) >> 8;
            var b2 = (i3 == 64) ? -1 : (buf & 255);
            decoded[decoded.length] = String.fromCharCode(b0);
            if (b1 >= 0) decoded[decoded.length] = String.fromCharCode(b1);
            if (b2 >= 0) decoded[decoded.length] = String.fromCharCode(b2);
        }
        return decoded.join('');
    }
}

function arrayMerge(args) {
    args  = Array.prototype.slice.call(arguments);
    var o = { };
    for(var i = 0; i < args.length; ++i)
        for(var j = 0; j < args[i].length; ++j)
            o[args[i][j].name] = args[i][j].value;
    return o;
}

function arrayExpand(o) {
    var a = [ ];
    for(var p in o)
        if(o.hasOwnProperty(p))
            a.push({
                name: p, 
                value: o[p]
            });
    return a;
}

// merges 2 arrays of objects, only unique elements preserved
//function arrayCombine(arr1, arr2) {
//    return arrayExpand(arrayMerge(arr1, arr2));
//}

function arrayCombine(arr1, arr2) {
    var arr3 = [];
    for(var i in arr1){
        var shared = false;
        for (var j in arr2)
            if (arr2[j].name == arr1[i].name) {
                shared = true;
                break;
            }
        if(!shared) arr3.push(arr1[i])
    }
    arr3 = arr3.concat(arr2);
    
    return arr3;
}


function regDropKicks(){
    /*
    $('select.limit').dropkick({
        theme: 'limit',
        width: '20',
        change: function (value, label) {
            this.trigger('change');
        }
    });

    $('select.searchselect').dropkick({
        theme: 'black',
        change: function (value, label) {
            this.trigger('change');
        }
    });
    *//*
    $('select.licenceselect, select.playlistlicenceselect').dropkick({
        theme: 'licenceselect',
        width: '150',
        change: function (value, label) {
            this.trigger('change');
        }
    });*/

}

// removes duplicates in an array of objects by key property
function arrayUniqueByKey(targetArr, key, sortFunc) {
    var arr = {};

    for ( i=0; i < targetArr.length; i++ ) {
        arr[targetArr[i][key]] = targetArr[i];
    }

    targetArr = new Array();
    for ( key in arr ) {
        targetArr.push(arr[key]);
    }
    
    return targetArr;
}

// use as autoYT.sort(compareCats);
function compareCats(a, b) {
    var nameA = a.category.toLowerCase( );
    var nameB = b.category.toLowerCase( );
    if (nameA < nameB) {
        return -1
    }
    if (nameA > nameB) {
        return 1
    }
    return 0;
}


(function($) {
    $.stripslashes = function (str) {
        str = str.replace(/\\'/g,'\'');
        str = str.replace(/\\"/g,'"');
        str = str.replace(/\\\\/g,'\\');
        str = str.replace(/\\0/g,'\0');
        return str;
    };
})(jQuery);

function videoRfToCart(trackid, licenceid, vidShareId){
    $('#cartshower').html('<img src="/themes/rumblefish/img/loader-round.gif">');
    $.post('/cart/add/track/' + encodeURIComponent(trackid + ':' + licenceid),'vidShareId=' + vidShareId,  function (data) {
        if (data.error) {
            $.jGrowl(data.error,{
                theme: 'error'
            });
        } else {
            $('#cartshower').html('<span id="cart_total" class="cart_total_holder bluetxt"></span>');
            $('.cart_total_holder').html(data.total);
            $('.loading-cart').removeClass('loading-cart');
            //            $.jGrowl('<strong>Success:</strong> The track has been added to your cart',{
            //                theme: 'success'
            //            });
            if($('#cart > .content').is(":visible")){
                $('#cart > #cartshower').trigger('click');
            }
            if ($('.mymusic-cart').length > 0) {
                
                if ( $('.mymusictabs li a[href="#mymusic-cart"]').hasClass("current")) {
                    $('.mymusic-cart').html('<div class="clearfix rf-main-loader"></div>');
                    $('.mymusic-cart').load('/checkout/cart');
                }
                
            }
        }
    }, 'json');
}

function array_unshift(/* assumes at least 1 argument passed - the array */){
    var i=arguments.length;
    while(--i!==0){
        arguments[0].unshift(arguments[i]);
    }
    return arguments[0].length;
}

// new editable custom input
$.editable.addInputType('control', {
    /* create input element */
    element : function(settings) {
        settings.onblur = 'cancel';
        var button1 = $('<button class="Delete">Delete</button>');
        var button2 = $('<button class="NewPlaylist">New Playlist</button>');
        $(this).append(button1);
        $(this).append(button2);
        return(this);
    },
    content : function(string, settings, original) {
    /* do nothing */
    },
    plugin : function(settings, original) {
        var form = this;
     
        $("button:submit", form).bind('click', function() {
            alert('test');
            return(false);
        });
    }
});

/** set all elements with class projectNameEdit as jeditable **/
function setEditables() {
    $('.projectNameEdit').editable('/rf/renameproject', {
        //    type: 'control',
        submit  : 'Save',
        cancel  : 'Cancel',
        indicator : 'Renaming...',
        event : 'click',
        onblur : 'cancel',
        style   : 'inherit',
        cssclass : 'editable',
        tooltip   : 'Click to Rename'
    });
}

function loadTrack(media_id, track, artist, mp3) {
   
    // turn off edit share if its on
    $('#edit_share_mode').val(0);
    $('#editmode_ul').hide();
    
    if($('.jp-progress').not(':visible')) {
        $('.jp-progress').show();
    }
    if($('#aud_load_message')) {
        $('#aud_load_message').remove();
        $('#audio_mask').hide();
    }

    // load the new track
    $('#audio_trackid').val(media_id);

    $('#jpWaveform').remove();
    
    var src = $('#audio_trackid').val();
    $.ajax({
        url: '/rfSDK/rfAudioData.php',
        type: 'post',
        data: 'id=' + media_id,
        dataType: 'json',
        success: function (data) {
            var wf = '<img id="jpWaveform" src="'+ data.image + '" width="1" style="width: 1px; z-index: 1750; position: absolute; height:78px;"/>';
            $('.jp-progress').prepend(wf);

            $("#jquery_jplayer_1").jPlayer("setMedia", {
                mp3: data.track
            });
            $('.jp-title').find('ul').html('<li>' + $.stripslashes(track) + '<br/>By ' + $.stripslashes(artist) + '</li>');

            //videoControl('off');
            audioControl('on');
        }
    });

//    var wf = '<img id="jpWaveform" src="/media/mp3/wave/' + src + '.png" width="1" style="width: 1px; z-index: 1750; position: absolute; height:78px;"/>';
//    $('.jp-progress').prepend(wf);
//
//    //$('#audio_duration').val(toSeconds(duration));
//    $("#jquery_jplayer_1").jPlayer("setMedia", {
//        mp3: mp3
//    });
//    //wf.animate({width : $('.jp-progress').width() + 'px'}, 200);
//    $('.jp-title').find('ul').html('<li>' + $.stripslashes(track) + '<br/>By ' + $.stripslashes(artist) + '</li>');

    //videoControl('off');
//    audioControl('on');
//$('#allplay').trigger('click');
}



function addToPlayerQue(media_id, track, artist, mp3, poster, play, jq_el) {
    // turn off edit share if its on
    $('#edit_share_mode').val(0);
    $('#editmode_ul').hide();
    
    if($('.jp-progress').not(':visible')) {
        $('.jp-progress').show();
    }
    if($('#aud_load_message')) {
        $('#aud_load_message').remove();
        $('#audio_mask').hide();
    }

    if(play) {

        // we're in audition
        if($('#allplay').hasClass('zplay') && $('#allplay').hasClass('active')) {
            if($('#allplay').hasClass('jplay') && $('#allplay').hasClass('active')) {
                $('#allplay').trigger('click');
            }
            videoControl('off');
        }
        // is this the same track, or a different track?
        if($('#audio_trackid').val()) {
            // track loaded already
            if($('#audio_trackid').val() == media_id) {
                // the track is already loaded
                if($(jq_el).hasClass('playing')) {
                    // the track is already playing, so pause it now
                    $(jq_el).removeClass('playing');
                    $('#allplay').trigger('click');
                } else {
                    // the track is paused, so play it
                    $(jq_el).addClass('playing');
                    $('#allplay').trigger('click');
                }
            } else {
                // block the UI
                $('.jp-progress-wrapper').block(); 
                // different track entirely
                $('.result_track.playing').removeClass('playing');
                // are there any tracks playing at the moment?
                if($('.playthistrack.playing').length > 0) {
                    // stop the player
                    $('#allplay').trigger('click');
                }
                $('.playthistrack').removeClass('playing').removeClass('loaded');
                
                // load the new track
                $('#audio_trackid').val(media_id);
                $('#audio_offset').val(0);
                $('.jp-progress').animate({left : 0}, 500);
                $('#video_offset').val(0);
                $('.video-durationbar').animate({left : 0}, 500);
                
                
                $(jq_el).parent().parent().parent('li').addClass('playing');
                $(jq_el).addClass('playing').addClass('loaded');
                
                $('#jpWaveform').remove();


                var src = $('#audio_trackid').val();
                
                $.ajax({
                    url: '/rfSDK/rfAudioData.php',
                    type: 'post',
                    data: 'id=' + media_id,
                    dataType: 'json',
                    success: function (data) {
                        var wf = '<img id="jpWaveform" src="'+ data.image + '" width="1" style="width: 1px; z-index: 1750; position: absolute; height:78px;"/>';
                        $('.jp-progress').prepend(wf);

                        $('#audio_duration').val(toSeconds($(jq_el).attr('data-length')));
                        $("#jquery_jplayer_1").jPlayer("setMedia", {
                            mp3: data.track
                        });
                        if($.stripslashes(track).length >= 40) {
                            track = track.substr(0, 40) + '...';
                        } else {
                            track = $.stripslashes(track);
                        }
                        if($.stripslashes(artist).length >= 26) {
                            artist = artist.substr(0, 26) + '...';
                        } else {
                            artist = $.stripslashes(artist);
                        }

                        $('.jp-title').find('ul').html('<li>' + track + '<br/>By ' + artist + '</li>');

                        videoControl('off');
                        audioControl('on');
                        $('#allplay').trigger('click');

                    }
                });
            }
        } else {
            // block the UI
            //$('.jp-progress-wrapper').block(); 
            // no track loaded at all
            $('#audio_trackid').val(media_id);
            $(jq_el).parent().parent().parent('li').addClass('playing');
            $(jq_el).addClass('playing').addClass('loaded');
            $('#audio_duration').val(toSeconds($(jq_el).attr('data-length')));
            $('.jp-duration').fadeIn('fast');

            $('#jpWaveform').remove();

            var src = $('#audio_trackid').val();

            //$('#testmp3').load('/rfSDK/rfAudioData.php?id='+media_id);
            $.ajax({
                    url: '/rfSDK/rfAudioData.php',
                    type: 'post',
                    data: 'id=' + media_id,
                    dataType: 'json',
                    success: function (data) {
                        var wf = '<img id="jpWaveform" src="'+ data.image + '" width="1" style="width: 1px; z-index: 1750; position: absolute; height:78px;"/>';
                        $('.jp-progress').prepend(wf);

                        $("#jquery_jplayer_1").jPlayer("setMedia", {
                            mp3: data.track
                        });

                        if($.stripslashes(track).length >= 40) {
                                track = track.substr(0, 40) + '...';
                            } else {
                                track = $.stripslashes(track);
                            }
                            if($.stripslashes(artist).length >= 26) {
                                artist = artist.substr(0, 26) + '...';
                            } else {
                                artist = $.stripslashes(artist);
                            }

                            $('.jp-title').find('ul').html('<li>' + track + '<br/>By ' + artist + '</li>');

                        videoControl('off');
                        audioControl('on');
                        $('#allplay').trigger('click');
                    }
            });
        }
        
        var tmpPlaylist = $.JSON.decode($.cookie('zpPlayRecent'));
        if(null === tmpPlaylist){
            tmpPlaylist = new Array();
            var currentPlay = [media_id];
            array_unshift(tmpPlaylist,currentPlay);
        }else{
            var lastPlayed = parseInt(tmpPlaylist[0]);

            if(lastPlayed == currentPlay){
            }else{
                array_unshift(tmpPlaylist,[media_id]);
            }
        }
                      
        $.cookie('zpPlayRecent', $.JSON.encode(tmpPlaylist.slice(0, 25)), {
            path: '/',
            expires: 30
        });

    }else{
        //not play just queue
        var tmpPlaylist = $.JSON.decode($.cookie('zpQueued'));
        if(null === tmpPlaylist){
            tmpPlaylist = new Array();
        }
        var newPlaylist = new Array();
        newPlaylist[0] = media_id;
        var jic = 1;
        $(tmpPlaylist).each(function (i,v) {
            if((jic == 1 && v != media_id) || jic > 1){
                newPlaylist[jic] = v;
                jic++;
            }
        });
        newPlaylist.slice(0, 25)
        // console.log(newPlaylist);
        $.cookie('zpQueued', $.JSON.encode(newPlaylist), {
            path: '/', 
            expires: 0
        });       

        if($('.mymusic-dash').length > 0){
            $('.mymusic-dash').load('/mymusic/projects');
        }
    }
}

function registerToolTips() {
   
    /*   $('span[tooltip]').each(function () {
        $(this).qtip({
            content: $(this).attr('tooltip'), // Use the tooltip attribute of the element for the content
            style: {
                name: 'blue',
                color: 'black',
                border: {
                    color: '#28A9DF'
                }
            },
            position: {
                corner: {
                    target: 'topCenter',
                    tooltip: 'bottomCenter'
                }
            }
        });
    });
    
    $('a[tooltip]').each(function () {
        $(this).qtip({
            content: $(this).attr('tooltip'), // Use the tooltip attribute of the element for the content
            style: {
                name: 'blue',
                color: 'black',
                border: {
                    color: '#28A9DF'
                }
            },
            position: {
                corner: {
                    target: 'topRight',
                    tooltip: 'bottomLeft'
                }
            }
            
        });
    });*/
    $('label[tooltip],li[tooltip]').each(function () {
        $(this).qtip({
            content: $(this).attr('tooltip'), // Use the tooltip attribute of the element for the content
            style: {
                name: 'blue',
                color: 'black',
                border: {
                    color: '#28A9DF'
                }
            },
            position: {
                corner: {
                    target: 'topRight',
                    tooltip: 'bottomLeft'
                }
            }
            
        });
    });
    $('.mmaptooltip').each(function () {
        $(this).qtip({
            content: $(this).attr('tooltip'), // Use the tooltip attribute of the element for the content
            style: { 
                name: 'dark' // Inherit from preset style
            },
            position: {
                corner: {
                    target: 'topRight',
                    tooltip: 'bottomLeft'
                }
            }
            
        });
    });
}

function registerLimitHtml(elem) {
   
    $(elem + ' .limit').live('change', function () {
        var reqReq = $(this).attr('data-rev').replace('{page}', '1');
        reqReq = reqReq.replace('/limit/', '/limit/' + $(this).val() + '/oldlimit/');
        $(elem).html('<div class="clearfix rf-main-loader"></div>');
        $.get(reqReq, function (data) {
            $(elem).html(data);
        });
    });

    $(elem + ' .tablepager').live('click', function (event) {
        event.preventDefault();
        if ($(this).hasClass('active')) {
            return false;
        }
        var hr = $(this).attr('href');
        $(elem).html('<div class="clearfix rf-main-loader"></div>');
        $.get(hr, function (data) {
            $(elem).html(data);
        });
    });
    
    $(elem + ' a.sortable').live('click', function (event) {
        event.preventDefault();
        var hr = $(this).attr('href');
        $(elem).html('<div class="clearfix rf-main-loader"></div>');
        $.get(hr, function (data) {
            $(elem).html(data);
        });
    });
}
function registerLimit(elem) {
   
    $(elem + ' .limit').live('change', function () {
        var reqReq = $(this).attr('data-rev').replace('{page}', '1');
        reqReq = reqReq.replace('/limit/', '/limit/' + $(this).val() + '/oldlimit/');
        $(elem).html('<div class="clearfix rf-main-loader"></div>');
        $.get(reqReq, function (data) {
            if (data.status === 'success') {
                $(elem).html(data.output);
            }
        }, 'json');
    });
    $(elem + ' .tablepager').live('click', function (event) {
        event.preventDefault();
        if ($(this).hasClass('active')) {
            return false;
        }
        var hr = $(this).attr('href');
        $(elem).html('<div class="clearfix rf-main-loader"></div>');
        $.get(hr, function (data) {
            if (data.status === 'success') {
                $(elem).html(data.output);
            }
        }, 'json');
    });
    $(elem + ' a.sortable').live('click', function (event) {
        event.preventDefault();
        var hr = $(this).attr('href');
        $(elem).html('<div class="clearfix rf-main-loader"></div>');
        $.get(hr, function (data) {
            if (data.status === 'success') {
                $(elem).html(data.output);
            }
        }, 'json');
    });
}

function removeCart(key) {
    $('.mymusic-cart').html('<div class="clearfix rf-main-loader"></div>');
          
    $.ajax({
        url: '/cart/remove/playlist',
        type: 'post',
        data: 'playlist=' + key,
        dataType: 'json',
        success: function (json) {
            $('.success, .warning, .attention, .information').remove();
            if (json.total) {
                $('.cart_total_holder').html(json.total);
                     $('.mymusic-cart').load('/checkout/cart');
            }
        }
    });
}

function removeWishlist(key) {
    $('.mymusic-dash').html('<div class="clearfix rf-main-loader"></div>');
    $.ajax({
        url: '/wishlist/remove/playlist',
        type: 'post',
        data: 'playlist=' + key,
        dataType: 'json',
        success: function (json) {
            $('.mymusic-dash').load('/mymusic/projects');
            
        }
    });
}

function removeTrack(trackID, key) {
   
    $.ajax({
        url: '/cart/remove/track',
        type: 'post',
        data: 'track=' + trackID + '&parent=' + key,
        dataType: 'json',
        success: function (json) {
            $('.success, .warning, .attention, .information').remove();
            if (json.total) {
                $('.cart_total_holder').html(json.total);
                if ($('#cart').hasClass('active')) {
                    $.ajax({
                        url: '/checkout/cart/update',
                        dataType: 'json',
                        success: function (json) {
                            if (json.output) {
                                $('#cart .content').html(json.output);
                            }
                        }
                    });
                }
            }
        }
    });
}

function removeWishlistTrack(trackID, key) {
    $('.mymusic-dash').html('<div class="clearfix rf-main-loader"></div>');
   
    
    $.ajax({
        url: '/wishlist/remove/track',
        type: 'post',
        data: 'track=' + trackID + '&parent=' + key,
        dataType: 'json',
        success: function (json) {
            $('.mymusic-dash').load('/mymusic/projects');
           
        }
    });
}

function removeTrackCart(trackID, key) {
   
    $('#cartpageholder').html('<div class="clearfix rf-main-loader"></div>');
    $.ajax({
        url: '/cart/remove/track',
        type: 'post',
        data: 'track=' + trackID + '&parent=' + key,
        dataType: 'json',
        success: function (json) {
            $('.success, .warning, .attention, .information').remove();
            if (json.total) {
                $('.cart_total_holder').html(json.total);
                if ($('#cart').hasClass('active')) {
                    $.ajax({
                        url: '/checkout/cart/update',
                        dataType: 'json',
                        success: function (json) {
                            if (json.output) {
                                $('#cart .content').html(json.output);
                            }
                        }
                    });
                }
                $('#cartpageholder').parent().load('/checkout/cart');
            }
        }
    });
}



var octblXHR = false;
var octblRI = 0;
function loadOccassionTable(gp) {
   
    $('#mygrid').html('<div class="clearfix rf-main-loader"></div>');
    if (octblXHR) {
        octblXHR.abort();
    }
    //octblXHR = $('#mygrid').load('occassion/fetch/?id='+gp);
    octblXHR = $.ajax({
        url : '/occassion/fetch/id/' + gp,
        dataType: "html",
        ocTableRequest: ++octblRI,
        success: function (data, status) {
            $('#mygrid').html(data);
        }
    });
}

var sfxtblXHR = false;
var sfxtblRI = 0;
function loadSfxTable(gp) {
   
    $('#sfxresults').html('<div class="clearfix rf-main-loader"></div>');
    if (sfxtblXHR) {
        sfxtblXHR.abort();
    }
    //octblXHR = $('#mygrid').load('occassion/fetch/?id='+gp);
    sfxtblXHR = $.ajax({
        url : '/sfx/fetch/id/' + gp,
        dataType: "html",
        sfxTableRequest: ++sfxtblRI,
        success: function (data, status) {
            $('#sfxresults').html(data);
        }
    });
}


var mmtblXHR = false;
var mmtblRI = 0;
function mappicker_ondrop(x,y,item) {
    if(theglower){
        theglower.remove();
        theglower = false;
    }
    
    if(item){
        item.cpicon.attr('stroke-opacity',0);
    }
    $('#playlistid').html('<div class="clearfix rf-main-loader"></div>');
    if (mmtblXHR) {
        mmtblXHR.abort();
    }


    alert('Value X: '+ Math.round(x));
    alert('Value Y: '+ Math.round(y));

    $('#playlistid').html('<div class="rf-main-loader"></div>');
    $('#playlistid').load('/demo-ajax/moodslist_table.php',{ 'x': Math.round(x), 'y':  Math.round(y)});

    //octblXHR = $('#mygrid').load('occassion/fetch/?id='+gp);
//    mmtblXHR = $.ajax({
//        url : '/moods/map/x/' + Math.round(x) + '/y/' + Math.round(y),
//        dataType: "json",
//        sfxTableRequest: ++mmtblRI,
//        success: function (data, status) {
//            $('#playlistid').html(data.output);
//        }
//    });
}

/**Document Ready functionality**/
$().ready(function () {

    $('select.limit').livequery(function () {
        $(this).dropkick({
            theme: 'limit',
            width: '20',
            change: function (value, label) {
                this.trigger('change');
            }
        });
    });
/*
    $('select.searchselect').livequery(function () {
        $(this).dropkick({
            theme: 'black',
            change: function (value, label) {
                this.trigger('change');
            }
        });
    });*/

    $("ul.navtabs").tabs('div.tabcontent', {
        //effect: 'fade',
        onBeforeClick: function(event, i) {
            // get the pane to be opened
            var pane = this.getPanes().eq(i);
            
            
            if (pane.is(":empty")) {
                pane.html('<div class="clearfix rf-main-loader"></div>');
                pane.load(this.getTabs().eq(i).attr("rel"));
            }
           
//            if (pane.is(":empty") && pane.hasClass("zp_ct")) {
//                pane.html('<div class="clearfix rf-main-loader"></div>');
//                pane.load(this.getTabs().eq(i).attr("rel"));
//            }else if (!pane.hasClass("zp_ct")){
//                pane.addClass("zp_ct");
//            }
            
            window.location.hash = this.getTabs().eq(i).attr("href");
        }, 
        onClick: function (event, i) {
            var pane = this.getPanes().eq(i);
            if(pane.attr('id') == 'moods'){
                //         console.log('ok mood map');
                if(moodmapcircle){
                    
                    x = moodmapcircle.cursor[0].attrs.cx;
                    y = moodmapcircle.cursor[0].attrs.cy;
                    if(moodmapcircle){
                        moodmapcircle.remove();
                    }
                    moodmapcircle = moodmapDraw(x,y); 
            
                    moodmapcircle.cpicon.attr('stroke-opacity',0);
                }
            }
        }
    }); 

    regDropKicks();

    ///ADDED FOR THE SOCIAL NETWORKING:::::
    $('.zpsocials > ul > li > a').die('click').live('click', function (event) {

        var who = $(this).attr('class');
        var url = $(this).attr('href');
        var dataUrl = encodeURIComponent($(this).parent('li').parent('ul').attr('data-url'));
        var dataTitle = $(this).parent('li').parent('ul').attr('data-title');
        var dataID = $(this).parent('li').parent('ul').attr('data-id');
        var dataType = $(this).parent('li').parent('ul').attr('data-type');
        var newHref = url + '?_zpt=1';
      
        switch(who){
            case "facebook-share":
                newHref += '&u=' + dataUrl + '&t=' + dataTitle + '%20' + dataUrl;
                break;
            case "twitter-share":
                if(dataType == 'playlist'){
                    dataTitle = 'Check out these #sndtrks! Pick a @YouTube vid. Pick a #sndtrk. And Mash @Friendly_Music';
                }else if(dataType == 'vidshare'){
                    dataTitle = 'Picked a @YouTube vid. Picked a #sndtrk. Made a Mash! Check it and Remash @Friendly_Music';
                }else{
                    dataTitle = 'Check out this #sndtrk! Pick a @YouTube vid. Pick a #sndtrk. And Mash @Friendly_Music';
                }
                newHref += '&url=' + dataUrl + '&text=' + dataTitle;
                break;
            case "mail-share":
                newHref = url + '/url/' + btoa(dataUrl) + '/title/' + dataTitle + '/id/' + dataID + '/st/' + dataType;
                break;
            case "buzz-share":
                newHref += '&srcURL=' + windlow.location.hostname;
            default:
                newHref += '&url=' + dataUrl + '&title=' + dataTitle;
                break;

        }
    
        $(this).attr('href',newHref);
        $('.zpsocials.close > a.trigger').trigger('click');
        shareCallback(dataID,dataType);
        if(who == 'mail-share'){
            $.get(newHref, function(data){
                // create a modal dialog with the data
                             
                $(data).modal({
                    closeHTML: "<a href='#' title='Close' class='modalCloseImg'>Close</a>",
                    position: ["15%",],
                    zIndex: 10000,
                    overlayClose: true,
                    overlayId: 'zpmodal-overlay',
                    containerId: 'zpmodal-container',
                    onOpen: function(dialog) {
                        $("#zpmodal-container").css('width', '560px'); //To reset the container
                        $(window).trigger('resize.simplemodal');
                        dialog.overlay.fadeIn(200, function () {
                            dialog.container.fadeIn(200, function () {
                                
                                dialog.data.fadeIn(200);
                            });
                        });
                    }
                });
            });
            return false;
        }else{
            window.open(newHref);
        }
        return false;
    });

    $('.zpsocials').livequery(function() {
        $(this).zpsharer();
    });
    
   
    $('.rf-share-icon').live('click', function () {
        $('.rfclicked').removeClass('rfclicked');
        $(this).addClass('rfclicked');
    });
    
    $('div.notification').each(function () {
        $(this).hide();
        var bodyC = $(this).children('p').html();
        $(this).removeClass("notification");
        var bodyT = $(this).attr('class');
        $.jGrowl(bodyC,{
            theme: bodyT
        });
        $(this).remove();
    
    });
    
    //autocall the following functions
    $('li.songinfolink').live('click' , function () {
        var trackID = $(this).attr('data-id'); //(123456)
        var TargetId = 'media-' + trackID;
        if($('#'+TargetId).length == 0){
            $(this).append('<ul class="clearfix" id="'+TargetId+'"></ul>');
        }
        if($('#' + TargetId).is(":empty")){
            $('#' + TargetId).html('<li><div class="clearfix rf-main-loader"></div></li>');
            $('#' + TargetId).show('slow');
            $.ajax({
                url : '/songinfo/id/' + trackID,
                dataType: "html",
                success: function (data, status) {
                    $('#' + TargetId).html(data);
                }
            });
        } else {
            $('#' + TargetId).slideToggle('slow');
        }
        return false;
    });
    
    $('a.jp-share').live('click',function() {
        //we need the current data here to build the share up!!!!!?
        });

    $('a.pluslink').live('click', function () {
        var self = $(this);
        var loader = $(this).parent().find('img');
        loader.show();
        $(this).hide();
        
        var plusID = $(this).attr('data-id');
        var plusType = $(this).attr('data-addtype');
        var plusTarget = $(this).children('div');
        $('.plusmodal').hide();
        $.ajax({
            url: '/addwishbox/addtype/' + plusType + '/id/' + plusID,
            success: function (data) {
                var ht = '<a class="clearfix closeplus">Close</a>';
                ht += data;
                plusTarget.html(ht);
                plusTarget.show();
                loader.hide();
                $(self).show();
            }
        });
        return false;
    });
    
    $('a.closeplus').live('click', function () {
        $('.plusmodal').hide();
        return false;
    });
    
    /**Ajax Response Automations**/
   /* $('body').ajaxComplete(function (e, xhr, settings) {


        alert(strpos(settings.url,'/rf/get_youtubedata'));

        if(strpos(settings.url,'/rf/get_youtubedata') === false && strpos(settings.url,'/rf/playerlicence/track_id') === false){
            _gaq.push(['_trackPageview', settings.url]);
            regDropKicks();
            registerToolTips();
            setEditables();
            //  FB.XFBML.parse(); //facebook like button render
            //  if(gapi.length > 0){
            gapi.plusone.go();
            // }
            //  stButtons.makeButtons();
            //  stWidget.init();     
        
   
            if ($('.mymusic-cart').length > 0) {
                if (!$('.mymusic-cart').is(':visible')){
                    if (!$('#mymusic').is(":visible")){
                        if ( $('.mymusictabs li a[href="#mymusic-cart"]').hasClass("current")) {
                            $('.mymusic-cart').hide('fast').html('');
                            if(typeof console != undefined){
                                console.log('Dash Trigger Cllled levle 1');
                            }
                            $('.mymusictabs li a[href="#mymusic-dash"]').trigger("click");
                    
                        }
                    }
                }
            }
            
            if($('#allplay.jplay').hasClass('active')){
                var playingClassName = 'media_track_id_' + $('#audio_trackid').val();
                $('.'+playingClassName).addClass('playing');
            }
            
        }
    });*/
    
    
    $('.songartistcell a').live('click', function (e) {
        e.preventDefault();
        var artistRel = $(this).attr('rel');
        /*  if($('#playlist').is(":empty")){
            $.ajax({
                url: '/editorspicks/goto' + artistRel,
                success: function (data) {
                    $('#playlist').html(data);
                    //    $('.playlistsub').html('<img src="/themes/rumblefish/img/loader.gif" />');
                    $('a[href="#editorspicks"]').trigger('click');
              
                }
            });
           
        }else{
            $('.playlistsub').html('<div class="clearfix rf-main-loader"></div>');
            if(!$('#playlist').is(":visible")){
                $('a[href="#editorspicks"]').trigger('click');
            }
            $.get(artistRel, function (data) {
                $('.playlistsub').html(data.output);
            }, 'json');
        } */
        $('#playlist').html('<div class="clearfix rf-main-loader"></div>');
        if(!$('#playlist').is(":visible")){
            $('a[href="#editorspicks"]').trigger('click');
        }
        $(document).scrollTop(0);
        //        $('.tabcontent').hide();
        //        $('#playlist').show();
        //        $('.navtabs').children('li').children('a.current').removeClass('current');
        //        $('.navtabs').children('li').children('a[href="#editorspicks"]').addClass('current');
        $.get($(this).attr('href'), function (data) {
            $('#playlist').html('<div class="artistgenreloader">' + data.output + '</div>');
        }, 'json');
        /* $.ajax({
            url : $(this).attr('href'),
            success: function (data){
                alert('complete');
                $('#playlist').html(data.output);
            }
        });*/
        
        
        
        return false;
    });
    
    $('a.genrelink').live('click', function (e) {
        e.preventDefault();
        var artistRel = $(this).attr('rel');
        /*  if($('#playlist').is(":empty")){
            $.ajax({
                url: '/editorspicks/goto' + artistRel,
                success: function (data) {
                    $('#playlist').html(data);
                    //    $('.playlistsub').html('<img src="/themes/rumblefish/img/loader.gif" />');
                    $('a[href="#editorspicks"]').trigger('click');
               
                }
            });
           
        }else{
            $('.playlistsub').html('<div class="clearfix rf-main-loader"></div>');
            if(!$('#playlist').is(":visible")){
                $('a[href="#editorspicks"]').trigger('click');
            }
            $.get(artistRel, function (data) {
                $('.playlistsub').html(data.output);
            }, 'json');
        } */
        $('#playlist').html('<div class="clearfix rf-main-loader"></div>');
        if(!$('#playlist').is(":visible")){
            $('a[href="#editorspicks"]').trigger('click');
        }
        $(document).scrollTop(0);
        //        $('.tabcontent').hide();
        //        $('#playlist').show();
        //        $('.navtabs').children('li').children('a.current').removeClass('current');
        //        $('.navtabs').children('li').children('a[href="#editorspicks"]').addClass('current');
        $.get($(this).attr('href'), function (data) {
            $('#playlist').html('<div class="artistgenreloader">' + data.output + '</div>');
        }, 'json');
    });

    setEditables();
    registerToolTips();
    registerLimit('#playlistid');//playlistid
    registerLimit('.playlistsub');
    registerLimit('.songssearchresults');
    registerLimit('.playlistsearchresults');
    registerLimit('.sfxsearchresults');
    registerLimit('#sfxresults');
    registerLimit('.artistgenreloader');
    registerLimitHtml('#mygrid');
    registerLimitHtml('.mymusic-projects');
    $('.playlistscrollitem').live('click', function () {
        var pid = $(this).attr('data-rel');
        $('.playlistsub').html('<div class="clearfix rf-main-loader"></div>');
        $.get('/playlist/tracks/id/' + pid, function (data) {
            $('.playlistsub').html(data.output);
        }, 'json');
    });
    /** Add to playlist functionality start **/
    //single track to play now

    $('a.playthistrack').live('click', function (e) {
        e.preventDefault();

        var track = $(this).attr('data-track'); //should be retrieved from the button elem    
        var artist = $(this).attr('data-artist'); //"The Stark Palace";
        var mp3 = '/media/mp3/track/' + $(this).attr('data-id');
        var poster = $(this).attr('data-id');
        var media_id = $(this).attr('data-id');
        
        addToPlayerQue(media_id, track, artist, mp3, poster, true, $(this));

        return false;
        
       
    //        $.jGrowl('Added ' + $.stripslashes(track) + ' to the Play Que',{
    //            theme: 'information'
    //        });
    //craig add to session variable.
        
    });
    //playlist to play now
    /*$('a.playthisplaylist').live('click', function () {
        var key = $(this).attr('data-id');
        if($('.media_track_id_' + key).hasClass('expanded')) {
            $('.media_track_id_' + key).find('li.result_track').first().find('a.playthistrack').trigger('click');
        } else {
            
            var rowID = $('.media_track_id_' + key).attr('rel');
            var tableCell = 'playlist-' + rowID;
            var target = $('.media_track_id_' + key);
            return togglePlaylistRow(rowID, tableCell, target, function() {
                if($('#allplay').hasClass('active')) {
                    $('#allplay').trigger('click');
                }
                $('.media_track_id_' + key).find('li.result_track').first().find('a.playthistrack').trigger('click');
            });
            
        }
        return false;
        //var isFirst = true;
        //
    //return false;
    //        $.ajax({
    //            url: '/get_playlist',
    //            type: 'post',
    //            data: 'id=' + key,
    //            dataType: 'json',
    //            success: function (json) {
    //                $(json.media).each(function (i) {
    //                    if(isFirst) {
    //                        addToPlayerQue(this.id, this.title, this.artist_tooltip, '/media/mp3/track/' + this.id, this.id, isFirst);
    //                    }
    //                    isFirst = false;
    //                });
    //            }
    //        });
    //        $.jGrowl('Added Playlist to the Play Que',{
    //            theme: 'information'
    //        });
    });*/
    
    $('a.queuethistrack').live('click', function () {
        var track = $(this).attr('data-track'); //should be retrieved from the button elem    
        var artist = $(this).attr('data-artist'); //"The Stark Palace";
        var mp3 = '/media/mp3/track/' + $(this).attr('data-id');
        var poster = $(this).attr('data-id');
        var media_id = $(this).attr('data-id');
        addToPlayerQue(media_id, track, artist, mp3, poster, false,$(this).parents('.plusmodal').parent('a'));
        //addToPlayerQue(media_id, track, artist, mp3, poster, play, jq_el) {
        //        $.jGrowl('Added ' + $.stripslashes(track) + ' to the Play Que',{
        //            theme: 'information'
        //        });
        $('.plusmodal').hide();
        return false;
    });
    
    $('a.queuethisplaylist').live('click', function () {
        var key = $(this).attr('data-id');
        $.ajax({
            url: '/get_playlist',
            type: 'post',
            data: 'id=' + key,
            dataType: 'json',
            success: function (json) {
                $(json.media).each(function (i) {
                    addToPlayerQue(this.id, this.title, this.artist_tooltip, '/media/mp3/track/' + this.id, this.id, false);
                });
            //                $.jGrowl('Added playlist to the Play Que',{
            //                    theme: 'information'
            //                });
            }
        });
        
        $('.plusmodal').hide();
        return false;
    });
    
    
    $('#accountstatus > .signinbox').live('click', function () {
        $('#accountstatus').toggleClass('active');
       

    });
    
    $('#accountstatus.active').live({
        mouseout: function () {
            $(this).removeClass('hover');
            setTimeout ( "$('#accountstatus.active:not(.hover)').removeClass('active')", 2000 );
        },
        mouseover: function () {
            $(this).addClass('hover');
        }
    });
   
    $('.closelogin').live('click', function () {
        $('#accountstatus .content').html('');
        $('#accountstatus').removeClass('active');
    });
    /** Shopping Cart Functionalities **/
    /*
    $('#cart > #cartshower').live('click', function () {
        $('#cart').addClass('active');
        $('#cart .content').html('<div class="clearfix rf-main-loader"></div>');
        $.ajax({
            url: '/checkout/cart/update',
            dataType: 'json',
            success: function (json) {
                if (json.output) {
                    var thisHtml = json.output;
                    thisHtml += '<a class="clearfix closecart">Close</a>';
                    $('#cart .content').html(thisHtml);
                }
            }
        });
        
    });*/
    $('#cartshower').bind('click', function (e) {

        // if the playbar is min, expand it
        if(!$('#hideshow').hasClass('open')) {
            $('#hideshow').trigger('click');
        }

        //e.preventDefault();
        if($('#mymusic:hidden')) {
            $('a[href="#mymusic"]').trigger('click');
        }
        $('#mymusic').html('<div class="clearfix rf-main-loader"></div>'); 
        //
        $('#mymusic').load('/mymusic/goto/cart', function (data) {
            //if(data) {
             $('a[href="#mymusic-cart"]').trigger('click');
             $('.mymusic-cart').show();
            //}
        });
       
       return false;
    });
    $('.closecart').live('click', function () {
        $('#cart').removeClass('active');
    });
    $('a.cartplaylistinfoshow').live('click', function () {
        $(this).parents('.item').find('ul.cartProductTrack').toggle('slow');
    });
    $('li.cartplaylistinfoshow').live('click', function () {
        $(this).children('ul.cartProductTrack').toggle('slow');
    });
    $('a.prjecttoggel').live('click', function () {
        var thistr = $(this).parent('span').parent('span').siblings('ul');
        thistr.slideToggle('slow');
    });
    /**Add To Cart / Remove from cart **/
    $('a.tracktocart').live('click', function () {
        $(this).addClass('loading-cart');
        var trackid = $(this).attr('rel');
        var licenceid = $('.licenceselect[rev="' + trackid + '"] :selected').val();
        rfToCart(trackid, licenceid);
        return false;
    });
    
    $('a.plustrack').live('click', function () {
        var trackid = $(this).attr('data-id');
        var productid = $(this).attr('rel');
        $.get('/wishlist/add/track/' + encodeURIComponent(trackid + ':' + productid), function (data) {
            if (data.error) {
                $.jGrowl(data.error,{
                    theme: 'error'
                });
            } else {
                if($('.mymusic-dash').length > 0){
                    $('.mymusic-dash').load('/mymusic/projects');
                }
                $('.plusmodal').hide();
            //                $.jGrowl("Track added to your Projects",{
            //                    theme: 'information'
            //                });
            }
        }, 'json');
        return false;
    });
    
    $('a.plusplaylist').live('click', function () {
        var trackid = $(this).attr('data-id');
        var productid = $(this).attr('rel');
        $.get('/wishlist/add/playlist/' + encodeURIComponent(trackid + ':' + productid), function (data) {
            if (data.error) {
                $.jGrowl(data.error,{
                    theme: 'error'
                });
            } else {
                if($('.mymusic-dash').length > 0){
                    $('.mymusic-dash').load('/mymusic/projects');
                }
                $('.plusmodal').hide();
            //                $.jGrowl("Playlist added to your Projects",{
            //                    theme: 'information'
            //                });
            }
        }, 'json');
        return false;
    });
    
    $('a.playlisttocart').live('click', function () {
        var playlistid = $(this).attr('rel');
        var licenceid  = $('.playlistlicenceselect[rev="' + playlistid + '"] :selected').val();
        $.get('/cart/add/playlist/' + encodeURIComponent(playlistid + ':' + licenceid), function (data) {
            if (data.error) {
                $.jGrowl(data.error,{
                    theme: 'error'
                });
            } else {
                $('.cart_total_holder').html(data.total);
                //                $.jGrowl('<strong>Success:</strong> The Playlist has been added to your cart',{
                //                    theme: 'success'
                //                });
                if($('#cart > .content').is(":visible")){
                    $('#cart > #cartshower').trigger('click');
                }
    
            }
        }, 'json');
    });
//    $('.playlistinfoshow').live('click', function (e) {
//
//        var rowID = $(this).attr('rel');
//        var tableCell = 'playlist-' + rowID;
//
//        return togglePlaylistRow(rowID, tableCell, this, false);
//        if($('#' + tableCell).length == 0) {
//            $(this).append('<ul class="clearfix" style="display:none;" id="'+tableCell+'"></ul>');
//        }
//        
//        if ($('#' + tableCell).is(":visible")) {
//            $('#' + tableCell).fadeOut('slow');
//            $('#' + tableCell).parents('li.tr').removeClass('expanded');
//            return false;
//        } else {
//            $('.playlistrow').slideUp('slow').removeClass('expanded');
//            if ($('#' + tableCell).is(":empty")) {
//                $('#' + tableCell).html('<li><div class="clearfix rf-main-loader"></div></li>');
//                $('#' + tableCell).fadeIn('slow');
//                $('#' + tableCell).parents('li.tr').addClass('expanded');
//                //ok get the data!!!!
//                $.get('/playlist/tracks/id/' + rowID + '/all/true', function (data) {
//                    $('#' + tableCell).html(data.output);
//                }, 'json');
//            } else {
//                $('#' + tableCell).parents('li.tr').addClass('expanded');
//                $('#' + tableCell).fadeIn('slow');
//            }
//        }
//    });
    
    $('.buttonblock').live('click', function () {
        $('.buttonblock.active').removeClass('active');
        $(this).addClass('active');
        $('.searchResultsResults').children('div').slideUp('slow');
        var sc = $(this).attr('data-rel');
        $('.' + sc).slideDown('slow');
    });
    $('.navtabs a.current[href="#search"]').live('click', function () {
        $('#searchbox').slideDown('slow');
    });
    
    
    $('.navtabs a[href="#editorspicks"]').live('click', function () {
        if($('#playlist').length > 0) {
            if($('#playlistselectbox').length == 0){
                $('#playlist').html('<div class="clearfix rf-main-loader"></div>');
                $('#playlist').load('/editorspicks');
            }
        }
    });
    
    /*$('span.sortable.songs').live('click',function() {
        if($(this).hasClass('asc')){
            $(this).removeClass('asc');
            $(this).addClass('desc');
        }else if($(this).hasClass('desc')){
            $(this).removeClass('desc');
            $(this).addClass('asc');
        }else{
            $('.sortable').each(function () {
                $(this).removeClass('asc');
                $(this).removeClass('desc');
            });
            $(this).addClass('desc');
        }
        $('.tabsearchbutton').addClass('songsortclick');
        $('.tabsearchbutton').trigger('click');
    });*/
    
    $('.searchResultsResults span.sortable.songs').live('click',function() {
        if($(this).hasClass('asc')){
            $(this).removeClass('asc');
            $(this).addClass('desc');
        }else if($(this).hasClass('desc')){
            $(this).removeClass('desc');
            $(this).addClass('asc');
        }else{
            $('.sortable').each(function () {
                $(this).removeClass('asc');
                $(this).removeClass('desc');
            });
            $(this).addClass('desc');
        }
        $('.tabsearchbutton').addClass('songsortclick');
        $('.tabsearchbutton').trigger('click');
    });
    
    
    $('#searchduration , #searchgenre, #searchbpm, #searchexplicit, #searchlicence, .catalog_search_checkbox').live('change', function () {
        $('.tabsearchbutton').trigger('click');
    });
    
    /*$('.tabsearchbutton').live('click', function () {
        var curacttab = $('.navtabs a.current');
        var q = encodeURIComponent($('#tabsearch').val());
        var h = encodeURIComponent($('#tabsearch').attr('holder'));
        if (q == h || q == '') {
            q = '';
        } else {
            q = '/q/' + q;
        }
        
        if($('#searchResults').length > 0 && $('#searchResults').is(":visible")){
            if($(this).hasClass('songsortclick')){
                var surl = '/searchjaxsongsort' + q;
            }else{
                var surl = '/searchjax' + q;
            }
            var sgenre = encodeURIComponent($('#searchgenre :selected').val());
            if (sgenre !== '') {
                surl += '/genre/' + sgenre;
            }
            var sdurat = encodeURIComponent($('#searchduration :selected').val());
            if (sdurat !== '') {
                surl += '/duration/' + sdurat;
            }
            var sbpm = encodeURIComponent($('#searchbpm :selected').val());
            if (sbpm !== '') {
                surl += '/bpm/' + sbpm;
            }
            var sexplicit = encodeURIComponent($('#searchexplicit :selected').val());
            if (sexplicit !== '') {
                surl += '/explicit/' + sexplicit;
            }
            var scatalog = new Array();
            
            $('input[name="provider_id[]"]:checked').each(function (event, data) {
                scatalog[event] = encodeURIComponent($(this).val());
            });
            scatalog = scatalog.toString();
            if (scatalog !== '') {
                surl += '/provider_id/' + scatalog;
            }
            
        //    var scurated = new Array();
            
          /*  $('input[name="rank"]:checked').each(function (event, data) {
                scurated[event] = encodeURIComponent($(this).val());
            });
            scurated = scurated.toString();
            */
     /*      var scurated = $('input[name="rank"][checked="checked"]').val();
            if (scurated !== '') {
                surl += '/rank/' + scurated;
            }
            
            
            var slicence = encodeURIComponent($('#searchlicence :selected').val());
            if (slicence !== '') {
                surl += '/licence/' + slicence;
            }
            
            //sortables:::
            $('.sortable.asc,.sortable.desc').each(function () {
                var elem = $(this).attr('data-sort');
                surl += '/sort/' + elem;
                if($(this).hasClass('asc')){
                    surl += '/direction/asc';
                }
                else{
                    surl += '/direction/desc';
                }
            });
            if($(this).hasClass('songsortclick')){
                $(this).removeClass('songsortclick');
                $('.songssearchresults').html('<div class="clearfix rf-main-loader"></div>');
                $('.songssearchresults').load(surl);
            }else{
                $('#searchResults').html('<div class="clearfix rf-main-loader"></div>');
                if (searchXHRREQ) {
                    searchXHRREQ.abort();
                }
                //var searchXHRREQIndex = 0;
    
                searchXHRREQ = $.ajax({
                    url : surl,
                    searchTableRequest: ++searchXHRREQIndex,
                    success: function (data, status) {
                        $('#searchResults').html(data);
                    }
                });
            // $('#searchResults').load(surl);
            }
        }else{
            $('#search').empty();
            $('a[href="#search"]').attr('rel', '/search' + q);
            $('a[href="#search"]').trigger('click');
        }
    }); */
    
    $('.hider').live('click', function () {
        $($(this).attr('rel')).slideUp('slow');
        $(this).hide();
        $('.shower[rel="' + $(this).attr('rel') + '"]').show();
    });
    $('.shower').live('click', function () {
        $($(this).attr('rel')).slideDown('slow');
        $(this).hide();
        $('.hider[rel="' + $(this).attr('rel') + '"]').show();
    });
    
    $('span.tr-wrap').live('mouseover', function() {
        $(this).addClass('hover');
    });
    
    $('span.tr-wrap').live('mouseout', function() {
        $(this).removeClass('hover');

        setTimeout ( "$('span.tr-wrap:not(.hover)').children('span.lic').children('.hovershow').children('.dk_open').removeClass('dk_open')", 1000 );
        setTimeout ( "$('span.tr-wrap:not(.hover)').children('span.generic-cell').children('.zpsocials.close').children('.trigger').trigger('click')", 1000 );
          

    });
    /*  function () { 
        if(!curEl.hasClass("hover")) 
        { $(tempEl).removeClass("dk_open"); 
        } 
    }*/
    
    $('li.tr').live('mouseover', function() {
        if(!$(this).hasClass('expanded')) {
            $(this).addClass('hover');
        }
    });
    
    $('li.tr').live('mouseout', function() {
        $(this).removeClass('hover');
        setTimeout ( "$('span.tr-wrap:not(.hover)').children('span.lic').children('.hovershow').children('.dk_open').removeClass('dk_open')", 1000 );
        setTimeout ( "$('span.tr-wrap:not(.hover)').children('span.generic-cell').children('.zpsocials.close').children('.trigger').trigger('click')", 1000 );
    });
    
    //    $('ul.faketable li.tr').live('mouseover', function() {
    //        //$.jGrowl('has nested faketables : ' + $(this).children().find('ul.faketable').length);
    //        //alert('nested faketables visible : ' + $(this).children('ul.faketable').not(':visible'));
    //        if(($(this).children('ul.faketable').length == 0 || $(this).children().find('ul.faketable').not(':visible'))) {
    //            $(this).addClass('hover');
    //        };
    //
    //
    //
    //    });
    //    $('ul.cartProductTrack li.line').live('mouseover', function () {
    //        $(this).addClass('hover');
    //    });
    //    
    //
    //    
    //    //$(', ul.cartProductTrack li.line, ul.cartProduct li.item')
    //    $('ul.faketable li.tr, ul.cartProductTrack li.line, ul.cartProduct li.item').live('mouseout', function() {
    //
    //        if($(this).children('ul.faketable').length == 0 || $(this).children('ul.faketable').not(':visible')) {
    //            $(this).removeClass('hover');
    //        };
    //        
    //    });
    /* 
    $('tr').live('mouseover', function () {
        $(this).children('td').children('.hoverhide').hide();
        $(this).children('td').children('.hovershow').show();
        $(this).children('td').addClass('bluetxt');
        $(this + '> td > img[src="/themes/rumblefish/img/icon-play-gray.png"]').attr('src', '/themes/rumblefish/img/icon-play.png');
    });
    $('tr').live('mouseout', function () {
        if (!$(this).hasClass('clickedRow')) {a
            $(this).children('td').children('.hovershow').hide();
            $(this).children('td').children('.hoverhide').show();
            $(this).children('td').removeClass('bluetxt');
            $(this).siblings('tr.clickedRow').removeClass('clickedRow').trigger('mouseout');
        }
    });
    */
    //    $('.licenceselect').live('mousedown', function () {
    //        
    //        $(this).parents('li').addClass('clickedRow');
    //    });
    //    $('.licenceselect').live('blur', function () {
    //        $(this).parents('li').removeClass('clickedRow');
    //    });
    
    
    $('li div a.jp-playlist-item-remove').live('click', function () {
        
        var tmpPlaylist = $.JSON.encode(rfPlaylist.playlist);
        $.cookie('zpQueued', tmpPlaylist, {
            path: '/',
            expires: 0
        });
    });
    
    $('a.hybridauth').die('click').live('click', function(e){
        e.preventDefault();
        window.open(
            $(this).attr('href'), 
            "Social Signin", 
            "location=0,status=0,scrollbars=0,width=800,height=500"
            ); 
    });
    
});



function shareCallback (dataID,dataType)
{
 
    $.ajax({
        url: '/addshared/addtype/' + dataType + '/id/' + dataID,
        success: function() {
            if($('.mymusic-dash').length > 0){
                $('.mymusic-dash').html('<div class="clearfix rf-main-loader"></div>');
                $('.mymusic-dash').load('/mymusic/projects');
            }
        }
    });
       

}

function toSeconds(str){
    var splitter = str.split(':');
    var t = Number((splitter[0]*60)) + Number(splitter[1]);
    return t;
}



function handleSocialLogin(handle){
    //Ok 1--lets change the login message!!!!!
    $('#accountstatus').removeClass('active');
    $('#accountstatus').html('<a href="#nogo" class="signinbox">Hi ' + handle + '</a><div class="content"><a href="/logout">Sign Out</a></div>');
    $('.simplemodal-close').trigger('click');
    if($('.mymusic-projects').length > 0){
        if($('.mymusic-projects').is(":visible")){
            $('.mymusic-projects').html('<div class="clearfix rf-main-loader"></div>');
            $('.mymusic-projects').load('/mymusic/orders');
        }
    }
    if($('.mymusic-dash').length > 0){
        if($('.mymusic-dash').is(":visible")){
            $('.mymusic-dash').html('<div class="clearfix rf-main-loader"></div>');
            $('.mymusic-dash').load('/mymusic/orders');
        }
    }
}
