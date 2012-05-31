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

require_once 'rfExchangeEngine.php';
class rfExchange extends rfExchangeEngine {

    private static function playlist($id,$params=array()){

        self::authenticate(self::$__settings->token);
        $playlistObj = new Rumblefish_Playlist($params);
        $playlistObj->id = $id;
        $playlistObj->token = self::$__settings->token;
        $playlist = self::getPlaylist($playlistObj);
        return $playlist;
    }

    public static function occasionlist($id, $params=array()){
        $output = self::getOutput_format();
        self::setOutput_format('Array');
        $playlists = false;
        if (!$playlists) {
            $playlists = self::occasion($id);

            foreach ($playlists['playlists'] as $k => $pl) {
                $playItem = self::playlist($pl['id'],$params);
                if ($playItem) {
                    $playlists['playlists'][$k] = $playItem;
                }
            }
        }
        self::setOutput_format($output);
        return self::formatResult($playlists['playlists']);
    }

    public static function occasionTree(){
        $output = self::getOutput_format();
        self::setOutput_format('Array');

        $tree = false;
        if (!$tree) {
            $occassions = self::occasion();

            $grandparents = array();
            $parents = array();
            $children = array();
            foreach ($occassions as $occassion) {
                $grandparents[$occassion['id']] = $occassion['name'];
                if ($occassion['children']) {
                    foreach ($occassion['children'] as $parent) {
                        $parents[$occassion['id']][] = array('id' => $parent['id'], 'name' => $parent['name']);
                        if ($parent['children']) {
                            foreach ($parent['children'] as $child) {
                                $children[$parent['id']][] = array('id' => $child['id'], 'name' => $child['name']);
                            }
                        }
                    }
                }
            }
            $tree = array();
            $tree['grandparents'] = $grandparents;
            $tree['parents'] = $parents;
            $tree['children'] = $children;
        }
        self::setOutput_format($output);
        return self::formatResult($tree);
    }

     public static function getFeaturedplaylists() {
        $output = self::getOutput_format();
        self::setOutput_format('Array');

        $data['playlists'] = false;
        $data['playlists'] = self::getFeatured();
        
        self::setOutput_format($output);
        return self::formatResult($data);
    }


    //get artist playlist
    public static function artistTracks($artist_id=0) {
        $output = self::getOutput_format();
        self::setOutput_format('Array');

        $artist = self::artist($artist_id);
        $data['media'] = self::mapMediaArray($artist['media']);

        foreach ($data['media'] as $k => $r) {
            $data['media'][$k]['album_name'] = $r['album'];
        }

        $data['artist'] = $artist;
        self::setOutput_format($output);
        return self::formatResult($data);
        
    }
    
    public static function getFeatured() {
        $output = self::getOutput_format();
        self::setOutput_format('Array');

        $playlists = array(
            array(
                'title' => 'Current Events',
                'lists' => array(
                    '424' => self::playlist(424),
                    '400' => self::playlist(400),
                    '401' => self::playlist(401)
                 )
            ),
            array(
              'title' => "Action Sports",
                "lists" => array(
                     852 => self::playlist(852),
                     409 => self::playlist(409),
                     395 => self::playlist(395)
                )
            ),
            array(
                'title' => 'Best of',
                'lists' => array(
                    '417' => self::playlist(417),
                    '367' => self::playlist(367),
                   // '1086' => self::playlist(1086)
                )
            ),
            array(
                'title' => 'Random',
                'lists' => array(
                    '856' => self::playlist(856),
                    //'356' => self::playlist(356),
                    '960' => self::playlist(960)
                )
            )
        );
        
        self::setOutput_format($output);
        return self::formatResult($playlists);
    }

    public static function playlistTracks($id, $params=array()) {

        $output = self::getOutput_format();
        self::setOutput_format('Array');
        $tracks = self::playlist($id, $params);

        $data['media'] = array();
        $data['playlist'] = array(
            'image_url' => $tracks['image_url'],
            'title' => $tracks['title'],
            'id' => $tracks['id'],
            'tracks' => $tracks['media_count'],
            'occassion' => isset($tracks['occassion']) ? $tracks['occassion'] : '',
            'editorial' => $tracks['editorial'],
            'artist' => isset($tracks['artist']) ? $tracks['artist'] : '',
            'picked' => isset($tracks['picked']) ? $tracks['picked'] : 0
        );

        $data['media'] = self::mapMediaArray($tracks['media']);

        self::setOutput_format($output);
        return self::formatResult($data);
    }

