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


/**
 * Rumblefish Exchange Engine
 */

/**
 * Current available ouput types
 */
define('RF_ARRAY', 'Array');
define('RF_JSON', 'JSON');
define('RF_OBJECT', 'Object');

class rfExchangeEngine {
    protected static $__settings;
    protected static $error;
    protected static $return_types = array("Array", "JSON", "Object");
    /**
    * to circumvent IP country restrictions on cli requests
    * @var string
    */
    const CLI_IP_ADDRESS = "184.72.132.180";
    /**
     * Sandbox url
     * @var string
     */
    const RF_TEST_URL = 'https://sandbox.rumblefish.com/v2/';
    /**
     * Live instance url
     * @var string
     */
    const RF_URL = 'https://api.rumblefish.com/v2/';


    /**
    * Current settings
    *
    * @desc 
    * @param string $tpl
    * @throws Exception Thrown exception is caught within method.
    * @return Settings Obj
    */

    public static function currentSetUp(){
        return self::$__settings;
    }

    public static function setUp($user='',$passw=''){
        if ($user=='' || $passw==''){
            throw new rfExchangeException('Invalid User Credentials');
        }
        self::$__settings = new settings();
        self::$__settings->username = $user;
        self::$__settings->password = $passw;
    }

    // Log files are written a directory, a file per day
    public static function logDir($logfile=''){
        // Check the folder exists - else create it
        if ($logfile=='') {
            $workingDir = dirname(__FILE__);
            $logfile = $workingDir.DIRECTORY_SEPARATOR.'log'.DIRECTORY_SEPARATOR;

            if (!file_exists($logfile)) {
                mkdir($logfile, 0755, true);
            }
        }

        if (!is_dir($logfile)){
            throw new rfExchangeException('Invalid Logging Directory');
        }
        if ($logfile){
            self::$__settings->logdir = $logfile;
        } else {
            throw new rfExchangeException('Invalid Logging Directory');
        }
       
    }
    /**
     * Logging function
     * @internal
     */
    protected static function log($logMsg, $fileprefix = '') {

        if (self::$__settings->logdir){
            $handle = fopen(self::$__settings->logdir . '' . $fileprefix . DATE("Ymd"). '.rfExhange.log', 'ab');
            $entry = 'Entry ' . date('g:i:s a') . ' >> ';
            $entry .= $logMsg;
            $entry .= "\r\n";
            fwrite($handle, $entry);
            fclose($handle);
        } else {
            self::logDir();
        }
    }
    /**
     * Checks if in test mode or not and returns relevent url
     * @return string
     * @internal
     */
    protected static function getUrl() {
        return (self::$__settings->testmode) ? self::RF_TEST_URL : self::RF_URL;
    }
    /**
     * returns current token if set, false on failure
     * @return mixed
     */
    public static function getToken() {
        return isset(self::$__settings->token) ? self::$__settings->token : false;
    }

    public static function getIp(){
        return isset(self::$__settings->ip) ? self::$__settings->ip : '';
    }
    public static function getOutput_format(){
        return isset(self::$__settings->format) ? self::$__settings->format : 'Array';
    }
    public static function setOutput_format($format='Array'){
        if (in_array($format, self::$return_types)){
            self::$__settings->format = $format;
        }else{
            throw new rfExchangeException('Format type not supported');
        }
    }
    protected static function formatResult($data,$type=''){
        if ($type==''){
            if (self::$__settings->format){
                $type = self::$__settings->format;
            }else{
                self::setOutput_format();
            }
        }
        if ($type=="Array"){
            return $data;
        }elseif($type=="JSON"){
            return json_encode($data);
        }elseif($type=="Object"){
            return json_decode(json_encode($data));
        }
    }

