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


/*
 * Rumblefish SDK - DEMO
 * This is a basic demo that displays how to use the rfSDK
 */
session_start();
function pre($var){
    echo "<pre>";
        print_r($var);
    echo "</pre>";
}
$workingDir = dirname(__FILE__);
error_reporting(-1);
// The 2 base classes must always be included rfBase.php and rfExchange.php,
// rfUtil will provide Markup for rapid development
require_once($workingDir.DIRECTORY_SEPARATOR.'rfSDK'. DIRECTORY_SEPARATOR .'rfBase.php');
require_once($workingDir.DIRECTORY_SEPARATOR. 'rfSDK'. DIRECTORY_SEPARATOR .'rfExchange.php');
require_once($workingDir.DIRECTORY_SEPARATOR . 'rfSDK'. DIRECTORY_SEPARATOR .'rfUtils.php');

rfExchange::setUp("sandbox", "sandbox");
// If no logging directory is set, the code will default to a log directory withing the rfsdk directory.
// The logging directory can be changed on the Fly
//rfExchange::logDir($workingDir.DIRECTORY_SEPARATOR.'rfSDK'.DIRECTORY_SEPARATOR.'log'.DIRECTORY_SEPARATOR);

// Output of exchange functions can be set to JSON, Array or Object... this will default to Array if not set.
//rfExchange::setOutput_format('JSON');

$expire_time = true;
if (!isset($_SESSION['rftoken'])){
    $time = time();
    if (isset($_SESSION['rftoken']['expire'])){
        if ($time < $_SESSION['rftoken']['expire']){
            $expire_time = false;
        }
    }
} else {
    $token = $_SESSION['rftoken']['token'];
}

if ($expire_time){
    $token = rfExchange::authenticate();
    $expire = strtotime("+10 min");
    $_SESSION['rftoken'] = array(
        'expire' => $expire,
        'token' => $token
    );
}

//EXAMPLE FUNCTIONS
/*
 * Occasions
 */
//$tree = rfExchange::occasionTree();
//$result = rfUtils::occasion($tree);

/*
 * Playlists
 */
//$data = rfExchange::getFeaturedplaylists();
//$result = rfUtils::featuredplayLists($data);

//$data = rfExchange::artistTracks($id);
//$result = rfUtils::trackList($data);

/*
 * Moodmap
 */
//$result = rfUtils::moodMap();
/*
 * Syncplayer
 * pass default video parameter
 */
//rf - P_epaFV_Ka0
//$result = rfUtils::syncPlayer("5s5lSKq-Dpc");

/*
 * SFX
 */
$tree = rfExchange::sfx();
$result = rfUtils::sfx($tree);

/*
 * Song info
 */
//$data = rfExchange::songInfo($id);
//$result = rfUtils::songInfo($data);


/*
 * Search functions
 */
//$result = rfUtils::searchFilter();

