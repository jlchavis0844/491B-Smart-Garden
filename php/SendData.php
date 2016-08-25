<?php
$host = "db4free.net";
$user = "smart_garden";
$password = "f38672";
$port = "3306";
$database = "smart_garden";

// Create connection
$conn = new mysqli($host, $user, $password, $database, $port);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
//send data as a url to the database 
$use = $_GET["use"];
$Temperature = 1;//$_GET["Temperature"];
$Moisture = $_GET["Moisture"];
$Gdate = $_GET["Gdate"];
$Humidity = 1;//$_GET["Humidity"];
$Watered = strval($_GET["Water"]);
$qry = "insert into GardenLog
values('$use',$Moisture,$Temperature,$Humidity,'$Gdate', $Watered)";

//attempt sql query
if($conn->query($qry))
	echo json_encode('all good');
else echo json_encode(array());

?>