    public static function catalog() {
        if (null === self::$__settings->token) {
            //self::$error = 'This action required authentication';
            throw new rfExchangeException('This action required authentication');
            return false;
        }
        $base = new rfBase(self::getUrl() . 'catalog', 'GET');
        if(self::$__settings->force_ip_address) {
            $return['ip'] = self::CLI_IP_ADDRESS;
        } else {
            if(ZP_REQUEST_TYPE != 'cli'){
                if (isset($_SERVER['REMOTE_ADDR'])) {
                    $return['ip'] = $_SERVER['REMOTE_ADDR'];
                } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                    $return['ip'] = $_SERVER['HTTP_X_FORWARDED_FOR'];
                } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
                    $return['ip'] = $_SERVER['HTTP_CLIENT_IP'];
                }
            } 
        }

        $base->addArgs(array('token' => self::$__settings->token, 'ip' => $return['ip']));
        $base->execute();
        $result = json_decode($base->getResponseBody(), true);
        if (self::$__settings->debug) {
            self::log($base->getUrl());
        }
        if (null === $result) {
            throw new rfExchangeException('Encoding Issue from Service / Service not defined');
            return false;
        }
        if (isset($result['error'])) {
            self::$error = implode("<br />", $result['error']);
            throw new rfExchangeException(self::$error);
            return false;
        }

        return self::formatResult($result);
    }

    /**
     * Authentication call, sets token.
     * returns token on success, false on failure
     * This resource takes a valid credentials for a portal and creates
     * an access token for accessing secured content in the API
     * Tokens are 32 mixed-case alphanumeric characters.
     * @see https://sandbox.rumblefish.com/v2/authenticate.html
     * @param string $public_key
     * @param string $password
     * @return mixed
     */
    public static function authenticate($token='') {

        if ( ($token) || (trim($token) != '') ){
            self::$__settings->token = $token;
            return $token;
        }
        if ((self::$__settings->username) && (self::$__settings->password)){
            $base = new rfBase(self::getUrl() . 'authenticate', 'POST', array('public_key' => self::$__settings->username, 'password' => self::$__settings->password));
            $base->execute();
            $result = json_decode($base->getResponseBody(), true);

            if (self::$__settings->token) {
                self::log($base->getUrl());
            }
            if (null === $result) {
                self::$error = 'Encoding Issue from Service / Service not defined';
                throw new rfExchangeException(self::$error);
                return false;
            }
            if (isset($result['error']['authentication'])) {
                self::$error = $result['error']['authentication'];
                throw new rfExchangeException(self::$error);
                return false;
            }
            self::$__settings->token = $result['token'];
            return $result['token'];
        }else{
            //Throw exception
        }
    }

    public static function artist($id) {
        $base = new rfBase(self::getUrl() . 'artist');
        $base->addArgs(array('id' => $id));
        $base->execute();

        $result = json_decode($base->getResponseBody(), true);
        if (self::$__settings->debug) {
            self::log($base->getUrl());
        }
        if (null === $result) {
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error']['id'])) {
            self::$error = $result['error']['id'];
            throw new rfExchangeException(self::$error);
            return false;
        }
        
        return self::formatResult($result['artist']);
    }

    /**
     * Send the URL of the video you want to clear, and the license key for the
     * media used in that video. Please note, this process typically takes around
     * 12 hours to complete, and may take up to 48 hours during heavy load.
     * @param string $id - The URL or video ID of the YouTube video to clear
     * @param type $key - The license key to use
     * @return type
     * @see https://sandbox.rumblefish.com/v2/clear.html
     */
    public function clear($id, $key) {
        $base = new rfBase(self::getUrl() . 'clear', 'POST');
        $base->addArgs(array('youtube' => $id, 'key' => $key));
        $result = json_decode($base->getResponseBody(), true);
        if (self::$__settings->debug) {
            self::log($base->getUrl());
        }
        if (null === $result) {
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
    }

    /**
     * Provides a list of valid licenses for your portal
     * returns array on success, false on failure
     * requires a valid token
     * Without specifying an $licence_key parameter, you will receive a list of valid licenses for
     * your portal. When you supply a $licence_key you will receive details of the track licensed
     * and who licensed it
     * @see Rumblefish::authenticate()
     * @param string $licence_key - default false - The license key from a track
     * @return mixed
     * @see https://sandbox.rumblefish.com/v2/license.html
     */
    public static function getLicences($licence_key = false) {
        if (null === self::$__settings->token) {
            self::$error = 'This action required authentication';
            throw new rfExchangeException(self::$error);
            return false;
        }
        $base = new rfBase(self::getUrl() . 'license', 'GET');
        if (!$licence_key) {
            $base->setTimeout(60);
        }

        $args = array('token' => self::$__settings->token);
        if ($licence_key) {
            $args['license_key'] = $licence_key;
        }
        $base->addArgs($args);

        $base->execute();
        $result = json_decode($base->getResponseBody(), true);

        if (self::$__settings->debug) {
            self::log($base->getUrl());
            //self::log(print_r($result,1));
        }
        if (null === $result) {
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error']['token'])) {
            self::$error = $result['error']['token'];
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error']['license_key'])) {
            self::$error = $result['error']['license_key'];
            throw new rfExchangeException(self::$error);
            return false;
        }
        //transaction
        if ($licence_key) {
            return self::formatResult($result['transaction']);
        }
        return self::formatResult($result['valid_license_types']);
    }

    /**
     * Creates a licence
     * Since the license is a legal document there are a large number of
     * required parameters that help specify the identity of the licensee.
     * $param Rumblefish_Licence $lobj
     * @see Rumblefish_Licence
     * @see https://sandbox.rumblefish.com/v2/license.html#post
     * @TODO - This method is not yet completed //licence types not being returned from the api at current
     */
    public static function createLicence(Rumblefish_Licence $lobj) {
        if (null === self::$__settings->token) {
            self::$error = 'This action required authentication';
            throw new rfExchangeException(self::$error);
            return false;
        }

        $base = new rfBase(self::getUrl() . 'license', 'POST', $lobj->toArray());
        $base->setTimeout(60);
        self::log(print_r($lobj->toArray(), 1), 'licencereqest.log');
        $base->execute();
        $result = json_decode($base->getResponseBody(), true);
        if (self::$debug) {
            self::log($base->getUrl(), 'licencereqest.log');
            self::log(print_r($base, 1), 'licencereqest.log');
        }

        if (null === $result) {
            mail('rfpm@igroup.co.za', 'licenceReqError', 'error with licencerequest');
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error'])) {
            self::$error = implode("<br />", $result['error']);
            throw new rfExchangeException(self::$error);
            return false;
        }

        return self::formatResult($result['receipt']);
    }


    /**
     * Returns media information on a media item
     * returns array on success, false on failure
     * @param int $id
     * @return mixed
     * @see https://sandbox.rumblefish.com/v2/media.html
     */
    public static function getMedia($id) {
        $base = new rfBase(self::getUrl() . 'media');

        $return['ip'] = self::$__settings->ip;
        $base->addArgs(array('id' => $id, 'ip' => $return['ip']));
        $base->execute();

        $result = json_decode($base->getResponseBody(), true);
        if (self::$__settings->debug) {
            self::log($base->getUrl());
        }
        if (null === $result) {
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error']['id'])) {
            self::$error = $result['error']['id'];
            throw new rfExchangeException(self::$error);
            return false;
        }
        return self::formatResult($result['media']);
    }


    /**
     * The media resource provides on-demand conversion of media files into the format you provide.
     * You must provide a valid token and media ID in order to access the files.
     * To preview files, please see the preview resource
     * @TODO This method is not yet completed!
     * @param int $id
     * @param string $format
     * @param string $bitrate
     * @return mixed
     * @see https://sandbox.rumblefish.com/v2/media.html#post
     */
    public static function convertMedia($id, $licence_key, $format = 'mp3', $bitrate = '128k') {

        if (null === self::$__settings->token) {
            self::$error = 'This action required authentication';
            throw new rfExchangeException(self::$error);
            return false;
        }

        $data = array();
        $format = strtolower($format); //force the format to a lowercase string!
        if (!in_array($format, self::$__settings->RF_MEDIA_FORMATS)) {
            $format = 'mp3'; //default back to mp3 if the format is not available.
        }

        $bitrate = strtolower($bitrate); //lowercase the bitrate,
        $ldcheck = substr($bitrate, -1);
        if (is_numeric($ldcheck)) {
            $bitrate .= 'k'; //test that k is the last character else add it.
        }

        // test if the bitrate is available or default to the number just lower or higher (if lower not exist)
        if (!in_array($bitrate, self::$__settings->RF_MEDIA_BITRATES)) {
            $bitrates = self::$__settings->RF_MEDIA_BITRATES;
            $bitrates[] = $bitrate;
            sort($bitrates, SORT_NUMERIC);
            $key = array_search($bitrate, $bitrates);
            $lower = $key - 1;
            if (isset($bitrates[$lower])) {
                $bitrate = $bitrates[$lower];
            } else {
                $key++;
                $bitrate = $bitrates[$key];
            }
        }

        $data['id'] = $id;
        $data['token'] = self::$__settings->token;
        $data['license_key'] = $licence_key;
        $data['format'] = $format;
        $data['bitrate'] = $bitrate;
        //zp('debug')->pre($data);
        $base = new rfBase(self::getUrl() . 'media', 'POST', $data);
        // $rs->addArgs($data); //build our request.
        $base->execute();
        $result = json_decode($base->getResponseBody(), true);
        //   zp('debug')->pre($result);
        if (self::$__settings->debug) {
            self::log('Starting Licence Request');
            self::log($base->getUrl());
            self::log(print_r($data, 1));
            self::log(print_r($result, 1));
        }
        if (null === $result) {
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error'])) {
            self::$error = implode("<br />", $result['error']);
            throw new rfExchangeException(self::$error);
            return false;
        }

        //now this method can take a while!!!!! they pass back a retry in number
        while (isset($result['retry_in'])) {
            sleep((int) $result['retry_in']);
            $base->execute();
            $result = json_decode($base->getResponseBody(), true);
            if (self::$__settings->debug) {
                self::log($base->getUrl());
                self::log(print_r($data, 1));
                self::log(print_r($result, 1));
            }
            if (null === $result) {
                self::$error = 'Encoding Issue from Service / Service not defined';
                throw new rfExchangeException(self::$error);
                return false;
            }
            if (isset($result['error'])) {
                self::$error = implode("<br />", $result['error']);
                throw new rfExchangeException(self::$error);
                return false;
            }
        }
        return self::formatResult($result['media_url']);
    }

    /**
     * get occassions
     *  if id parameter not passed will return a list of root occassions
     *  if id paramater passed will return the occassion (children a possiblity)
     * Please note: the Occasion objects will only be nested three levels deep.
     * @param int $id
     * @return mixed false on failure, array on success
     * @see https://sandbox.rumblefish.com/v2/occasion.html
     */
    public static function occasion($id = false) {

       $base = new rfBase(self::getUrl() . 'occasion');
        if ($id) {
            $base->addArgs(array('id' => $id));
        }
        $base->execute();
        $result = json_decode($base->getResponseBody(), true);

        if (self::$__settings->debug) {
            self::log($base->getUrl());
            //self::log(print_r($result,1));
        }

        if (null === $result) {
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error']['id'])) {
            self::$error = $result['error']['id'];
            throw new rfExchangeException(self::$error);
            return false;
        }

        if ($id) {
            return self::formatResult($result['occasion']);
        } else {
            return self::formatResult($result['occasions']);
        }
    }
    /**
     * Query the playlist using the
     * @param Rumblefish_Playlist $pobj
     * @param bool $returnRaw - if set to true, will return the raw output, if false, will only return the playlist items
     * @see https://sandbox.rumblefish.com/v2/playlist.html
     * @see Rumblefish_Playlist
     */
    public static function getPlaylist(Rumblefish_Playlist $pobj, $returnRaw = false) {
        $base = new rfBase(self::getUrl() . 'playlist');
        $base->addArgs($pobj->toArray());
        $base->execute();
        $result = json_decode($base->getResponseBody(), true);

        if (self::$__settings->debug) {
            self::log($base->getUrl());
        }
        if (null === $result) {
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error'])) {
            self::$error = implode("<br />", $result['error']);
            throw new rfExchangeException(self::$error);
            return false;
        }

        if ($returnRaw) {
            return self::formatResult($result);
        }
        if (isset($result['playlist'])) {
            return self::formatResult($result['playlist']);
        } else {
            return self::formatResult($result['playlists']);
        }
    }

    /**
     * returns results on success / false on failure
     * @see https://sandbox.rumblefish.com/v2/search.html
     * @see Rumblefish_Search
     * @param Rumblefish_Search $sobj
     * @return mixed
     */
    public static function search(Rumblefish_Search $sobj) {
        $base = new rfBase(self::getUrl() . 'search');
        $base->addArgs($sobj->toArray());
        $base->execute();

        $result = json_decode($base->getResponseBody(), true);
        if (self::$__settings->debug) {
            self::log($base->getUrl());
        }
        if (null === $result) {
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error'])) {
            self::$error = implode("<br />", $result['error']);
            throw new rfExchangeException(self::$error);
            return false;
        }

        return self::formatResult($result);
    }

    /**
     * Without specifying an id parameter, you will receive a list of sound effects categories:
     * To get a list of playlists for a sound effects category, specify the ID:
     * @param int $id
     * @return mixed - array on success, false on failure
     * @see https://sandbox.rumblefish.com/v2/sfx_category.html
     */
    public static function sfx_category($id = false) {
        $base = new rfBase(self::getUrl() . 'sfx_category');
        if ($id) {
            $base->addArgs(array('id' => $id));
        }
        $base->execute();
        $result = json_decode($base->getResponseBody(), true);
        if (self::$__settings->debug) {
            self::log($base->getUrl());

        }
        if (null === $result) {
            self::$error = 'Encoding Issue from Service / Service not defined';
            throw new rfExchangeException(self::$error);
            return false;
        }
        if (isset($result['error']['id'])) {
            self::$error = $result['error']['id'];
            throw new rfExchangeException(self::$error);
            return false;
        }
        if ($id) {
            return self::formatResult($result['sfx_category']);
        }
        return self::formatResult($result['sfx_categories']);
    }
}