?>
<!doctype html>
<html>
    <head>
        <title>Rumblefish</title>
        <link rel="stylesheet" type="text/css" href="/css/rf.stylesheet.css" />
        <link rel="stylesheet" type="text/css" href="/css/colours.css" />
        <link rel="stylesheet" type="text/css" href="/css/jplayer.css" />
        <link rel="stylesheet" type="text/css" href="/css/jnice.css" />
        <link rel="stylesheet" type="text/css" href="/js/dropkick/dropkick.css" />
        <script type="text/javascript" src="/js/jquery-1.6.4.js"></script>
        <script type="text/javascript" src="/js/jquery.tools.js"></script>
        <script type="text/javascript" src="/js/raphael.js"></script>
        <script type="text/javascript" src="/js/raphael.colorpicker.js"></script>
        <script type="text/javascript" src="/js/jquery.blockUI.js"></script>
        <script type="text/javascript" src="/js/jquery-ui-1.8.16.custom.js"></script>

        <script type="text/javascript" src="/js/dropkick/jquery.dropkick-1.0.0.js"></script>
        <script type="text/javascript" src="/js/jplayer/jquery.jplayer.js"></script>
        <script type="text/javascript" src="/js/jquery.cookies.js"></script>
        <script type="text/javascript" src="/js/jquery.jeditable.js"></script>
        <script type="text/javascript" src="/js/jquery.livequery.js"></script>
        <script type="text/javascript" src="/js/jquery.qtip.js"></script>
        <script type="text/javascript" src="/js/zplayer/js/jquery.zplayer.js"></script>
        <script type="text/javascript" src="/js/zplayer/js/swfobject.js"></script>
        <script type="text/javascript" src="/js/rumble.js"></script>
        <script type="text/javascript" src="/js/jquery.checkbox.js"></script>
        <style>
            .row:after, .clearfix:after {
                clear: both;
                content: ".";
                display: block;
                height: 0;
                visibility: hidden;
                font-size: 0;
            }
            .row, .clearfix {
                zoom: 1;
                display: block;
            }
            .column, .columns {
                float: left;
                margin-right: 30px;
            }
            .column:last-Child, .columns:last-Child {
                margin-right: 0px;
            }
            .column.right, .columns.right {
                float: right;
                margin-left: 30px;
                margin-right: 0;
            }
            .column,right:first-child, .columns,right:first-child {
                margin-left: 0px !important;
            }
            .column.margin-0, .columns.margin-0 {
                margin: 0;
            }
            .row .selector,.selectarrow{
                float: left;
            }
            .selected{
                background-color: #28A9DF;
                color: #FFFDF8;
            }
            div.selector ul li.selected, div.selector ul li:hover {
                background-color: #28A9DF;
                color: #FFFDF8;
            }
            ul.faketable li.thead{
                float: left;
            }
            ul.faketable li.tr:nth-child(even){
                float: left;
            }
            ul li{
                list-style: none;
            }
            #scroll_wrap a.main_prev {
                background: url(/img/slider-arrow-major.png) no-repeat top left transparent;
                position: absolute;
                left: -18px;
                width: 37px;
                height: 42px;
                top: 110px;
            }
            #scroll_wrap a.main_next {
                background: url(/img/slider-arrow-major.png) no-repeat top right transparent;
                position: absolute;
                right: -18px;
                width: 37px;
                height: 42px;
                top: 110px;
            }
            #scroll_wrap {
                position: relative;
                padding: 15px;
                width: 860px;
                margin-left: 20px;
            }
            .onplaylist li{
                width: 800px;
            }
            ul.faketable li.tr{
                float: left;
            }
            .playlistsub{
                width: 920px;
            }
            .playlist-detail{
                padding-left: 30px;
            }
            #mpcontent{
                margin-left: 48px;
                bottom: 12px;
            }
            .mmaptooltip.sunny {
                left: 139px;
                top: 5px;
            }
            .mmaptooltip.smile {
                top: 45px;
                left: 42px;
            }
            .mmaptooltip.smileyellow {
                left: 235px;
                top: 44px;
            }
            .mmaptooltip.sheep {
                top: 137px;
                left: 5px;
            }
            .mmaptooltip.lion {
                left: 268px;
                top: 139px;
            }
            .mmaptooltip.sad {
                left: 41px;
                top: 228px;
            }
            .mmaptooltip.angry {
                left: 233px;
                top: 228px;
            }
            .mmaptooltip.storm {
                left: 139px;
                top: 265px;
            }
            #moodmapblock{
                width: 312px;
            }
            .musicplayer{
                float: right;
            }
            ul{
                padding: 0px;
                margin: 0px;
            }
            .youtubeplayer{
                float: left;
            }
            .button.youtube{
                padding: 5px 15px;
            }
            .jp-controls{
                width: 50px;
            }
        </style>
         <script type="text/javascript">
            // borrowed from my zplayer plugin as a floating function

            var moodmapcircle = false;
            var theglower = false;

            function formatTime(d) {
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
                return ((h > 0 ? h + ":" : "") + (m > 0 ?
                    (h > 0 && m < 10 ? "0" : "") + m + ":" : "0:") + (s < 10 ? "0" : "") + s);
            };

            $.blockUI.defaults.message = '<img style="z-index: 100005;" src="/img/dark-loader.gif" alt="Loading..."/>';
            $.blockUI.defaults.css.border = '0 none';
            $.blockUI.defaults.css.color = '#FFF';
            $.blockUI.defaults.css.fontWeight = 'bold';
            $.blockUI.defaults.css.borderRadius = '3px';
            $.blockUI.defaults.css.zIndex = 100001;
            $.blockUI.defaults.css.backgroundColor = 'transparent';
            $.blockUI.defaults.overlayCSS.zIndex = 100000;
            $.blockUI.defaults.overlayCSS.backgroundColor = '#8B8B8B';
            $.blockUI.defaults.overlayCSS.opacity = 1;
            $.blockUI.defaults.overlayCSS.boxShadow = '0 2px 5px #222 inset';

        </script>
    </head>
    <body>
        <?php
            echo $result;
        ?>
    </body>
</html>
