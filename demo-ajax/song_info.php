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


$trackID='';
if (isset($_REQUEST['trackID'])){
    $trackID = $_REQUEST['trackID'];
}

$workingDir = dirname(__FILE__);

require_once($workingDir.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'rfSDK'. DIRECTORY_SEPARATOR .'rfBase.php');
require_once($workingDir.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR. 'rfSDK'. DIRECTORY_SEPARATOR .'rfExchange.php');
require_once($workingDir.DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR . 'rfSDK'. DIRECTORY_SEPARATOR .'rfUtils.php');


rfExchange::setUp("sandbox", "sandbox");
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
/*
 * Song info
 */
$data = rfExchange::songInfo($trackID);
$result = rfUtils::songInfo($data);

echo $result;
?>
