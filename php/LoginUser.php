<?php
header('Content-Type: json');
$host = "db4free.net";

$user = "smart_garden";

$password = "f38672";

$port = "3306";

$database = "smart_garden";



// Create connection

$conn = mysqli_connect($host, $user, $password, $database) or die ("error");

// Check connection

$user = $_GET["user"];
$pass = $_GET["pass"];
$data = array();


$qry = "select Moisture, Temperature,Humidity,Gdate,Garden.UserName from GardenLog
join Garden
join Login
on Garden.MAC = GardenLog.MAC
where Garden.UserName = '$user'
and Login.Password = '$pass'
order by Gdate desc";

$sql = mysqli_query($conn, $qry) or die("error");

//retrieve all rows from sql query
$row = mysqli_fetch_assoc($sql);
$data[] = $row;
echo json_encode($data);

mysqli_close($conn);
?>