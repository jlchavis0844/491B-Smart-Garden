<?php
	header('Content-Type: json');
		//receive data from the json body
function errorMsg($errMsg, $updated){
	
	$tempStat = array();
	$tempStat['status'] = 'ERROR';
	$tempStat['error'] = $errMsg;
	$tempStat['updated'] = $updated;
	
	die(json_encode($tempStat));
	}	
	
	$host = "76.94.123.147"; // server IP
	$port = 4910; // mySQL port
	$socket = ""; // not used
	$user = "491user"; // server username
	$password = "password1"; // server password
	$dbname = "gardens"; // removes need to have database.tableName
	$status = array();
	// check for all parameters
	if (! isset ( $_GET ["user"] )){
		errorMsg("no user", 0);
	} else {
		$gUser = $_GET ["user"];
	}

	if (! isset ( $_GET ["password"] )){
		errorMsg("no password", 0);
	} else {
		$gPass = $_GET ["password"];
	}

	if (! isset ( $_GET ["gardenName"] )){
		errorMsg("o garden name", 0);
	} else {
		$gName = $_GET ["gardenName"];
	}
	$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket )
	or die ( 'Could not connect to the database server' . mysqli_connect_error ());

	 /*
	 * Verify user name and password
	 */
	// declare password check statement
	$query = "SELECT password from logintable WHERE userName = '$gUser'";

	$result = "reset"; // clearing status results, 1 good, 0 bad
	$passwordResult = "this should not be here"; // debug purpose
	if ($stmt = $con->prepare ( $query )) { // build query
		$result = $stmt->execute (); // sMax query, record swucess/fail in $result
		if (! $result) { // if query failed
			die ( 'failed getting password' );
		}
		$stmt->bind_result ( $passwordResult ); // assign returned value
		$stmt->fetch (); // store password into above line
		$stmt->close (); // close statement
	}

	// if password given isn't same query returns, kill
	if ($passwordResult == NULL){//if no password is returned, the user doesn't exists
	$status['status'] = "ERROR";
	$status['error'] = 'No User ' . $con->error;
	$status['updated'] = 0;
	die(json_encode($status));
	} elseif ($passwordResult != $gPass) {
	$status['status'] = "ERROR";
	$status['error'] = 'Wrong Password';
	$status['updated'] = 0;	
	die(json_encode($status));	
	}

	/**
	 * Generate time stamp for the log in table.
	 */
	$now = new DateTime ();
	$now->setTimezone ( new DateTimeZone ( 'America/Los_Angeles' ) );
	$tStamp = $now->format ( 'Y-m-d H:i:s' );

	// update login timestamp
	$query = "UPDATE `logintable` SET `lastLogin` ='$tStamp' WHERE `userName` ='$gUser'";

	// sMax the login time stamp
	$result = "reset"; // clear query results
	                   // sMax statement using the same connection, don't check response
	if ($stmt = $con->prepare ( $query )) {
		$result = $stmt->execute (); // send
		$stmt->close (); // close
		if (! $result) { // on fail
			$status['status'] = 'ERROR';
			$status['error'] ='Could not update timestamp' . $con->error;
			$status['updated'] = $con->affected_rows;
			die(json_encode($status));
		}
	}

	$sensors = array();
	$query = "SELECT `sensorName` FROM `sensorstable` WHERE `owner` = '$gUser' AND `gardenName` ='$gName';";
	$result = mysqli_query ( $con, $query );
	while($res = mysqli_fetch_assoc($result)){
		$sensors[] = $res['sensorName'];
	}
	#print_r($sensors);
	#print("<br>");
	$numOfSensors = sizeof($sensors);

	foreach($sensors as $sName){
		$query = "DELETE FROM `readings` WHERE `sensorOwner` = '$gUser' AND `sensorName` = '$sName';";
		if(mysqli_query ( $con, $query ) != 1){
			die("failed deleting sensors");
		}
	}

	$query = "DELETE FROM `sensorstable` WHERE `owner`='$gUser' and`gardenName`='$gName';";
	#echo $query;
	$status1 = array();
	$result = mysqli_query ( $con, $query );
	if (!$result) {
		$status1['status'] = 'ERROR';
		$status1['error'] = $con->error;
		$status1['updated'] = $con->affected_rows;
	} elseif($con->affected_rows == 0) {
		$status1['status'] = 'WARNING';
		$status1['error'] = 'No rows updated';
		$status1['updated'] = $con->affected_rows;
	} else {
		$status1['status'] = "200 OK";
		$status1['error'] = 'NULL';
		$status1['updated'] = $con->affected_rows;
	}
	$status1['job'] = 'sensorstable';
	#print_r($status1);
	$query = "DELETE FROM `gardentbl` WHERE `userName`='$gUser' and`gardenName`='$gName';";
	#echo $query;
	$status2 = array();
	$result = mysqli_query ( $con, $query );
	if (!$result) {
		$status2['status'] = 'ERROR';
		$status2['error'] = $con->error;
		$status2['updated'] = $con->affected_rows;
	} elseif($con->affected_rows == 0) {
		$status2['status'] = 'WARNING';
		$status2['error'] = 'No rows updated';
		$status2['updated'] = $con->affected_rows;
	} else {
		$status2['status'] = "200 OK";
		$status2['error'] = 'NULL';
		$status2['updated'] = $con->affected_rows;
	}
	$status2['job'] = 'gardentbl';

	$final = array();
	if($status1['status'] == 'ERROR' || $status2['status'] == 'ERROR'){
		$final['status'] = 'ERROR';
		if($status1['status'] == 'ERROR'){
			$final['error'] == $status1['error'];
		} else {
			$final['error'] == $status2['error'];
		}
	} else {
		$final['status'] = 'UNKNOWN';
	}
	$final['error'] = $status1['error'] . " | " . $status2['error'];
	$final['updated'] = $status1['updated'] . " | " . $status2['updated'];

	echo json_encode($final);
	?>