     private static function mapMediaArray($medias) {
        $output = self::getOutput_format();
        self::setOutput_format('Array');

        $return = array();
        foreach ($medias as $media) {
            $item = array();
            $item['title'] = $media['title'];

            $artists = array();
            $artist_tooltips = array();
            if (isset($media['artists'])) {
                foreach ($media['artists'] as $artist) {
                    $artists[$artist['name']] = $artist['name'];
                    $artist_tooltips[] = $artist['name'];
                }
            }
            $item['id'] = $media['id'];
            $item['artist'] = implode(", ", $artists);
            $item['artist_tooltip'] = implode(", ", $artist_tooltips);

            $item['length'] = sprintf("%2d:%02.2d", floor($media['duration'] / 60), $media['duration'] % 60);
            $item['genre'] = $media['genre'];
            $item['album'] = isset($media['album']['title']) ? $media['album']['title'] : '';

            $item['picked'] = isset($media['picked']) ? $media['picked'] : '0';

            $return[] = $item;
        }

        self::setOutput_format($output);
        return self::formatResult($return);
    }

    /**
    * Displays the moodmap playlist items
    */
    public static function moodMaplistTracks($x=0, $y=0, $params=array()){
        $output = self::getOutput_format();
        self::setOutput_format('Array');
        self::authenticate(self::$__settings->token);
        $mmap = self::getPlaylistId($x, $y);

        $playlistID= (int)$mmap + 187;
        $data = array();
        if ($mmap > 0) {
            $items = self::playlist($playlistID, $params);
            $data['media'] = self::mapMediaArray($items['media']);
        }
        self::setOutput_format($output);
        return self::formatResult($data);
    }


    public static function getTrack($id){
        $output = self::getOutput_format();
        self::setOutput_format('Array');

        $track = self::getMedia($id);
        $return=array();
        if ($track) {
            $return = array(
                'track' => $track['preview_url'],
                'title' => $track['title']
            );
        }

        self::setOutput_format($output);
        return self::formatResult($return);
    }

    function getWaveForm($id) {
        $output = self::getOutput_format();
        self::setOutput_format('Array');
        
        $track = self::getMedia($id);

        $return=array();
        if ($track) {
            $return = array(
                'image' => $track['waveform_url'],
                'title' => $track['title']
            );
        }
        
        self::setOutput_format($output);
        return self::formatResult($return);
    }

