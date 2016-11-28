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

if(!isset($_GET ["password"]))
	die('missing password');

// read in garden user name and password
$gUser = $_GET ["user"];
$gPass = $_GET ["password"];

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
	$result = $stmt->execute ();//send query, record success/fail in $result
	if(!$result){//if query failed
		die(json_decode('failed getting password, ' . $con->error)); 
	}
	$stmt->bind_result ( $passwordResult );//assign returned value
	$stmt->fetch ();//store password into above line
	$stmt->close ();//close statement
}
if(is_null($passwordResult)){
	echo json_encode("no such user name"); 
} else {
	echo json_encode($passwordResult == $gPass);//return password check results
}
?>