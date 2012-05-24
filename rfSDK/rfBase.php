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


class rfBase{

    protected $__url = false;
    protected $__querystring = false;
    protected $__args = array();
    protected $__verb = 'GET';
    protected $__request_body = false;
    protected $__request_length = 0;
    protected $__username = false;
    protected $__pass = false;
    protected $__accept_type = 'application/json';
    protected $__response_body = false;
    protected $__response_info = false;
    protected $__timeout = 120;
    protected $__handle = false;
    protected $__encode_auth = false;
    protected $__curl_error = false;

    // constructs our client
    public function __construct($url = null, $verb = 'GET', $request_body = null) {
        $this->__url = $url;
        $this->__verb = $verb;
        $this->__request_body = $request_body;
        $this->__request_length = 0;
        $this->__username = false;
        $this->__pass = false;
        $this->__accept_type = 'application/json';
        $this->__response_body = null;
        $this->__response_info = null;

        if ($this->__request_body) {
            $this->buildPostBody();
        }
    }

    public function flush() {
        $this->__url = false;
        $this->__querystring = false;
        $this->__args = array();
        $this->__verb = 'GET';
        $this->__request_body = false;
        $this->__request_length = 0;
        $this->__username = false;
        $this->__pass = false;
        $this->__accept_type = 'application/json';
        $this->__response_body = false;
        $this->__response_info = false;
        $this->__timeout = 60;
        $sh = false;
        $this->__encode_auth = false;
    }