    public static function getPlaylistId($x, $y) {
         $coords = array(
            '0' => array(
                '0' => '1',
            ),
            '17' => array(//6 active
                '0' => '0',
                '17' => '0',
                '34' => '0',
                '51' => '13',
                '68' => '13',
                '85' => '19',
                '102' => '25',
                '119' => '91',
                '136' => '97',
                '153' => '103',
                '170' => '103',
                '187' => '0',
                '204' => '0',
                '222' => '0'
            ),
            '34' => array(
                '0' => '0',
                '17' => '0',
                '34' => '8',
                '51' => '8',
                '68' => '14',
                '85' => '20',
                '102' => '26',
                '119' => '92',
                '136' => '98',
                '153' => '104',
                '170' => '109',
                '187' => '109',
                '204' => '0',
                '222' => '0'
            ),
            '51' => array(
                '0' => '0',
                '17' => '4',
                '34' => '4',
                '51' => '9',
                '68' => '15',
                '85' => '21',
                '102' => '27',
                '119' => '93',
                '136' => '99',
                '153' => '105',
                '170' => '110',
                '187' => '114',
                '204' => '114',
                '222' => '0'
            ),
            '68' => array(
                '0' => '1',
                '17' => '1',
                '34' => '5',
                '51' => '10',
                '68' => '16',
                '85' => '22',
                '102' => '28',
                '119' => '94',
                '136' => '100',
                '153' => '106',
                '170' => '111',
                '187' => '115',
                '204' => '118',
                '222' => '118'
            ),
            '85' => array(
                '0' => '2',
                '17' => '2',
                '34' => '6',
                '51' => '11',
                '68' => '17',
                '85' => '23',
                '102' => '29',
                '119' => '95',
                '136' => '101',
                '153' => '107',
                '170' => '112',
                '187' => '116',
                '204' => '119',
                '222' => '119'
            ),
            '102' => array(
                '0' => '3',
                '17' => '3',
                '34' => '7',
                '51' => '12',
                '68' => '18',
                '85' => '24',
                '102' => '30',
                '119' => '96',
                '136' => '102',
                '153' => '108',
                '170' => '113',
                '187' => '117',
                '204' => '120',
                '222' => '120'
            ),
            '119' => array(
                '0' => '31',
                '17' => '31',
                '34' => '34',
                '51' => '38',
                '68' => '43',
                '85' => '49',
                '102' => '55',
                '119' => '61',
                '136' => '67',
                '153' => '73',
                '170' => '79',
                '187' => '84',
                '204' => '88',
                '222' => '88'
            ),
            '136' => array(
                '0' => '32',
                '17' => '32',
                '34' => '35',
                '51' => '39',
                '68' => '44',
                '85' => '50',
                '102' => '56',
                '119' => '62',
                '136' => '68',
                '153' => '74',
                '170' => '80',
                '187' => '85',
                '204' => '89',
                '222' => '89'
            ),
            '153' => array(
                '0' => '33',
                '17' => '33',
                '34' => '36',
                '51' => '40',
                '68' => '45',
                '85' => '51',
                '102' => '57',
                '119' => '63',
                '136' => '69',
                '153' => '75',
                '170' => '81',
                '187' => '86',
                '204' => '90',
                '222' => '90'
            ),
            '170' => array(
                '0' => '0',
                '17' => '37',
                '34' => '37',
                '51' => '41',
                '68' => '46',
                '85' => '52',
                '102' => '58',
                '119' => '64',
                '136' => '70',
                '153' => '76',
                '170' => '82',
                '187' => '87',
                '204' => '87',
                '222' => '0'
            ),
            '187' => array(
                '0' => '0',
                '17' => '0',
                '34' => '42',
                '51' => '42',
                '68' => '47',
                '85' => '53',
                '102' => '59',
                '119' => '56',
                '136' => '71',
                '153' => '77',
                '170' => '83',
                '187' => '83',
                '204' => '0',
                '222' => '0'
            ),
            '204' => array(
                '0' => '0',
                '17' => '0',
                '34' => '0',
                '51' => '48',
                '68' => '48',
                '85' => '54',
                '102' => '60',
                '119' => '66',
                '136' => '72',
                '153' => '78',
                '170' => '78',
                '187' => '0',
                '204' => '0',
                '222' => '0'
            ),
            '222' => array(
                '0' => '61',
            )
        );

        if (!isset($playlistID)) {
            $mmap = 0;
            $xcordmap = array_keys($coords);

            $xs = 0;
            foreach ($xcordmap as $xm => $row) {
                if ($row <= $x) {
                    $xs = $row;
                }
            }
            if ($xs > 0) {
                $ycords = $coords[$xs];
                foreach ($ycords as $yc => $mmid) {
                    if ($yc <= $y) {
                        $mmap = $mmid;
                    }
                }
            }
            $playlistID = (int) $mmap;
        }
        return $playlistID;
    }

    public static function sfx(){
        $output = self::getOutput_format();
        self::setOutput_format('Array');

        $rows = self::sfx_category();
        $tree = array();
        foreach($rows as $row){
            $tree[] = array('id' => $row['id'], 'name' => $row['name']);
        }

        self::setOutput_format($output);
        return self::formatResult($tree);

    }

     public static function sfxChild($id){

        $output = self::getOutput_format();
        self::setOutput_format('Array');

        $results = self::sfx_category($id);

        $rows = array();
        foreach ($results['playlists'] as $playlist) {
            if ($playlist['media_count'] > 0) {
                $rows[] = array('id'=>$playlist['id'], 'title'=>$playlist['title']);
            }
        }

        return $rows;
    }

    public static function sfxTracks($id, $params=array()){
        
        $output = self::getOutput_format();
        self::setOutput_format('Array');
        
        $tracks = self::playlist($id, $params);
        
        $data['media'] = array();
        $data['media'] = self::mapMediaArray($tracks['media']);

        self::setOutput_format($output);
        return self::formatResult($data);
    }

