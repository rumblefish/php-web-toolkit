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
?>


<div class="searchResultsDiv">
    <h3><?php if(trim($searchstring) != '') { ?>Search for <em><?php echo $searchstring;?></em> had <?php } ?><?php echo number_format($total);?> results.</h3>

    <div class="row" style="margin-top: 20px;">
        <div class="two columns buttonblock active" data-rel="songssearchresults">Songs (<?php echo number_format($songs['total']);?>)</div>
      <?php /*  <div class="two columns buttonblock" data-rel="occassions">Occassion (xx)</div> */ ?>
        <div class="two columns buttonblock" data-rel="playlistsearchresults">Playlists (<?php echo number_format($playlists['total']);?>)</div>
      <div class="two columns buttonblock" data-rel="sfxsearchresults">Sound Effects (<?php echo number_format($sfx['total']);?>)</div>
    </div>
   <div class="row righttxt">
    <a href="/cms/about_licences" class="zpmodal aboutlicencelink">About Music Licenses</a>
</div>
    <div class="searchResultsResults">
        <div class="songssearchresults">
            <?php echo $songs['output'];?>
        </div>
        <div class="playlistsearchresults" style="display:none;">
            <?php echo $playlists['output'];?>
        </div>
        <div class="sfxsearchresults" style="display:none;">
            <?php echo $sfx['output'];?>
        </div>
    </div>
</div>
