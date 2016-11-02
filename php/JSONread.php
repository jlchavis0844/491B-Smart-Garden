<?php
	header('Content-Type: json');
	//receive data from the json body
	$data = file_get_contents('php://input');
	$jsonData = json_decode($data, true);
	//var_dump($data);

	//get information
	$gUser = $jsonData['user'];
	$gPass = $jsonData['password'];
	$timestamp = $jsonData['updated'];

	//set up connection
	$host = "jchavis.hopto.org"; // server IP
	$port = 4910; // mySQL port
	$socket = ""; // not used
	$user = "491user"; // server username
	$password = "password1"; // server password
	$dbname = "gardens"; // removes need to have database.tableName

	//make connection
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


	//make the query
	$query = "UPDATE logintable SET configText='$data', configTime='$timestamp' WHERE userName = '$gUser' AND password ='$gPass';";

	// call the SQL query
	$status = array();
	$result = mysqli_query ( $con, $query );
	if (!$result) {
		$status['status'] = 'ERROR';
		$status['error'] = $con->error;
		$status['updated'] = $con->affected_rows;
	} elseif($con->affected_rows == 0) {
		$status['status'] = 'WARNING';
		$status['error'] = 'No rows updated';
		$status['updated'] = $con->affected_rows;
	} else {
		$status = array();
		$status['status'] = "200 OK";
		$status['error'] = 'NULL';
		$status['updated'] = $con->affected_rows;
	}

	echo json_encode($status)
?>