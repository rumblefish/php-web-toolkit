# Rumblefish Web Toolkit

v. 1.0 BETA - May 24th, 2012

Copyright 2012, Rumblefish, Inc.

## LICENSE

This software is provided for free and is distributed under the Apache 2.0 license. See the license file for more details. The latest version of the Rumblefish PHP Web Toolkit  can be downloaded at https://github.com/rumblefish/php-web-toolkit.

## TERMS OF USE

Use of Rumblefish API is governed by the [Rumblefish API agreement](https://sandbox.rumblefish.com/agreement) and [Rumblefish Branding Requirements](https://sandbox.rumblefish.com/branding).

## WHAT IS THE  RUMBLEFISH WEB TOOLKIT (RWT)?

The RWT demonstrates how to interact with Rumblefish's API to search for and play music from Rumblefish's music catalog. The RWT contains examples of how to search by mood and keyword, browse playlists, occasions, and sound effects, and play Rumblefish audio tracks with YouTube videos. It's based on the functionality and features of Friendly Music, www.friendlymusic.com. For more info on Rumblefish's API,  checkout https://sandbox.rumblefish.com for documentation and examples.

## WHAT CAN I DO WITH THE RWT?

Build your own music licensing store, add music licensing to your web application, build a music licensing widget, really any application of music licensing on the web. The RWT is configured to use Rumblefish's sandbox API environment which contains a limited number of Rumblefish tracks and can not issue commercial licenses or delivery high quality tracks for download. Contact us when you are ready to set up a production portal to enable these features.

## WHERE DO I SEND COMPLAINTS, PRAISE, ETC.?

For bugs, please file an issue on GitHub, https://github.com/rumblefish/php-web-toolkit/issues

For business questions, email us at developers@rumblefish.com.

## COMPONENTS

1. _Base class_ The Base class that consists of Rest Client and authentication basic settings.
2. _Exchange class_ The Exchange class sets up user credentials and performs API calls against the Rumblefish API via the Base REST Client. It also outputs raw data as specified by the user eg. (json or native php array), handles basic exceptions and error handling. The Exchange class will also log user requests that were made.
3. _Utilities class_ The Utilities class uses results returned from the Exchange class and encapsulates the data in HTML markup for rapid development.
4. _Sync Player_ A music and video player written in Javascript that synchronizes the playback of music from the Rumblefish API with YouTube videos.

## EXCHANGE DETAILS

The Exchange class consists of the following:

* Setup
* Log Directory
* Get/Set Output Format
* Authentication
* Moodmap
* Occasion Tree
* Playlists
* SFK methods

These are explained below. 

### SETUP

This is called first to setup the current settings (username, password) to be used against the Rumblefish API within the current scope until changed.
The username and password can be changed on the fly using the setup function.
Setup also establishes the current IP address unless `forced_ip` was set to `true` within the Exchange class.

### LOG DIRECTORY (logDir)

The logDir can be used to setup a default logging directory that will store all API calls on a daily basis. If no directory is specified a log file directory will be created within the rfSDK directory.

### GET/SET OUTPUT FORMAT

Get/Set Output format will set or return the current output type.
Valid types are `Array`, `Object` and `JSON`.

### AUTHENTICATION

A user will need to be authenticated before certain functions can be used.

Calling Authenticate with no parameters will return a new token that will be used to authenticate API calls.

Exchange will also provide the following list of Rumblefish API functions that will return the format that was specified or will default to Array.

* artist
* authenticate
* catalog
* clear
* license
* media
* occasion
* playlist
* portal
* search
* sfx\_category

### MOODMAP

Method that calculates playlist ID based in the x and y co-ordinates passed to this method

### OCCASION TREE

This will return a parent/child hierarchy of playlists.

### PLAYLISTS

A method that returns the featured playlists.

A method that returns a playlist based on a parameter passed.

Options are: artist, genres, sfx or song.

### SFK METHODS

getTree method will return a parent/child tree for current category.

### SEARCH

The following parameters can be used as search terms:

* License Type/Price
* Duration
* BPM
* Genre
* Catalogs
* Music Curation
* Terms can be searched against
* Songs
* Playlists
* Sound Effects
* Utilities Details

The method calls within the Utils class use data from the Exchange class, and return that data combined with simple HTML and javascript for basic layout needs. 

### UTILITIES DETAILS

The Utilities class consists of the following functions:

* Occasion; basic HTML drilldown layout of the Occasion and the children elements.
* Occasion table; basic HTML table with a list of occasion tracks.
* Moodmap; Produces an HTML/javascript moodmap markup that will produce co-ordinates. These co-ordinates can be used to query the Exchange Mood method via Ajax or however it is needed.
* Moodmap Table;  basic HTML table with a list of mood tracks.
* Playlist; Basic HTML Div with a list of featured playlists.  Simple HTML track list with playlist description.
* SFX; A simple SFX menu for selecting effects.  Simple HTML track list.
* Search; A HTML search filter.
* Search table; A list of tracks for the search returned data, separated into the categories Songs, Playlists and Sound Effects for tabular display.
Playlists

