<?php
header('Content-Type: json');
/**
SMART GARDENS - SendData.php
Author - James Chavis
Issues / Bugs - none known at this time
TODO: Empty
Version 1.1 - 9/25/2016
The point of this PHP is to accept the values passed by a raspberry pi and insert them into a database.
The logic below if fairly simple. A few things of note, the $dbname portion of the connection must be set to avoid prepending database name to tables.
Back ticks must be used in all column names, or you will get a failure on the insert commands, which gives	a false in $result. For some reason, PHP will not echo false. I've set the PHP to die on !$result (false).
On sucess, meaning no fail conditions are met, 'readings accepted' is sent
Version 1.1 - 9/29/2016
Add logic to check for more than two readings per sensor, per day. This is was not possible with mySQL triggers since they have no INSTEAD OF tiggers. BEFORE INSERT ON and AFTER INSERT ON triggers cannot modify table the trigger runs on. 
*/

// SQL server declerations
$host = "76.94.123.147";//server IP
$port = 4910;//mySQL port
$socket = "";//not used
$user = "491user";//server username
$password = "password1";//server password
$dbname = "gardens";//removes need to have database.tableName

//param checks
if(!isset($_GET ["user"]))
	die('missing user name');

if(!isset($_GET ["password"]))
	die('missing password');

if(!isset($_GET ["name"]))
	die('missing sensor name');

// read in garden user name and password
$gUser = $_GET ["user"];
$gPass = $_GET ["password"];

// set sensorName
$sName = $_GET ["name"];


// connect to database
$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket ) or die ( 'Could not connect to the database server' . mysqli_connect_error () );

/*
	Verify user name and password
*/
// declare password check statement
$query = "SELECT password from logintable WHERE userName = '$gUser'";

$result = "reset";//clearing status results, 1 good, 0 bad
$passwordResult = "this should not be here";//debug purpose
if ($stmt = $con->prepare ( $query )) {//build query
	$result = $stmt->execute ();//send query, record swucess/fail in $result
	if(!$result){//if query failed
		die('failed getting password'); 
	}
	$stmt->bind_result ( $passwordResult );//assign returned value
	$stmt->fetch ();//store password into above line
	$stmt->close ();//close statement
}

// if password given isn't same query returns, kill
if ($passwordResult != $gPass) {
	die ( 'User password is incorrect, ' . $con->error );
}

/**
	Generate time stamp for the log in table.
*/
$now = new DateTime ();
$now->setTimezone ( new DateTimeZone ( 'America/Los_Angeles' ) );
$tStamp = $now->format ( 'Y-m-d H:i:s' );

// update login timestamp
$query = "UPDATE logintable SET lastLogin ='$tStamp' WHERE userName ='$gUser'";

//send the login time stamp
$result = "reset";//clear query results
// send statement using the same connection, don't check response
if ($stmt = $con->prepare ( $query )) {
	$result = $stmt->execute (); // send
	$stmt->close (); // close
	if(!$result){//on fail
		die('failed on timestamp, ' . $con->error);
	}
}

/**
	Check for more than 2 readings per sensor, per day
*/
//build query to get a list of all results of that sensor on that day
	$query = "SELECT timeStamp FROM `gardens`.`readings` WHERE timeStamp LIKE CONCAT(SUBSTRING('$tStamp',1,10),'%') AND `sensorName` = '$sName' AND `sensorOwner` = '$gUser'";

$myTS = [];//will hold the timeStamps of all the readings for that sensor for today
$data = mysqli_query($con,$query);//send the query
if(!$data){//if there is a problem with the SQL query
	die('could not get readings count, ' . $con->error);
}

//go through the results and store the time stamp into an array
while ($row = mysqli_fetch_array($data, MYSQLI_BOTH)) {
	$myTS[] = $row[0];

}
//print_r($myTS);
//print "<br>";

/**
	Send the readings to the database
*/
// determine which statement to send based on params
if (isset($_GET ["temp"]) && isset($_GET ["hum"])) { // if no temp or humidity
	if (isset($_GET ["moisture"])) { // check for moisture
		die ( 'no values passed' ); // kill if missing all three
	} else { // no temp or humidity reading but a moisture reading exists
		$temp = $_GET ["temp"];//get temp
		$humid = $_GET ["hum"];//get humidity

		if(!is_numeric($temp) || !is_numeric($humid))//check for numberic value
		die('values are not numbers');

		if(count($myTS) > 1){//if there is more than 1 reading, replace the oldest reading
			$query = "UPDATE `readings` SET `timeStamp`='$tStamp', `temp`='$temp', `humidity`='$humid' WHERE `sensorOwner`='$gUser' and`sensorName`='$sName' and`timeStamp`='" . min($myTS) ."';";
		} else {//if there is 0 or 1 readings, use insert statement
			$query = "INSERT INTO readings (`sensorOwner`, `sensorName`, `temp`, `humidity`) VALUES ('$gUser', '$sName', '$temp', '$humid');";
		}
	}
} else { // has atleast one temp or hum reading. should be both
	$moist = $_GET ["moisture"];

	if(!is_numeric($moist))//check for numberic value
	die('value is not a number');

	if(count($myTS) > 1){//if there is more than one reading, update the oldest readinng
		$query = "UPDATE `readings` SET `timeStamp`='$tStamp', `moisture`= '$moist' WHERE `sensorOwner`='$gUser' and`sensorName`='$sName' and `timeStamp`='" . min($myTS) ."';";
	} else {//if there is only one or zero, use insert command
		$query = "INSERT INTO readings (`sensorOwner`, `sensorName`, `moisture`) VALUES ('$gUser', '$sName', '$moist');";
	}
}
//print $query . "<br>";
$result = "reset";//clear result
// try to send and connect
if ($stmt = $con->prepare ( $query )) {
	$result = $stmt->execute(); // send
	$stmt->close (); // close
}

//return results
if(!$result){//if insert failed
	die('failed with insert command');
} else {//status code 200 === real good.
	echo "reading accepted";
}

?>