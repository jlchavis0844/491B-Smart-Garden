<?php
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
else
	$gUser = $_GET ["user"];

if(!isset($_GET ["password"]))
	die('missing password');
else
	$gPass = $_GET ["password"];

if(!isset($_GET ["gName"]))
	die('missing garden name');
else
	$gName = $_GET ["gName"];

if(isset($_GET ["gDesc"]))
	$gDesc = $_GET["gDesc"];
else $gDesc = "";

$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket ) or die ( 'Could not connect to the database server' . mysqli_connect_error () );

/*
	Verify user name and password
*/
// declare password check statement
	$query = "SELECT password from logintable WHERE userName = '$gUser'";
	$answer = "";
$result = "reset";//clearing status results, 1 good, 0 bad
$passwordResult = "this should not be here";//debug purpose
if ($stmt = $con->prepare ( $query )) {//build query
	$result = $stmt->execute ();//send query, record success/fail in $result
	if(!$result){//if query failed
		die(json_encode('failed getting password, ' . $con->error)); 
	}
	$stmt->bind_result ( $passwordResult );//assign returned value
	$stmt->fetch ();//store password into above line
	$stmt->close ();//close statement
}
if(is_null($passwordResult)){
	echo json_encode("no such user name"); 
} elseif($passwordResult != $gPass) {
	die("Incorrect password");
}

$query = "INSERT INTO `gardens`.`gardentbl` (`userName`, `gardenName`, `description`) VALUES ('$gUser', '$gName', '$gDesc');";

// call the SQL query
$result = mysqli_query ( $con, $query );
if (! $result) {
	die ( 'could not fetch results, ' . $con->error );
} else echo json_encode($result);
?>