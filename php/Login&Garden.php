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

$query = "SELECT username from gardens.logintable
where gardens.logintable.userName = '$gUser'
and gardens.logintable.password = '$gPass'";
// declare password check statement
$myArray = array(); // to hold the sql results             
$result = mysqli_query ( $con, $query );
if (! $result) {
	die ( 'could not fetch results, ' . $con->error );
}                  
// make read the results into an associate array
if($row = mysqli_fetch_array ( $result, MYSQLI_ASSOC ) ) {
	$myArray [] = $row;
	$query = "SELECT gardenName from gardens.logintable
join gardens.gardentbl
on gardens.logintable.userName = gardens.gardentbl.userName
where gardens.logintable.userName = '$gUser'
and gardens.logintable.password = '$gPass'";
$result = mysqli_query ( $con, $query );
if (! $result) {
	die ( 'could not fetch results, ' . $con->error );
}
$myArrays = array(); // to hold the sql results
                    
// make read the results into an associate array
while ( $row = mysqli_fetch_array ( $result, MYSQLI_ASSOC ) ) {
	$myArrays [] = $row;
}
echo json_encode ( $myArrays ); // put array into JSON array
}
else
	echo json_encode("No User");
 // put array into JSON array
//echo $query;
// call the SQL query


?>