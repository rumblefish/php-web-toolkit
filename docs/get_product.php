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

    $query = "SELECT SQL_CALC_FOUND_ROWS s.prodID AS rowID, s.code, s.title, s.price, s.stock, s.shortdesc, s.longdesc, s.author, LOWER(REPLACE(REPLACE(REPLACE(s.author, \"'\", ''), '/', ''), ' ', '')) as shortname, s.lang, s.size, s.minpage, s.discprice, IF(s.image='',s.image, CONCAT('".$_SERVER['SERVER_NAME']."/products/125x150/',s.image)) AS trackBackImage, CONCAT('".$_SERVER['SERVER_NAME']."/view/',s.prodID,'/prodlisttitle/') AS trackBackUrl, c.selcode
				FROM store_prods AS s
				LEFT JOIN selcodes c on c.sccode = s.selectioncode";
    $params = array();

    // determine our method verb
    switch($rest->getVerb()) {
        case 'get':
            // our get method will accept either an id for an individual record, or rpp and page for lists
            if($rest->getVars('rowID')) {
                // get individual record
                $id = $rest->getVars('rowID');

                $query .= ' WHERE s.prodID = ?';
                $params[] = $id;
                
                $result = R::getRow($query, $params);
                $returned = count($result);

				$copy = stripslashes(trim($result['longdesc']));

				// Encode copy
				$newcopy = '';
				if ($copy != '') {
				$lists = explode("||", $copy);
				$newcopy = "";
				for ($cc = 0; $cc < count($lists); $cc++) {
				  if (strpos($lists[$cc], "**") === FALSE) {
					$newcopy .= "<p>" . $lists[$cc] . "</p>";
				  }
				  else {
					$bullets = explode("**", $lists[$cc]);
					$counter = 0;
					foreach ($bullets as $bullet) {
					  if ($counter == 1) {
						$bulletlist = "<ul><li>" . $bullet . "</li>";
					  }
					  elseif ($counter == (count($bullets)-1)) {
						$bulletlist .= "<li>" . $bullet . "</li></ul>";
					  }
					  else {
						$bulletlist .= "<li>" . $bullet . "</li>";
					  }
					  $counter++;
					}
					$newcopy .= $bulletlist;
				  }
				}
				}
				else {
				  $copy = stripslashes(trim($result['shortdesc']));
				  if ($copy != '') {
				  $lists = explode("||", $copy);
				  $newcopy = "";
				  for ($cc = 0; $cc < count($lists); $cc++) {
					if (strpos($lists[$cc], "**") === FALSE) {
					  $newcopy .= "<p>" . $lists[$cc] . "</p>";
					}
					else {
						  $bullets = explode("**", $lists[$cc]);
						  $counter = 0;
						  foreach ($bullets as $bullet) {
							if ($counter == 1) {
							  $bulletlist = "<ul><li>" . $bullet . "</li>";
							}
							elseif ($counter == (count($bullets)-1)) {
							  $bulletlist .= "<li>" . $bullet . "</li></ul>";
							}
							else {
							  $bulletlist .= "<li>" . $bullet . "</li>";
							}
							$counter++;
						  }
						  $newcopy .= $bulletlist;
						}
					  }
					}
				}

				$result['title'] = $rest->utf8MswordFix($result['title']);
				$result['author'] = $rest->utf8MswordFix($result['author']);
				$newcopy = $rest->utf8MswordFix($newcopy);

				$result['encoded_desc'] = $newcopy;

				$format = '';
				if ($result['selcode'] != '') {
					$format .= $result['selcode'];
				}
				if ($result['size'] != '') {
					if ($format != '') {
						$format .= ",";
					}
					$format .= $result['size'];
				}
				if ($result['minpage'] != '') {
					if ($format != '') {
						$format .= ",";
					}
					$format .= $result['minpage'];
				}
				$result['format'] = $format;

                // get our total count in the db
                $filtered_total = R::getCell('SELECT FOUND_ROWS()');
                
              /*  $controls = array(
                        'totalRows' => (int) $filtered_total,
                        'totalCols' => (int) $returned
                    );*/

                $data = $controls;
                
                if($result) {
                    $data['row'] = $result;
                } else {
                    throw new Exception(Rest::NOT_FOUND);
                } 
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
$fileHandle = fopen($_SERVER['DOCUMENT_ROOT'].'/rest/logs/requests-getProduct-'.date("Y-M").'.txt', "a+");
foreach (Rest::$logTracker as $key=>$value) {
	fputs($fileHandle, $value);
}
fclose($fileHandle);

exit;
?>