/**
 * Helper classes
 */
class settings {
    public $username;
    public $password;
    public $logdir;
    public $token;
    public $ip;
    public $format='Array';
     /**
     * Enable debugging
     * @var bool
     */
    public $debug = true;
    /**
     * Sets whether to use the sandbox or live instance
     * @var bool
     */
    public $testmode = true;
    /**
     * Allowed formats for on-demand conversion of media
     * @var array
     */
    public $RF_MEDIA_FORMATS = array('mp3', 'wav', 'aiff', 'ogg');
    /**
     * allowed bitrates for on-demand conversion of media
     * @var array
     */
    public $RF_MEDIA_BITRATES = array('64k', '128k', '256k', '320k');
    public $force_ip_address = false;

    public function __construct()
    {
        //initialization
         if($this->force_ip_address) {
            $ip = rfExchangeEngine::CLI_IP_ADDRESS;
        } else {
            if (isset($_SERVER['REMOTE_ADDR'])) {
                $ip = $_SERVER['REMOTE_ADDR'];
            } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
            } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
                $ip = $_SERVER['HTTP_CLIENT_IP'];
            }
            $ip = rfExchangeEngine::CLI_IP_ADDRESS;
        }
        $this->ip = $ip;
    }
}


/**
 * Abstract class to be extended by the facets of the Rumblefish SDK
 */