    public static function songInfo($id){
        $trackInfo = self::getMedia($id);
        return $trackInfo;
    }

    public static function searchSongs($params=array(), $sfx_only=false){

        foreach ($params as $k => $v) {
            $params[$k] = urldecode($v);
        }
        $songs = array();
        $data['searchString'] = isset($params['q']) ? $params['q'] : false;

        $songsResults = self::songs($params, $sfx_only);
        $songs['media'] = array();
        if (isset($songsResults['media'])){
            if ($songsResults['media']){
                $songs['media'] = self::mapMediaArray($songsResults['media']);
            }
        }

        return $songs;
    }
    public static function songs($params, $sfx_only = false) {
            $provider_ids = array();
            $catalog_ids = array();
            $params['catalog_provider_id'] = array();
            if (isset($params['provider_id'])) {
                $parts = explode(",", $params['provider_id']);
                $ncat = array();
                foreach ($parts as $part) {
                    if ($part != '') {
                        $ncat[] = $part;
                    }
                }
                $params['catalog_provider_id'] = $ncat;
                //$params['catalog_id'] = array_shift($ncat);
            }

            if ($sfx_only) {
                $rows = rfExchange::sfx_category();
                $ncat = array();
                foreach ($rows as $row) {
                    $ncat[] = $row['id'];
                }
                $params['catalog_id'] = $ncat;
                //$params['catalog_id'] = array_shift($ncat);
            } else {

                if (isset($params['licence'])) {

                    $licences = rfExchange::getLicences();
                    foreach ($licences as $key=>$val){
                        if ($val['id']==$params['licence']){
                            foreach($val['catalog_ids'] as $key2=>$val2){
                                $params['catalog_id'][] = $val2;
                            }
                        }
                    }
                }

            }

            $search = new Rumblefish_Search($params);
            $search->facets = 'explicit';

            $return = false;
            if (!$return) {
                $return = array();
                $result = self::search($search);
                $return['total'] = $result['total_media'];
                foreach ($result['media'] as $media) {
                    $return['media'][] = $media;
                }
            }
            return $return;
    }



    //search playlists
    public static function searchPlaylists($params=array()) {

        $playlists = array();
        $params['filter'] = 'all';
        $data['total'] = 0;

        self::authenticate(self::$__settings->token);
        $search = new Rumblefish_Playlist($params);
        $result = self::getPlaylist($search, true);

        $songsResults = array();
        foreach ($result['playlists'] as $i => $media) {
            $songsResults['media'][$i] = $media;
        }

        foreach ($songsResults['media'] as $i => $media) {
            $pl = self::playlist($media['id']);

            if (count($pl['media']) > 0){
                $songsResults['media'][$i]['catalog']['id'] = $pl['media'][0]['catalog']['id'];
            }
        }

        $playlists = array();
        foreach ($songsResults['media'] as $media) {
            $item = array();
            $item['id'] = $media['id'];
            $item['title'] = $media['title'];
            if (isset($media['image_url'])) {
                $item['image_url'] = $media['image_url'];
            }
            $artists = array();
            $artist_tooltips = array();
            if (isset($media['artists'])) {
                foreach ($media['artists'] as $artist) {
                    $artists[$artist['name']] = $artist['name'];
                    $artist_tooltips[] = $artist['name'];
                }
            }

            $item['artist'] = implode(", ", $artists);
            $item['artist_tooltip'] = implode(", ", $artist_tooltips);
            if (isset($media['occasion'])) {
                $item['occasion'] = $media['occasion'];
            }
            $item['picked'] = $media['picked'];
            //$item['licences'] = $licence_model->getLicenceByCatalogId($media['catalog']['id']);
            $playlists[] = $item;
        }

        return $playlists;
    }

    //get genre playlist
    public static function genrePlaylist($genre='acoustic') {
        $output = self::getOutput_format();
        self::setOutput_format('Array');

        $genre = str_replace(".", "/", $genre);
        $search_model = new rfSearchModel();
        $results = $search_model->songs($params);

        $data['media'] = self::mapMediaArray($results['media']);


        self::setOutput_format($output);
        return self::formatResult($data);

    }
}
