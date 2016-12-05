<?php
header('Content-Type: application/json');
$host = "76.94.123.147"; // server IP
$port = 4910; // mySQL port
$socket = ""; // not used
$user = "491user"; // server username
$password = "password1"; // server password
$dbname = "gardens"; 


// Create connection

$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket ) or die ( 'Could not connect to the database server' . mysqli_connect_error ());

// Check connection

$sensor = $_GET["sensor"];
$user = $_GET["user"];



// Check connection

if ($con->connect_error) {

    die("Connection failed: " . $conn->connect_error);

} 


//attempt to get the moisture temperature humidity date on username from tables
if ($result = mysqli_query($con, "select * from gardens.readings
where sensorOwner = '$user'
and sensorName = '$sensor'
order by timeStamp desc"))
//order by last entry to get most active entry
{
    $row = $result->fetch_assoc();

    echo json_encode($row);
}
//echo option on failure

?>