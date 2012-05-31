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

    // determine our method verb
    switch($rest->getVerb()) {
        case 'get':
            // our get method will accept either an id for an individual record, or rpp and page for lists
			// $params[] = $id;
			$lang = 'eng';
			if($rest->getVars('lang')) {
				$lang = $rest->getVars('lang');
			}

			$dbTable = 'retail_oordenkings';
			if (strtolower(trim($lang)) == 'eng') {
				$dbTable = 'retail_oordenkings';
			} else if (strtolower(trim($lang)) == 'afr') {
				$dbTable = 'oordenkings';
			} 

			$query = "SELECT SQL_CALC_FOUND_ROWS o.heading AS title, o.date, o.verse, o.reflection, o.prayer, o.afrdate AS display_date, o.book AS isbn, p.title AS book_title, p.author AS book_author, IF(p.image='',p.image, CONCAT('".$_SERVER['SERVER_NAME']."/products/125x150/',p.image)) AS book_image, '".$_SERVER['SERVER_NAME']."/devotionals/' AS trackBackUrl, CONCAT('".$_SERVER['SERVER_NAME']."/view/',p.prodID,'/prodlisttitle/') AS trackBackToProduct 
							FROM ".$dbTable." AS o 
							LEFT JOIN store_prods AS p ON (o.book=p.code)
							WHERE date = '".date('d F')."'";

			$params = array();
			
			$result = R::getRow($query, $params);

			$result['title'] = $rest->utf8MswordFix($result['title']) . ' ';
			$result['verse'] = $rest->utf8MswordFix($result['verse']);	
			$result['reflection'] = $rest->utf8MswordFix($result['reflection']);	
			$result['prayer'] = $rest->utf8MswordFix($result['prayer']);	
			$result['book_title'] = $rest->utf8MswordFix($result['book_title']);	
			$result['book_author'] = $rest->utf8MswordFix($result['book_author']);		

			$returned = count($result);
			
			// get our total count in the db
			$filtered_total = R::getCell('SELECT FOUND_ROWS()');

			$controls = array(
				'totalRows' => (int) $filtered_total,
				'totalCols' => (int) $returned
			);

			$data = $controls;

			if ($filtered_total == 0) {
				$data['row'] = $filtered_total;

			} else{

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

$fileHandle = fopen($_SERVER['DOCUMENT_ROOT'].'/rest/logs/requests-devotional-'.date("Y-M").'.txt', "a+");
foreach (Rest::$logTracker as $key=>$value) {
	fputs($fileHandle, $value);
}
fclose($fileHandle);

exit;
?>