    public function execute() {
        $sh = curl_init();
        //$this->setAuth();

        try {
            switch (strtoupper($this->__verb)) {
                case 'GET':
                    //$this->executeGet();
                    break;

                case 'POST':
                    if (!is_string($this->__request_body)) {
                        $this->buildPostBody();
                    }

                    curl_setopt($sh, CURLOPT_POSTFIELDS, $this->__request_body);
                    curl_setopt($sh, CURLOPT_POST, 1);
                    break;

                case 'PUT':
                    if (!is_string($this->__request_body)) {
                        $this->buildPostBody();
                    }

                    $this->__request_length = strlen($this->__request_body);

                    //$fhandle = fopen('php://memory', 'rw');
                    $fhandle = fopen('php://temp', 'r+');
                    fwrite($fhandle, $this->__request_body);
                    rewind($fhandle);

                    curl_setopt($sh, CURLOPT_INFILE, $fhandle);
                    curl_setopt($sh, CURLOPT_INFILESIZE, $this->__request_length);
                    curl_setopt($sh, CURLOPT_PUT, true);
                    break;

                case 'DELETE':
                    curl_setopt($sh, CURLOPT_CUSTOMREQUEST, 'DELETE');
                    break;

                default:
                    throw new InvalidArgumentException('[' . $this->__verb . '] is invalid - please use GET, POST, PUT or DELETE.');
            }

            $url = $this->__url;
            // if there are any elements within our querystring array, glue those suckers to the url
            if ($this->__querystring) {
                $qs[] = $this->__url;
                $qs = array_values(array_merge($qs, $this->__querystring));
                $url = (count($qs) > 1) ? implode('/', $qs) : $qs[0];
            }

            $args = null;
            if ($this->__args) {
                foreach ($this->__args as $k => $v) {
                    if(is_array($v)){
                        foreach($v as $sv){
                             $args[] = $k . '[]=' . $sv;
                        }
                    }else{
                        $args[] = $k . '=' . $v;
                    }
                }
                $args = (count($args) > 1) ? implode('&', $args) : $args[0];
                $url .= '?' . $args;
            }

            curl_setopt($sh, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($sh, CURLOPT_TIMEOUT, $this->__timeout);
            curl_setopt($sh, CURLOPT_URL, $url);
            curl_setopt($sh, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($sh, CURLOPT_HTTPHEADER, array('Accept: ' . $this->__accept_type));

            if ($this->__username && $this->__pass) {
                //url_setopt($sh, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
                curl_setopt($sh, CURLOPT_HTTPAUTH, CURLAUTH_ANY);

                if ($this->__encode_auth) {
                    $this->auth_string = base64_encode($this->__username . ':' . $this->__pass);
                    curl_setopt($sh, CURLOPT_USERPWD, base64_encode($this->__username . ':' . $this->__pass));
                } else {
                    $this->auth_string = $this->__username . ':' . $this->__pass;
                    curl_setopt($sh, CURLOPT_USERPWD, $this->__username . ':' . $this->__pass);
                }
            }

            $this->__response_body = curl_exec($sh);
            $this->__response_info = curl_getinfo($sh);
            $this->__curl_error = curl_error($sh);

            curl_close($sh);
            if(isset($fhandle)) {
                fclose($fhandle);
            }


        } catch (InvalidArgumentException $e) {
            curl_close($sh);
            throw $e;
        } catch (Exception $e) {
            curl_close($sh);
            throw $e;
        }
    }

    public function buildPostBody($data = null) {
        $data = ($data !== null) ? $data : $this->__request_body;

        if (!is_array($data)) {
            throw new InvalidArgumentException('An array is expected');
        }
        $data = preg_replace('/%5B(?:[0-9]|[1-9][0-9]+)%5D=/', '[]=',  http_build_query($data, '', '&'));


        $this->__request_body = $data;
    }

    protected function executeGet() {
        $this->doExecute();
    }

    protected function executePost() {
        if (!is_string($this->__request_body)) {
            $this->buildPostBody();
        }

        curl_setopt($sh, CURLOPT_POSTFIELDS, $this->__request_body);
        curl_setopt($sh, CURLOPT_POST, 1);

        $this->doExecute();
    }

    protected function executePut() {
        if (!is_string($this->__request_body)) {
            $this->buildPostBody();
        }

        $this->__request_length = strlen($this->__request_body);

        //$fhandle = fopen('php://memory', 'rw');
        $fhandle = fopen('php://temp', 'r+');
        fwrite($fhandle, $this->__request_body);
        rewind($fhandle);

        curl_setopt($sh, CURLOPT_INFILE, $fhandle);
        curl_setopt($sh, CURLOPT_INFILESIZE, $this->__request_length);
        curl_setopt($sh, CURLOPT_PUT, true);

        $this->doExecute();

        fclose($fhandle);
    }

    protected function executeDelete() {
        curl_setopt($sh, CURLOPT_CUSTOMREQUEST, 'DELETE');

        $this->doExecute();
    }

    protected function doExecute() {
        $this->setCurlOpts($sh);
        $this->__response_body = curl_exec($sh);
        $this->__response_info = curl_getinfo($sh);

        curl_close($sh);
    }

    protected function setCurlOpts() {
        $url = $this->__url;
        // if there are any elements within our querystring array, glue those suckers to the url
        if ($this->__querystring) {
            $qs[] = $this->__url;
            $qs = array_values(array_merge($qs, $this->__querystring));
            $url = (count($qs) > 1) ? implode('/', $qs) : $qs[0];
        }

        $args = null;
        if ($this->__args) {
            foreach ($this->__args as $k => $v) {
                $args[] = $k . '=' . $v;
            }
            $args = (count($args) > 1) ? implode('&', $args) : $args[0];
            $url .= '?' . $args;
        }

        curl_setopt($sh, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($sh, CURLOPT_TIMEOUT, $this->__timeout);
        curl_setopt($sh, CURLOPT_URL, $url);
        curl_setopt($sh, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($sh, CURLOPT_HTTPHEADER, array('Accept: ' . $this->__accept_type));

        if ($this->__username && $this->__pass) {
            //curl_setopt($sh, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
            curl_setopt($sh, CURLOPT_HTTPAUTH, CURLAUTH_ANY);

            if ($this->__encode_auth) {
                $this->auth_string = base64_encode($this->__username . ':' . $this->__pass);
                curl_setopt($sh, CURLOPT_USERPWD, base64_encode($this->__username . ':' . $this->__pass));
            } else {
                $this->auth_string = $this->__username . ':' . $this->__pass;
                curl_setopt($sh, CURLOPT_USERPWD, $this->__username . ':' . $this->__pass);
            }
        }
    }

    protected function setAuth() {
        if ($this->__username && $this->__pass) {
            //curl_setopt($sh, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
            curl_setopt($sh, CURLOPT_HTTPAUTH, CURLAUTH_ANY);

            if ($this->__encode_auth) {
                $this->auth_string = base64_encode($this->__username . ':' . $this->__pass);
                curl_setopt($sh, CURLOPT_USERPWD, base64_encode($this->__username . ':' . $this->__pass));
            } else {
                $this->auth_string = $this->__username . ':' . $this->__pass;
                curl_setopt($sh, CURLOPT_USERPWD, $this->__username . ':' . $this->__pass);
            }
        }
    }

    public function getAcceptType() {
        return $this->__accept_type;
    }

    public function setAcceptType($accept) {
        $this->__accept_type = $accept;
    }

    public function getPassword() {
        return $this->__pass;
    }

    public function setPassword($password) {
        $this->__pass = $password;
    }

    public function getResponseBody() {
        return $this->__response_body;
    }

    public function getResponseInfo() {
        return $this->__response_info;
    }

    public function getUrl() {
        $url = $this->__url;
        // if there are any elements within our querystring array, glue those suckers to the url
        if ($this->__querystring) {
            $qs[] = $this->__url;
            $qs = array_values(array_merge($qs, $this->__querystring));
            $url = (count($qs) > 1) ? implode('/', $qs) : $qs[0];
        }

        $args = null;
        if ($this->__args) {
            foreach ($this->__args as $k => $v) {
                if(is_array($v)){
                    foreach($v as $sv){
                        $args[] = $k . '[]=' . $sv;
                    }
                }else{
                    $args[] = $k . '=' . $v;
                }
            }
            $args = (count($args) > 1) ? implode('&', $args) : $args[0];
            $url .= '?' . $args;
        }

        return $url;
    }

    public function setUrl($url) {
        $this->__url = $url;
    }

    // chainable
    public function urlAppend($string) {
        $qs = $this->__querystring;
        $qs[] = urlencode($string);
        $this->__querystring = $qs;
        return $this;
    }

    // chainable
    // pass it an array of key/value pairs
    public function addArgs($arg_array) {
        $qs = array_merge($this->__args, $arg_array);
        $this->__args = $qs;
        return $this;
    }

    public function getUsername() {
        return $this->__username;
    }

    public function setUsername($username) {
        $this->__username = $username;
    }

    public function getVerb() {
        return $this->__verb;
    }

    public function setVerb($verb) {
        $this->__verb = $verb;
    }

    public function setTimeout($ms) {
        $this->__timeout = $ms;
    }

    public function encodeAuth($bool = true) {
        $this->__encode_auth = (bool) $bool;
    }

}
?>
