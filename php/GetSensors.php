<?php
/**
checks given username and password and echos back true or false in json format.
True = login accepted
False = password inccorect
no user found = "no such user name"
*/
header('Content-Type: json');
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
if(!isset($_GET ["garden"]))
	die('missing password');
// read in garden user name and password
$gUser = $_GET ["user"];
$gPass = $_GET ["garden"];
// connect to database
$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket ) or die ( 'Could not connect to the database server' . mysqli_connect_error () );
/*
	Verify user name and password
*/
// declare password check statement
$query = "select sensorName from gardens.sensorstable
where owner = '$gUser'
and gardenName = '$gPass'";

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