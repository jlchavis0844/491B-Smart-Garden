<?php
header ('Access-Control-Allow-Origin: *');
header ( 'Content-Type: json' );
// SQL server declerations
/**
call this php with the following parameters:
user=userName
password=password
gardenName=myGardenName
startDate=date value just YYYY-MM-DD (min date)
endDate=date value just YYYY-MM-DD (max date)
 NOTE : dates are set to greater / less than OR EQUAL. If you pass only the date,
 it will include all the readings on that date. Example of the URL:
 http://76.94.123.147:49180/getGardenData.php?user=testUser&password=password1&gardenName=Garden1&startDate=2016-09-28&endDate=2016-10-02

 the PHP will return the following values:
 sensorName, moisture, temp, humidity, and time stamp in json format for each reading. Example:
 [
	 {"sensorName":"moist0",
	 	 "temp":null,
	 	 "humidity":null,
	 	 "moisture":"425",
	 	 "timeStamp":"2016-09-28 09:23:47"},
	 {"sensorName":"moist0",
		 "temp":null,
		 "humidity":null,
		 "moisture":"642",
		 "timeStamp":"2016-09-28 10:15:51"},
	 {"sensorName":"moist0",
		 "temp":null,
		 "humidity":null,
		 "moisture":"456",
		 "timeStamp":"2016-09-29 12:45:45"},
	 {"sensorName":"Sensor1",
		 "temp":"24",
		 "humidity":"51",
		 "moisture":null,
		 "timeStamp":"2016-09-29 16:52:40"},
	 {"sensorName":"Sensor1",
		 "temp":"25",
		 "humidity":"55",
		 "moisture":null,
		 "timeStamp":"2016-09-29 16:53:13"}
]


*/
$host = "76.94.123.147"; // server IP
$port = 4910; // mySQL port
$socket = ""; // not used
$user = "491user"; // server username
$password = "password1"; // server password
$dbname = "gardens"; // removes need to have database.tableName
                     
// check for all parameters
if (! isset ( $_GET ["user"] )){
	die ( 'missing user name' );
} else {
	$gUser = $_GET ["user"];
}

if (! isset ( $_GET ["password"] )){
	die ( 'missing password' );
} else {
	$gPass = $_GET ["password"];
}

if (! isset ( $_GET ["gardenName"] )){
	die ( 'missing garden name' );
} else {
	$gName = $_GET ["gardenName"];
}

if (! isset ( $_GET ["startDate"] )){
	die ( 'missing start date' );
} else {
	$gMin = $_GET ["startDate"];
}

if (! isset ( $_GET ["endDate"] )){
	die ( 'missing end date' );
} else {
	$gMax = $_GET ["endDate"];
}

// connect to database
$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket ) or die ( 'Could not connect to the database server' . mysqli_connect_error () );

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
if ($passwordResult != $gPass) {
	die ( 'User password is incorrect, ' . $con->error );
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
		die ( 'failed on timestamp, ' . $con->error );
	}
}

// make the query to get the readings for this sensor
$query = "SELECT sensorstable.sensorName, readings.temp, readings.humidity, readings.moisture, readings.timeStamp
FROM (sensorstable INNER JOIN (gardentbl INNER JOIN logintable ON gardentbl.userName = logintable.userName) ON (sensorstable.owner = gardentbl.userName) AND (sensorstable.gardenName = gardentbl.gardenName)) INNER JOIN readings ON (sensorstable.owner = readings.sensorOwner) AND (sensorstable.sensorName = readings.sensorName)
WHERE logintable.userName = '$gUser' AND gardentbl.gardenName = '$gName' AND readings.timeStamp >= '$gMin 00:00:00' AND readings.timeStamp <= '$gMax 23:59:59' ORDER BY timestamp asc;";
//echo $query;
// call the SQL query
$result = mysqli_query ( $con, $query );
if (! $result) {
	die ( 'could not fetch results, ' . $con->error );
}

$myArray = array (); // to hold the sql results
                    
// make read the results into an associate array
while ( $row = mysqli_fetch_array ( $result, MYSQLI_ASSOC ) ) {
	$myArray [] = $row;
}

echo json_encode ( $myArray ); // put array into JSON array

?>