abstract class Rumblefish_Abstract {
    
    public $ip;
    /**
     * Constructor
     * if data is passed as an array will pre-populate the parameters of the extending class
     * @param array $data (optional)
     */
    public function __construct(array $data = array()) {

        foreach ($this as $key => $value) {
            if (isset($data[$key])) {
                $this->$key = $data[$key];
            }
        }
    }
    /**
     * Converts the current class to an array,
     * this method can be overwritten to do any additional logic should it be required
     * @return array
     */
    public function toArray(){

        $return = array();
        foreach($this as $key=>$value){
            if($key[0] != '_'){
                if($key == 'start'){
                    $value = (int)$value;
                }
                $return[$key] = $value;
            }
        }
        $return['ip'] = rfExchangeEngine::getIp();

        return $return;
    }
}
/**
 * Licence Object
 */
class Rumblefish_Licence extends Rumblefish_Abstract {
    /**
     * Your access token
     * @var string
     */
    public $token;
    /**
     * The media ID, or a group of media ID's. You may license more than one track per project.
     * @var array
     */
    public $media_id;
    /**
     * A selection from the license types provided by the GET method
     * @see Rumblefish::getLicences
     * @var string 
     */
    public $license_type;
    /**
     * A project, typically a video, where the media will be published. NOTE: one license, one project
     * @var string 
     */
    public $project_reference;
    /**
     * The licensee's email address
     * @var string
     */
    public $email;
    /**
     * The licensee's first name
     * @var string
     */
    public $firstname;
    /**
     * The licensee's last name.
     * @var string
     */
    public $lastname;
    /**
     * The licensee's company
     * non-required parameter
     * @var string
     */
    public $company;
    /**
     * The licensee's first address line
     * @var string
     */
    public $address1;
    /**
     * The licensee's second address line
     * @var string
     */
    public $address2;
    /**
     * The licensee's city.
     * non-required parameter
     * @var string
     */
    public $city;
    /**
     * The licensee's state
     * @var string
     */
    public $state;
    /**
     * The licensee's postal code or ZIP code.
     * @var string
     */
    public $postal_code;
    /**
     * The licensee's country.
     * @var string
     */
    public $country;
    /**
     * The licensee's phone number
     * @var string
     */
    public $phone;
    /**
     * A licensee's internal portal reference number.
     * @var string
     */
    public $licensee_reference;
    
