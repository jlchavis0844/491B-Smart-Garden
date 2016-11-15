<?php
header('Content-Type: application/json');
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
//get parameter
$option = $_GET["option"];


//attempt to get the moisture temperature humidity date on username from tables
if ($result = mysqli_query($conn, "select Moisture, Temperature,Humidity,Gdate,UserName from GardenLog

join Garden

on Garden.MAC = GardenLog.MAC

where Garden.UserName = '$option'

order by Gdate desc")) 
//order by last entry to get most active entry
{
    $row = $result->fetch_assoc();

    echo json_encode($row);
}
//echo option on failure
else echo $option

?>