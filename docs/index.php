<!DOCTYPE>
<html>
<head>
<script src="/js/jquery-1.6.4.js" type="text/javascript"></script>
<link href="/css/beautify.css" rel="stylesheet" type="text/css" />

<script>
    $(function(){
        $('.nav').click(function() {
            
            $('.nav').removeClass('smalSel');
            $(this).addClass('smalSel');
            
            var rel = $(this).attr('rel');

            if ($('#'+rel).is(':visible') == false) {
                $('.containExp:visible').each(function (i) {
                    $(this).animate({
                            opacity: 'toggle',
                            height: 'toggle'
                    }, 350);
                });

                $('#'+rel).animate({
                        opacity: 1,
                        height: 'toggle'
                    }, 350);
            }             
        });
        
        
        
    });
    
    var win = $(document);
    
    win.scroll(function() {  
       if (win.scrollTop() < 211) {
            $('.example').css({
                top: 211
            });
        } else {
            $('.example').css({
                top: win.scrollTop() - 17
            });
        }
    });
    
    
</script>

<title>Rumblefish SDK</title>
</head>
<body>
	<form>
            <div id="contain">
                <section>
                    <h2>Rumblefish SDK Overview</h2>
                    <p>
                        The RF SDK provides a set of functions and tools to easily request and manipulate data from the rumblefish API.
                    </p>
                    <p>
                        The SDK will typically be used for rapid development by using the rfExchage class that was built to accomidate common user request, and can be used in
                        conjection with the rfUtils(that will except data from realtive rfExchange class) to return basic HTML and javascript markup.
                    </p>
                    <p>
                        The SDK contains a tmpl directory with the default templates for the results, and can be edited as needed by the user.
                    </p>
                    <p>
                        The rfExchangeEngine methods will be use by more experienced developers to use the results as needed.
                        The methods are called through the normal rfExchange class via a static function call - rfExchange::methodname.
                    </p>
                </section>
                <section class="section2">
                    <div class="methods">
                        <div style="background-color: #000;">
                            <div class="formTitle meth">SDK Methods</div>
                        </div>
                        <ol>
                            <li><h4>Getting Started</h4></li>
                            <ul>
                                <li><a class="nav" rel="Install">Installing</a></li>
                                <li><a class="nav" rel="templates">Templates and CSS</a></li>
                                <li><a class="nav" rel="usage">Using the SDK</a></li>
                                <li><a class="nav" rel="auth">Authentication</a></li>
                                <li><a class="nav" rel="other">Other Exchange On-the-fly Methods</a></li>
                            </ul> 
                            <li><h4>Core Methods</h4></li>
                            <ul>
                                <li><a class="nav" rel="currentSetUp">currentSetUp</a></li>
                                <li><a class="nav" rel="setUp">setUp</a></li>
                                <li><a class="nav" rel="logDir">logDir</a></li>
                                <li><a class="nav" rel="getToken">getToken</a></li>
                                <li><a class="nav" rel="getIp">getIp</a></li>
                                <li><a class="nav" rel="getOutput_format">getOutput_format</a></li>
                                <li><a class="nav" rel="setOutput_format">setOutput_format</a></li>
                                <li><a class="nav" rel="authenticate">authenticate</a></li>
                            </ul>
                            <li><h4>Exchange Methods for use of utilities</h4></li>
                            <ul>
                                <li><a class="nav" rel="occasionTree">occasionTree</a></li>
                                <li><a class="nav" rel="occasionlist">occasionlist</a></li>
                                <li><a class="nav" rel="getFeaturedplaylists">getFeaturedplaylists</a></li>
                                <li><a class="nav" rel="playlistTracks">playlistTracks</a></li>
                                <li><a class="nav" rel="artistTracks">artistTracks</a></li>
                                <li><a class="nav" rel="moodMaplistTracks">moodMaplistTracks</a></li>
                                <li><a class="nav" rel="sfx">sfx</a></li>
                                <li><a class="nav" rel="sfxChild">sfxChild</a></li>
                                <li><a class="nav" rel="sfxTracks">sfxTracks</a></li>
                                <li><a class="nav" rel="songInfo">songInfo</a></li>
                                <li><a class="nav" rel="searchPlaylists">searchPlaylists</a></li>
                                <li><a class="nav" rel="searchSongs">searchSongs</a></li>
                            </ul>
                            <li><h4>Utilities Methods</h4></li>
                            <ul>
                                <li><a class="nav" rel="uoccasion">occasion</a></li>
                                <li><a class="nav" rel="ufeaturedplayLists">featuredplayLists</a></li>
                                <li><a class="nav" rel="utrackList">trackList</a></li>
                                <li><a class="nav" rel="uplayLists">playLists</a></li>
                                <li><a class="nav" rel="umoodMap">moodMap</a></li>
                                <li><a class="nav" rel="usyncPlayer">syncPlayer</a></li>
                                <li><a class="nav" rel="usfx">sfx</a></li>
                                <li><a class="nav" rel="usongInfo">songInfo</a></li>
                                <li><a class="nav" rel="usearchFilter">searchFilter</a></li>
                            </ul>
                            <li><h4>Exchange Engine Methods</h4></li>
                            <ul>
                                <li><a class="nav" rel="artist">artist</a></li>
                                <li><a class="nav" rel="catalog">catalog</a></li>
                                <li><a class="nav" rel="clear">clear</a></li>
                                <li><a class="nav" rel="getLicences">getLicences</a></li>
                                <li><a class="nav" rel="createLicence">createLicence</a></li>
                                <li><a class="nav" rel="getMedia">getMedia</a></li>
                                <li><a class="nav" rel="convertMedia">convertMedia</a></li>
                                <li><a class="nav" rel="occasion">occasion</a></li>
                                <li><a class="nav" rel="getPlaylist">getPlaylist</a></li>
                                <li><a class="nav" rel="search">search</a></li>
                                <li><a class="nav" rel="sfx_category">sfx_category</a></li>
                            </ul> 
                        <ol>
                    </div>
                    <div class="example">
                        <div style="background-color: #000;">
                            <div class="formTitle exam">Description</div>
                        </div>
                        <div id="Install" class="containExp">
                            <p>
                                <h3>INSTALLING</h3>
                                To install the RF SDK you will extract the toolkit and include the following files within your script or framework:
                                <ul>
                                    <li>rfBase.php - This file does the comunication to the RF API via RESTfull service.</li>
                                    <li>rfExchange.php - This file extends the rfExchangeEngine class that holds all basic functions, and efEchange class that holds all the rapid development functions.</li>
                                    <li>rfUtils.php - Holds the normal HTML and javasctipt functions.</li>
                                </ul>
                                <code>
                                    require_once("rfSDK/rfBase.php.php");<br />
                                    require_once("rfSDK/rfExchange.php");<br />
                                    require_once("rfSDK/rfUtils.php");<br />
                                </code>
                            </p>
                        </div>
                        <div id="templates" class="containExp">
                            <h3>TEMPLATES AND CSS</h3>
                            <p>
                                The default templates files in combination with the rfUtils class make use for custom javascript and css that is included with the RF SDK download, and can be changed as needed.
                                <br /><br />
                                <strong>NOTE:</strong> template will look for JS and CSS includes within the base directory, and if directories are changed the template paths will need to be updated.
                            </p>
                        </div>
                        <div id="usage" class="containExp">
                            <h3>USING THE SDK</h3>
                            <p>
                            Before calling rfEcxhange methods, "setup" needs to be called, with the userkey and password (supplied by rumblefish) or sandbox credentials ("sandbox", "sandbox").
                            <br /><br />
                            <code>
                                rfExchange::setUp("sandbox", "sandbox");
                            </code>
                            </p>
                        </div>
                        <div id="auth" class="containExp">
                            <h3>AUTHENTICATION</h3>
                            <p>
                                    The authentication will need to be called before any method that requires authentication.<br /><br />
                                    The authentication with the rumblefish API is token based, and thus a token needs to be passed to as a parameter to the authentication method to authenticate.
                                    A new token can be requested by calling the authenticate method with no parameters(An auth token for the runblefish API will expire after a day).
                                    <br /><br />When requesting a new token, that token will automatically be used to authenticate the current request.
                            </p>
                        </div>
                        <div id="other" class="containExp">
                            <h3>OTHER EXCHANGE ON-THE-FLY FUNCTIONS</h3>
                            <p>
                                <ul>
                                    <li>logDir - This function sets the current log directory to be used to store daily error logs (if not set a default log directory will be created within the rfSDK directory).</li>
                                    <li>setOutput_format - This function sets the current output type of all the ExchangeEngine class methods by passing a constant, if not set native PHP Array will be returned. ("RF_ARRAY", "RF_JSON", "RF_OBJECT")</li>
                                </ul>
                                The ExchangeEngine methods will be use by more experienced developers to use the results as the wish.
                            </p>
                        </div>
                        
                        <!-- CORE METHODS -->
                        <div id="currentSetUp" class="containExp">
                            <h3>currentSetUp</h3>
                            <p>
                                Returns a settings object with all the current settings.
                            </p>
                            <code>
                                $settings = rfExchange::currentSetUp();
                            </code>
                        </div>
                        <div id="setUp" class="containExp">
                            <h3>setUp</h3>
                            <p>
                                Must be called before any function.<br />
                                It sets up the current credentials.<br /><br /><br />
                                
                                Parameters:
                                <ul>
                                    <li>$key="sandbox"</li>
                                    <li>$password="sandbox"</li>
                                </ul>
                            </p>
                            
                            <code>
                                rfExchange::setUp($key, $password);
                            </code>
                        </div>
                        <div id="logDir" class="containExp">
                            <h3>logDir</h3>
                            <p>
                                Sets the current logging directory to store daily errors logs.<br /><br /> (will default to 'rfSDK/log').
                                <br /><br />
                                Parameters:
                                <ul>
                                    <li>$dir="/rfSDK/errorLogs"</li>
                                </ul>
                            </p>
                            <code>
                                rfExchange::logDir($dir);
                            </code>
                            <br /><br /><br /><br />
                                Defaults:
                                <ul>
                                    <li>$dir="/rfSDK/log"</li>
                                </ul>
                        </div>
                        <div id="getToken" class="containExp">
                            <h3>getToken</h3>
                            <p>
                                returns String value of the current token.
                            </p>
                            <code>
                                rfExchange::getToken();
                            </code>
                        </div>
                        <div id="getIp" class="containExp">
                            <h3>getIp</h3>
                            <p>
                                return the current request IP.
                            </p>
                            <code>
                                rfExchange::getIp();
                            </code>
                        </div>
                        <div id="getOutput_format" class="containExp">
                            <h3>getOutput_format</h3>
                            <p>
                                returns the current set output format.
                            </p>
                            <code>
                                rfExchange::getOutput_format();
                            </code>
                        </div>
                        <div id="setOutput_format" class="containExp">
                            <h3>setOutput_format</h3>
                            <p>
                                This function sets the current output type of all the ExchangeEngine class methods by passing a constant, if not set native PHP Array will be returned. ("RF_ARRAY", "RF_JSON", "RF_OBJECT")
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$format="RF_JSON"</li>
                                </ul>
                            </p>
                            <code>
                                rfExchange::setOutput_format($format);
                            </code>
                            <br /><br />
                            <p>
                                Defaults:
                                <ul>
                                    <li>$format="RF_ARRAY"</li>
                                </ul>
                            </p>
                        </div>
                        <div id="authenticate" class="containExp">
                            <h3>authenticate</h3>
                            <p>
                                The authentication will need to be called before any method that requires authentication.<br /><br />
                                The authentication with the rumblefish API is token based, and thus a token needs to be passed to as a parameter to the authentication method to authenticate.
                                A new token can be requested by calling the authenticate method with no parameters(An auth token for the runblefish API will expire after a day).
                                <br /><br />When requesting a new token, that token will automatically be used to authenticate the current request.
                            </p>
                            <br />
                            <p>
                                No Parameters:
                            </p>
                            <code>
                                $token = rfExchange::authenticate();
                            </code>
                            <br /><br /><br />
                            <p>
                                Parameters:
                                <ul>
                                    <li>$token="xxxxxxxxxx"</li>
                                </ul>
                            </p>
                            <code>
                                rfExchange::authenticate($token);
                            </code>
                        </div>
                        
                        <!-- RFEXCHANGE SPECIFIC EXCHANGE METHODS FOR USE OF UTILITIES -->
                        <div id="occasionTree" class="containExp">
                            <h3>occasionTree</h3>
                            <p>
                                Returns as hierarchal tree for basic occasion menu.
                            </p>
                            <code>
                                rfExchange::occasionTree();
                            </code>
                        </div>
                        <div id="occasionlist" class="containExp">
                            <h3>occasionlist</h3>
                            <p>
                                Returns a list of occasions for an id.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$id="12"</li>
                                    <li>Rumblefish_Playlist $params</li>
                                </ul>
                            </p>
                            <code>
                                $list = rfExchange::occasionlist($id, $params);
                            </code>
                        </div>
                        <div id="getFeaturedplaylists" class="containExp">
                            <h3>getFeaturedplaylists</h3>
                            <p>
                               Returns a menu of featured playlists in a format to be used by utilities.
                            </p>
                            <code>
                                $lists = rfExchange::getFeaturedplaylists();
                            </code>
                        </div>
                        <div id="playlistTracks" class="containExp">
                            <h3>playlistTracks</h3>
                            <p>
                               Returns a list of tracks for a playlist id in a format to be used by utilities.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$playlist_id="1"</li>
                                    <li>Rumblefish_Playlist $params</li>
                                </ul>
                            </p>
                            <code>
                                $tracks= rfExchange::playlistTracks($playlist_id, $params);
                            </code>
                        </div>
                        <div id="artistTracks" class="containExp">
                            <h3>artistTracks</h3>
                            <p>
                               Returns a list of tracks for a artistId in a format to be used by utilities.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$artist_id="1"</li>
                                </ul>
                            </p>
                            <code>
                                $tracks= rfExchange::playlistTracks($artist_id);
                            </code>
                        </div>
                        <div id="moodMaplistTracks" class="containExp">
                            <h3>moodMaplistTracks</h3>
                            <p>
                               Returns a list of tracks for Moodmap coordinates in a format to be used by utilities
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$x="1"</li>
                                    <li>$y="1"</li>
                                    <li>Rumblefish_Playlist $params</li>
                                </ul>
                            </p>
                            <code>
                                $tracks=rfExchange::moodMaplistTracks($x, $y, $params);
                            </code>
                        </div>
                        <div id="sfx" class="containExp">
                            <h3>sfx</h3>
                            <p>
                               Returns a list of all first tier sound effects in a format to be used by utilities.
                            </p>
                            <code>
                                $cats=rfExchange::sfx();
                            </code>
                        </div>
                        <div id="sfxChild" class="containExp">
                            <h3>sfxChild</h3>
                            <p>
                               Returns a list of all children effects in a format to be used by utilities.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$parent_id="1"</li>
                                </ul>
                            </p>
                            <code>
                                $tracks=rfExchange::sfxChild($parent_id);
                            </code>
                        </div>
                        <div id="sfxTracks" class="containExp">
                            <h3>sfxTracks</h3>
                            <p>
                               Returns a list of tracks for a sound effects id in a format to be used by utilities.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$sfxID="1"</li>
                                    <li>Rumblefish_Playlist $params</li>
                                </ul>
                            </p>
                            <code>
                                $tracks=rfExchange::sfxTracks($sfxID, $params);
                            </code>
                        </div>
                        <div id="songInfo" class="containExp">
                            <h3>songInfo</h3>
                            <p>
                               Returns track information in a format to be used by utilities
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$id="1"</li>
                                </ul>
                            </p>
                            <code>
                                $info=rfExchange::songInfo($id);
                            </code>
                        </div>
                        <div id="searchPlaylists" class="containExp">
                            <h3>searchPlaylists</h3>
                            <p>
                               Returns a in a format to be used by utilities
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>Rumblefish_Playlist $params</li>
                                </ul>
                            </p>
                            <code>
                                $playlists=rfExchange::searchPlaylists($params);
                            </code>
                        </div>
                        <div id="searchSongs" class="containExp">
                            <h3>searchSongs</h3>
                            <p>
                               Returns a in a format to be used by utilities
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>Rumblefish_Search $params</li>
                                    <li>$search_soundeffects=flase</li>
                                </ul>
                            </p>
                            <code>
                                $results=rfExchange::searchSongs($params,$search_soundeffects);
                            </code>
                        </div>
                        <!-- RF EXCHANGE FUNCTION FOR UTILITIES -->
                        <div id="uoccasion" class="containExp">
                            <h3>occasion</h3>
                            <p>
                                Uses occasionTree results with occasion template to display basic HTML occasion menu.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$occasionTree=rfExchange::occasionTree();</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfUtils::occasion($occasionTree);
                            </code>
                        </div>
                        <div id="ufeaturedplayLists" class="containExp">
                            <h3>featuredplayLists</h3>
                            <p>
                                Uses getFeaturedplaylists results with featuredplayLists template to display basic HTML featured playlists menu.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$featuredplayLists=rfExchange::featuredplayLists();</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfUtils::featuredplayLists($featuredplayLists);
                            </code>
                        </div>
                        <div id="utrackList" class="containExp">
                            <h3>trackList</h3>
                            <p>
                                Uses all tacklist results with trackList template to display basic HTML tracklist.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$any_tracks;</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfUtils::trackList($any_tracks);
                            </code>
                        </div>
                        <div id="uplayLists" class="containExp">
                            <h3>playLists</h3>
                            <p>
                                Uses all playlist results with playList template to display basic HTML playlist.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$any_playlists;</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfUtils::playLists($any_playlists);
                            </code>
                        </div>
                        <div id="umoodMap" class="containExp">
                            <h3>moodMap</h3>
                            <p>
                                Displays a javascript moodmap for selecting playlists based on coordinates.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$x=1; (default x=111) as this is the center of the moodmap</li>
                                    <li>$y=2; (default y=111) as this is the center of the moodmap</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfUtils::moodMap($x, $y);
                            </code>
                        </div>
                        <div id="usyncPlayer" class="containExp">
                            <h3>syncPlayer</h3>
                            <p>
                                Displays a javascript syncPlayer, with a parameter for the default video.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$video_id='XxXxXxXxX';</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfUtils::syncPlayer($video_id);
                            </code>
                        </div>
                        <div id="usfx" class="containExp">
                            <h3>sfx</h3>
                            <p>
                                Uses sfx results with sfx template to display basic HTML sfx menu.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$cats=rfExchange::sfx();</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfUtils::sfx($cats);
                            </code>
                        </div>
                        <div id="usongInfo" class="containExp">
                            <h3>songInfo</h3>
                            <p>
                                Returns a results of songInfo on template songInfo in simple HTML format.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$info=rfExchange::songInfo(1);</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfUtils::songInfo($info);
                            </code>
                        </div>
                        <div id="usearchFilter" class="containExp">
                            <h3>searchFilter</h3>
                            <p>
                                Returns a simple search filter by using the template searchFilter.
                            </p>
                            <code>
                                $result=rfUtils::searchFilter();
                            </code>
                        </div>
                        <!-- RF FUNTIONS -->
                        <div id="artist" class="containExp">
                            <h3>artist</h3>
                            <p>
                                Lists artist info.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$id=1;</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfExchange::artist($id);
                            </code>
                            <br /><br /><br />
                            <p>
                                <strong>See:</strong> https://sandbox.rumblefish.com/v2/artist.html.
                            </p>
                        </div>
                        <div id="catalog" class="containExp">
                            <h3>catalog</h3>
                            <p>
                                Lists rumblefish catalogs for your credentials.
                            </p>
                            <code>
                                $result=rfExchange::catalog();
                            </code>
                            <br /><br /><br />
                            <p>
                                <strong>See:</strong> https://sandbox.rumblefish.com/v2/catalog.html.
                            </p>
                        </div>
                        <div id="clear" class="containExp">
                            <h3>clear</h3>
                            <p>
                                Send the URL of the video you want to clear, and the license key for the media used in that video. Please note, this process typically takes around 12 hours to complete, and may take up to 48 hours during heavy load. 
                                <br />
                                <p>
                                    Parameters:
                                    <ul>
                                        <li>$youtube_id='xxXXxxXX';</li>
                                        <li>$licence_key='xxXXxxXX';</li>
                                    </ul>
                                </p>
                                <br /><br /><br />
                                <code>
                                    $result=rfExchange::clear($youtube_id, $licence_key);
                                </code>
                                <p>
                                    <strong>See:</strong> https://sandbox.rumblefish.com/v2/clear.html.
                                </p>
                            </p>
                        </div>
                        <div id="getLicences" class="containExp">
                            <h3>getLicences</h3>
                            <p>
                                Send the URL of the video you want to clear, and the license key for the media used in that video. Please note, this process typically takes around 12 hours to complete, and may take up to 48 hours during heavy load. 
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$youtube_id='xxXXxxXX';</li>
                                    <li>$licence_key='xxXXxxXX';</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfExchange::clear($youtube_id, $licence_key);
                            </code>
                            <br /><br /><br />
                            <p>
                                <strong>See:</strong> https://sandbox.rumblefish.com/v2/license.html.
                            </p>
                            
                        </div>
                        <div id="createLicence" class="containExp">
                            <h3>createLicence</h3>
                            <p>
                                Since the license is a legal document there are a large number of required parameters that help specify the identity of the licensee.
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$param Rumblefish_Licence $lobj</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfExchange::createLicence($param);
                            </code>
                            <br /><br /><br />
                            <p>
                                <strong>See:</strong> https://sandbox.rumblefish.com/v2/license.html#post.
                            </p>
                        </div>
                        <div id="getMedia" class="containExp">
                            <h3>getMedia</h3>
                            <p>
                                Returns media information on a media item returns array on success, false on failure
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$id="1"</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfExchange::getMedia($id);
                            </code>
                            <br /><br /><br />
                            <p>
                                <strong>See:</strong> https://sandbox.rumblefish.com/v2/media.html.
                            </p>
                        </div> 
                        <div id="convertMedia" class="containExp">
                            <h3>convertMedia</h3>
                            <p>
                                The media resource provides on-demand conversion of media files into the format you provide.
                                <br />You must provide a valid token and media ID in order to access the files.
                                <br />To preview files, please see the preview resource
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$id="1"</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfExchange::convertMedia($id);
                            </code>
                            <br /><br /><br />
                            <p>
                                <strong>See:</strong> https://sandbox.rumblefish.com/v2/media.html#post
                            </p>
                        </div>
                        <div id="occasion" class="containExp">
                            <h3>occasion</h3>
                            <p>
                                Get occassions
                                <br />if id parameter not passed will return a list of root occassions
                                <br />if id paramater passed will return the occassion (children a possiblity)
                                <br /><br /><strong>Note:</strong> the Occasion objects will only be nested three levels deep.
                                
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$id="1"</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfExchange::occasion($id);
                            </code>
                            <br /><br /><br />
                            <p>
                                <strong>See:</strong> https://sandbox.rumblefish.com/v2/occasion.html
                            </p>
                        </div>
                        <div id="search" class="containExp">
                            <h3>search</h3>
                            <p>
                                returns results on success / false on failure using Rumblefish_Search
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>Rumblefish_Search $obj</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfExchange::search($obj);
                            </code>
                            <br /><br /><br />
                            <p>
                                <strong>See:</strong> https://sandbox.rumblefish.com/v2/search.html
                            </p>
                        </div>
                        <div id="sfx_category" class="containExp">
                            <h3>sfx_category</h3>
                            <p>
                                Without specifying an id parameter, you will receive a list of sound effects categories:
                                <br />To get a list of playlists for a sound effects category, specify the ID:
                            </p>
                            <p>
                                Parameters:
                                <ul>
                                    <li>$effects_category_id=1</li>
                                </ul>
                            </p>
                            <code>
                                $result=rfExchange::sfx_category($effects_category_id);
                            </code>
                            <br /><br /><br />
                            <p>
                                <strong>See:</strong> https://sandbox.rumblefish.com/v2/sfx_category.html
                            </p>
                        </div>
                    </div>
                </section>
            </div>
	</form>
</body>
</html>

<?php
?>