    public $transaction_reference;
    /**
     * Tests all required fields are filled.
     * @see Rumblefish_Abstract::toArray()
     * @return array 
     */
    public function toArray() {

        if ($this->token === null) {
            $this->token = rfExchangeEngine::getToken();
        }

        if(!$this->state || $this->state == ' ') {
            $this->state = '';
        }
        $required = array('media_id','token','license_type','project_reference','email','firstname','lastname',
                            'address1','city','state','postal_code','country');
        return parent::toArray();
    }
}

/**
 * Playlist object
 * Playlists are lists of music or sound tracks that have been created by, or for,
 * a Portal. Playlists facilitate music searches because they are songs that have been
 * selected to fit a mood or occasion, as defined in the description of the list.
 *
 * Playlists are owned by a Portal. The Portal creating the list may keep it private,
 * or share it. For example, if Rumblefish creates a special occasion Playlist, intended
 * for all Portals to use, we will share it. Playlists default to private, in case a Portal
 * does not wish to share their curation efforts with other portals.
 * Shared Playlists from other Portals, or Playlists you are constructing, may need to be
 * hidden from your users. You may "enable" other Portals' shared Playlists or your "owned"
 * playlists, in order to control access. This is the purpose of the filter parameter.
 * If you query an individual id or legacy_id, the response includes the Playlist media.
 * If you query without a specific Playlist ID you will receive a list of Playlists.
 */
