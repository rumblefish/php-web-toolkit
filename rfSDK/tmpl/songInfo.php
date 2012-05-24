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


<li class="song-info row">
    <div class="ten columns">
        <dl class="song-information">
            <dt>Song Title : </dt><dd><?php echo $title; ?></dd>
            <dt>Provider Reference : </dt><dd><?php echo $provider_reference; ?></dd>
            <dt style="clear: both;">Artist : </dt><dd class="songartistcell">
                <?php
                    $artistsList = array();
                    foreach ($artists as $artist) {
                        $artistsList['artists'][] = '<a rel="">' . $artist['name'] . '</a>';
                        echo implode(",", $artistsList['artists']);
                    }
                ?>
            </dd>
            <dt>Album : </dt><dd>
            <?php
                if (isset($album['title'])){
                    echo $album['title'];
                }
            ?>
            </dd>
            <dt>Catalog : </dt>
            <dd>
                <?php
                if ($catalog['name']){
                    echo $catalog['name'];
                }
                ?>
            </dd>
            <dt>Explicit : </dt><dd><?php echo ($explicit) ? 'Yes' : 'No'; ?></dd>
        </dl>
    </div>
</li>
