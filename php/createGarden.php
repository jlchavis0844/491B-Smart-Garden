<?php
//db credentials
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
//get parameter from url
$use = $_GET["use"];


//attempt sql query
if($result = mysqli_query($conn, "select mac from Garden where UserName ='$use'"))

{

$row = $result->fetch_assoc();

$dat = json_encode($row);
//echo data on success
echo $dat;

}
//echo username on fail
else echo $use;





?>