class Rumblefish_Playlist extends Rumblefish_Abstract {
    /**
     * Do we want shared playlists?
     * @var bool
     */
    public $_shared = false;
    /**
     * A list of Media for that Playlist, if it is shared.
     * @var int
     */
    public $id;
    /**
     * A list of Media for that Playlist, if it is shared.
     * @var int
     */
    public $legacy_id;
    /**
     * A list of Playlists that are owned by the Portal.
     * @var string
     */
    public $token;

    /**
     * Filters Access to Playlists for a Portal
     * all, owned, enabled
     * @var string
     */
    public $filter;

    /**
     * Search by playlist title or editorial
     * @var string
     */
    public $q;
    /**
     * The offset to start listing from
     * @var int
     */
    public $start = 0;
    public $sort;
    public $direction;
    /**
     * Returns array, checks if shared or portal specific playlist
     * @see Rumblefish_Abstract::toArray()
     * @return array
     */
    public function toArray(){
        if(!$this->_shared && null === $this->token){
            $this->token = rfExchangeEngine::getToken();
            if(!$this->token){
                throw new rfExchangeException('For Private playlists you need to be authenticated');
            }
        }
        $this->q = str_replace(" ","+",$this->q);
        return parent::toArray();
    }
}

/**
 * Search Class
 * Search currently returns media records and is seriously in development at the moment!
 *
 * Search will always return 10 results, but will provide a total_media value that shows
 * how many total results were found for your search. Use the start parameter to control pagination.
 *
 * If you also include a token, your results will be constrained by the data available to
 * the portal you have authenticated for.
 *
 * Adding a facets parameter to your search returns extra metadata about the distribution of results
 * within that facet. You're welcome to request multiple facets counts, by comma delimiting them
 */
