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

$month= $_GET["month"];
$year = $_GET["year"];
$min = $month;
$max = $month;
$min--;
$max++;
if($min-1 == 0) $min = 12;
if($max+1 == 12) $max = 1;

$data = array();

$qry = "select Moisture, Gdate from GardenLog

join Garden

on Garden.MAC = GardenLog.MAC

where Garden.UserName = 'TestingDB'

and GardenLog.Gdate > '$year-$min-31'

and GardenLog.Gdate < '$year-$max-01'

order by Gdate asc";

$sql = mysqli_query($conn, $qry) or die("fucked up bro");

//retrieve all rows from sql query
while($row = mysqli_fetch_assoc($sql))
	{
		$data[] = $row;
	}
echo json_encode($data);
mysqli_close($conn);
?>