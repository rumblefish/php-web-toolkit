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


class rfUtils{
    public function __construct() {
    }
    // public static function
    public static function occasion($data=array()){
        return self::toString(dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR.'occasion.php', $data);
    }
    public static function playLists($data=array()){
        $data['results'] = $data;
        return self::toString(dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR.'playList.php', $data);
    }
    public static function featuredplayLists($data=array()){
        return self::toString(dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR.'featuredplayLists.php', $data);
    }
    public static function trackList($data=array()){
        return self::toString(dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR.'trackList.php', $data);
    }
    public static function moodMap($x=111,$y=111){
        $data['x'] = $x;
        $data['y'] = $y;
        return self::toString(dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR.'moodMap.php', $data);
    }
    public static function syncPlayer($default=''){
        $data['default'] = $default;
        return self::toString(dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR.'syncPlayer.php', $data);
    }
    public static function sfx($data=array()){
        $data['tree'] = $data;
        return self::toString(dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR.'sfx.php', $data);
    }
    public static function songInfo($data){
        return self::toString(dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR.'songInfo.php', $data);
    }
    public static function searchFilter($data=array()){
        return self::toString(dirname(__FILE__).DIRECTORY_SEPARATOR.'tmpl'.DIRECTORY_SEPARATOR.'searchFilter.php', $data);
    }

     /**
     * Fetches the contents of a file as a string
     *
     * @param string $file
     * @param array $vars Optional.
     * @return bool|string  Contents or false if file not found.
     */
    public static function toString($file, $vars = false) {

        if (!is_file($file)){
            throw new rfExchangeException('Invalid template file: '. $file);
        }

        ob_start();
        if ($vars && $vars instanceof obj) {
            $vars = ($vars->asArray());
            foreach ($vars as $key => $value) {
                $$key = $value;
            }
        } else if ($vars) {
            // Load variables
            foreach ($vars as $key => $value) {
                $$key = $value;
            }
        }

        include($file);
        $out = ob_get_contents();
        ob_end_clean();
        return $out;
    }
}
?>
