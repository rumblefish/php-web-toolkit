<?php
include_once($_SERVER['DOCUMENT_ROOT'].'/rest/rest.php');
include_once($_SERVER['DOCUMENT_ROOT'].'/rest/rb.php');

R::setup('mysql:host=127.0.0.1;dbname=db_cad', 'db_cumretail', 'gVzendve87Vdris(rt');

//echo '<pre>' . print_r($_POST, 1) . '</pre>';
//echo '<pre>' . print_r($_GET, 1) . '</pre>';

// set an errors flag
$error = false;

try {
    // process our rest request
    $rest = Rest::getRequest();
    $data = false;
    // we now use the out data to do our queries etc

    $query = "SELECT SQL_CALC_FOUND_ROWS p.prodID AS rowID, p.code, p.title, p.price, p.stock, p.stock, p.shortdesc, p.author, LOWER(REPLACE(REPLACE(REPLACE(p.author, \"'\", ''), '/', ''), ' ', '')) as shortname, p.lang, p.size AS type, p.minpage, p.discprice AS size, p.discprice, IF(p.image='',p.image, CONCAT('".$_SERVER['SERVER_NAME']."/products/125x150/',p.image)) AS trackBackImage, CONCAT('".$_SERVER['SERVER_NAME']."/view/',p.prodID,'/prodlisttitle/') AS trackBackUrl FROM store_prods AS p
				,store_cats c
				,store_catlink cl
				WHERE p.active = 'Yes' AND p.deleted = 'No' AND p.price > 0 AND p.prodID = cl.linkID AND ( c.cID = 'ZP' OR c.trace LIKE 'PT|ZP|%') AND cl.cID = c.cID
				GROUP BY p.prodID
				ORDER BY p.stock DESC, p.title ASC";
    $params = array();

    // determine our method verb
    switch($rest->getVerb()) {
        case 'get':
                // get a paged result
                $page = 1;
                if($rest->getVars('setID')) {
                    $page = (int) $rest->getVars('setID');
                }

                $per_page = 10;
                if($rest->getVars('perSet')) {
                    $per_page = (int) $rest->getVars('perSet');
                }

                $offset = 0;
                $offset = $page - 1;

                $limit = $per_page;
                $offset = $offset * $limit;

                $curr_page = round((($offset / $limit) + 1));

                // execute our query
                $result = R::getAll($query . ' LIMIT ' . $offset . ', ' . $limit, $params);

                $filtered_total = R::getCell('SELECT FOUND_ROWS()');


                $returned = count($result);

                // calculate number of pages needing links
                $pages = $filtered_total / $limit;
                if ($filtered_total % $limit) {
                    $pages++;
                }
                $pages = floor($pages);

                $end = $offset + ($limit);
                if ($end > $filtered_total) {
                    $end = $filtered_total;
                }

                $start = $offset + 1;

                if($pages > 1 && $page <= $pages) {
                    $links = array();
                    for($i = 0; $i < $pages; $i++) {
                        $links[] = array(
                            'setID' => (int) $i + 1,
                            'params' => 'setID=' . ($i + 1) . '&perSet=' . $per_page,
                            'isCurrent' => ($curr_page == $i + 1) ? true : false
                        );
                    }

                    $paged = array(
                        'links' => $links,
                        'next' => ($curr_page != $pages) ? array(
                            'setID' => (int) $curr_page + 1,
                            'params' => 'setID=' . ($curr_page + 1) . '&perSet=' . $per_page
                            ) : false, 
                        'prev' => ($curr_page > 1) ? array(
                            'setID' => (int) $curr_page - 1,
                            'params' => 'setID=' . ($curr_page - 1) . '&perSet=' . $per_page
                            ) : false
                    );

                } else if($page > $pages) {
                    throw new Exception(Rest::BAD_REQUEST);
                    $paged = false;
                } else {
                    $paged = false;
                }

                $controls = array(
                        'totalRows' => (int) $filtered_total,
                        'rowCount' => (int) $returned,
                        'startRow' => ($page <= $pages) ? (int) $start : 0,
                        'endRow' => ($page <= $pages) ? (int) $end : 0,
                        'totalSets' => (int) $pages,
                        'paginate' => $paged
                    );

                $data = $controls;

                if($result) {
                    $data['rows'] = $result;
                } else {
                    throw new Exception(Rest::NOT_FOUND);
                }       
            break;

        case 'post':
            $data = '';
            throw new Exception(Rest::INVALID_METHOD);
            break;

        case 'put':
            $data = '';
            throw new Exception(Rest::INVALID_METHOD);
            break;

        case 'delete':
            $data = '';
            throw new Exception(Rest::INVALID_METHOD);
            break;

        default:
            // any unidentified method throws an error
    }
} catch (Exception $e) {
    $error = $e->getMessage();
}

if($data && !$error) {
    $output['dataSet'] = $data;
    $rest->setData($output);
    
    Rest::sendResponse(200, $rest->getData(), $rest->getType());
} else {
    // otherwise use standard http error messages
    Rest::sendResponse($error, '', '');
}

$fileHandle = fopen($_SERVER['DOCUMENT_ROOT'].'/rest/logs/requests-webSpecials-'.date("Y-M").'.txt', "a+");
foreach (Rest::$logTracker as $key=>$value) {
	fputs($fileHandle, $value);
}
fclose($fileHandle);

exit;
?>