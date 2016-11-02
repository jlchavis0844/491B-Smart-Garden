<?php
header('Content-Type: json');
/**
This PHP shoulb be called with the following:
	?user=userName&password=userPass

The script will check the user name, if it exists, the script will echo josn text back
that the user name already exists. If not username is found, an insert command is sent to the log in
 table that will set the given username and password. All error and return messages are in json
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

// read in garden user name and password
$gUser = $_GET ["user"];
$gPass = $_GET ["password"];

// connect to database
$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket ) or die ( 'Could not connect to the database server ' . mysqli_connect_error () );
//query string to check if the user name exists
$query = "SELECT COUNT(*) FROM `gardens`.`logintable` WHERE userName = '$gUser';";
//print $query . "<br>";
$results = mysqli_query($con, $query);
//print_r($results);

if(!$results){//if query fails
	die(json_encode('could not check userName, ' . $con->error));
}

//save results
$row = mysqli_fetch_array($results, MYSQLI_BOTH);

if($row[0] == 0){//if count is zero, user name does not exist
	/**
		Generate time stamp for the log in table.
	*/
	$now = new DateTime ();
	$now->setTimezone ( new DateTimeZone ( 'America/Los_Angeles' ) );
	$tStamp = $now->format ( 'Y-m-d H:i:s' );

	//query string to insert a new user
	$query = "INSERT INTO `gardens`.`logintable` (userName, password, lastLogin) VALUES ('$gUser', '$gPass', '$tStamp');";
	
	//print $query . "<br>";
	$results = mysqli_query($con, $query);
	
	if(!$results){//check for a failed connection
		die(json_encode('could save user name for some reason, ' . $con->error));
	} else echo json_encode($gUser . ' has been registered');//it worked, should read true
} else {
	echo json_encode('result : user name ' . $gUser . ' exists');
}	
?>