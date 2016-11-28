<?php
header ('Access-Control-Allow-Origin: *');
header ( 'Content-Type: json' );
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

// connect to database
$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket ) or die ( 'Could not connect to the database server' . mysqli_connect_error () );
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
$query = "SELECT configText FROM logintable WHERE username = '$gUser'";
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
$configText = json_encode($myArray[0]['configText'],  JSON_UNESCAPED_SLASHES);

$configText = str_replace('\\' ,'',$configText);

echo $configText;

?>