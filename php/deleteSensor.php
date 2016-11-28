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

	if (! isset ( $_GET ["sensorName"] )){
		errorMsg("no sensor name", 0);
	} else {
		$sName = $_GET ["sensorName"];
	}

	$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket )
	or die ( 'Could not connect to the database server' . mysqli_connect_error ());

	 /*
	 * Verify user name and password
	 */
	// declare password check statement
	$query = "SELECT password from logintable WHERE userName = '$gUser'";
	//echo($query);
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
	$status['error'] = 'Wrong Password ' . $passwordResult . "!=" . $gPass;
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


	$query = "DELETE FROM `readings` WHERE `sensorOwner` = '$gUser' AND `sensorName` = '$sName';";
	if(mysqli_query ( $con, $query ) == false){
		$status['status'] = 'ERROR';
		$status['error'] ='failed deleting sensor from readings' . $con->error;
		$status['updated'] = $con->affected_rows;
		die(json_encode($status));
	}


	$query = "DELETE FROM `sensorstable` WHERE `owner`='$gUser' AND `sensorName` = '$sName';";
	#echo $query;
	$result = mysqli_query ( $con, $query );
	if (!$result) {
		$status['status'] = 'ERROR';
		$status['error'] = $con->error;
		$status['updated'] = $con->affected_rows;
	} elseif($con->affected_rows == 0) {
		$status['status'] = 'ERROR';
		$status['error'] = 'No rows updated';
		$status['updated'] = $con->affected_rows;
	} else {
		$status['status'] = "200 OK";
		$status['error'] = 'NULL';
		$status['updated'] = $con->affected_rows;
	}
	echo json_encode($status);
	?>