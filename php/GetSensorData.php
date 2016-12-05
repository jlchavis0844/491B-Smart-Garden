<?php
header('Content-Type: json');
/**
 * PHP script that returns all the readings for the a sensor between the min and
 * max timestamps.
 * example call:
 * http://localhost/SmartGardens/GetData.php?user=testUser&name=Sensor1
 * 		&password=password1&min=2015-10-04 00:00:00&max=2016-10-04 12:00:00
 * 
 * Example return:
 * [
  {
    "timeStamp": "2016-09-29 16:52:40",
    "temp": "76.1",
    "humidity": "51",
    "moisture": null
  },
  {
    "timeStamp": "2016-09-29 16:53:13",
    "temp": "99",
    "humidity": "99",
    "moisture": null
  },
  {
    "timeStamp": "2016-10-01 13:03:44",
    "temp": "25",
    "humidity": "44",
    "moisture": null
  },
  {
    "timeStamp": "2016-10-01 13:05:23",
    "temp": "25",
    "humidity": "50",
    "moisture": null
  },
  {
    "timeStamp": "2016-10-02 18:45:05",
    "temp": "25",
    "humidity": "49",
    "moisture": null
  }
]
 */
// SQL server declerations
$host = "76.94.123.147";//server IP
$port = 4910;//mySQL port
$socket = "";//not used
$user = "491user";//server username
$password = "password1";//server password
$dbname = "gardens";//removes need to have database.tableName
//check for all parameters
if(!isset($_GET ["user"]))
	die('missing user name');
if(!isset($_GET ["password"]))
	die('missing password');
if(!isset($_GET ["name"]))
	die('missing sensor name');
if(!isset($_GET["min"]))
	die('missing min time');
if(!isset($_GET["max"]))
	die('missing max time');
//read in all parameters
$gUser = $_GET ["user"];
$gPass = $_GET ["password"];
$gMin = $_GET["min"];
$gMax = $_GET["max"];
$gName = $_GET["name"];
// connect to database
$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket ) 
or die ( 'Could not connect to the database server' . mysqli_connect_error () );
	
/*
 Verify user name and password
 */
// declare password check statement
$query = "SELECT password from logintable WHERE userName = '$gUser'";
$result = "reset";//clearing status results, 1 good, 0 bad
$passwordResult = "this should not be here";//debug purpose
if ($stmt = $con->prepare ( $query )) {//build query
	$result = $stmt->execute ();//sMax query, record swucess/fail in $result
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
$query = "UPDATE `logintable` SET `lastLogin` ='$tStamp' WHERE `userName` ='$gUser'";
//sMax the login time stamp
$result = "reset";//clear query results
// sMax statement using the same connection, don't check response
if ($stmt = $con->prepare ( $query )) {
	$result = $stmt->execute (); // send
	$stmt->close (); // close
	if(!$result){//on fail
		die('failed on timestamp, ' . $con->error);
	}
}
//make the query to get the readings for this sensor
$query = "SELECT `timeStamp`, `temp`, `humidity`, `moisture` FROM `gardens`.`readings` WHERE `timeStamp` < '$gMax' AND 
		  timeStamp > '$gMin' AND `sensorName` = '$gName';";
//call the SQL query
$result = mysqli_query($con, $query);
if(!$result){
	die('could not fetch results, ' . $con->error);
}
$myArray = array();//to hold the sql results
//make read the results into an associate array
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
	$myArray[] = $row;
}
echo json_encode($myArray);//put array into JSON array
?>