class Rumblefish_Search extends Rumblefish_Abstract {

    /**
     * Search query. Typically keywords
     * @var string
     */
    public $q;

    /**
     * Your access token. Restricts results to your portal.
     * @var string
     */
    public $token;

    /**
     * Beats Per Minute. Accepts ranges (eg: "100-150")
     * @var mixed
     */
    public $bpm;

    /**
     * Media duration, in seconds. Accepts ranges (eg: "60-90")
     * @var mixed
     */
    public $duration;
    /**
     * Title of the track
     * @var string
     */
    public $title;
    /**
     * Artist name
     * @var string
     */
    public $artist_names;
    /**
     * Album name
     * @var string
     */
    public $album_title;
    /**
     * Primary genre
     * @var string
     */
    public $genre;
    public $catalog_id;
    public $catalog_name;
    public $catalog_provider_id;
    public $catalog_provider_name;
    /**
     * Whether the media contains explicit content
     * @var bool
     */
    public $explicit;
    /**
     * Global Release Identifier
     * @var string
     */
    public $grid;
    /**
     * International Standard Recording Code
     * @var string
     */
    public $isrc;
    /**
     * International Standard Work Code
     * @var string
     */
    public $iswc;
    /**
     * Universal Product Code
     * @var string
     */
    public $upc;
    /**
     * returns extra metadata about the distribution of results within that facet
     * options - genre, duration, bpm, catalog_name, artist_names, explicit, album_title
     * @var string
     */
    public $facets;
    /**
     * Returns results starting at this location in the set
     * @var int
     */
    public $start = 0;
    /**
     * Sorts results by the provided field.
     * available fields: title, genre, bpm, explicit, duration, picked_at
     * @var string
     */
    public $sort = 'picked_at';
    /**
     * Determines the sort direction.
     * asc / desc
     * @var string
     */
    public $direction = 'desc';

    public $rank;

    protected $__sortFields = array(
        'title', 'genre', 'bpm', 'explicit', 'duration', 'picked_at','artist_names'
    );

    public function __construct(array $data = array()) {
        //fixes for the artist,catalog and album
        if (isset($data['artist'])) {
            $data['artist_names'] = $data['artist'];
        }
        if (isset($data['album'])) {
            $data['album_title'] = $data['album'];
        }
        if (isset($data['facets']) && is_array($facets)) {
            $data['facets'] = implode(",", $facets);
        }
        parent::__construct($data);
    }

    /**
     * Checks to make sure at least one parameter is set before returning the parent method.
     * @see Rumblefish::toArray()
     * @return array
     */
    public function toArray() {
        $oneFound = false;
        foreach ($this as $key => $value) {
            if ($key[0] != '_') {
                if ($value != '') {
                    $oneFound = true;
                    break;
                }
            }
        }
        $this->sort = strtolower($this->sort);
        if(!in_array($this->sort, $this->__sortFields)){
            $this->sort = 'picked_at';
        }
        $this->direction = strtolower($this->direction);
        if($this->direction != 'desc' && $this->direction != 'asc'){
            $this->direction = 'desc';
        }

        if($this->rank == 0){
            $this->rank = '';
        }

        $this->q = str_replace(" ", "+", $this->q);

        if (!$oneFound) {
            throw new rfExchangeException('Search requires at least one parameter set');
        }
        if (!$this->token) {
            if (rfExchangeEngine::getToken()) {
                $this->token = rfExchangeEngine::getToken();
            } else {
                throw new rfExchangeException('Search requires a token');
            }
        }
        return parent::toArray();
    }

}
// Custom exception handler
class rfExchangeException extends Exception
{
    public function __construct($message, $code = 0) {
        parent::__construct($message, $code);
    }
    public function __toString() {
        return __CLASS__ . ": [{$this->code}]: {$this->message}\n";
    }
}
?>
