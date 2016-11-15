<?php

header('Content-Type: json');
$host = "db4free.net";

$user = "smart_garden";

$password = "f38672";

$port = "3306";

$database = "smart_garden";



// Create connection

$conn = mysqli_connect($host, $user, $password, $database) or die ("error");

//get parameters from url
$use = $_GET["use"];

$pass = $_GET["pass"];

$MAC = $use;
$emptyset = array();
$id = "";


//create login record with use and pass
$stmt = "INSERT INTO Login (Username, Password) VALUES ('$use', '$pass')";
//check if username password combo exists first
$result = mysqli_query($conn, "Select ID from Login where Username = '$use'");
$row = mysqli_fetch_row($result);
if(!$row)
{
	if ($result = mysqli_query($conn, $stmt))
	{
			if($result = mysqli_query($conn, "Select ID from Login where Username = '$use'"))
			{
				//fetch the row for the id and echo the id on success
				$row = $result->fetch_assoc();
				$id = intval($row['ID']);
			}

			if($result = mysqli_query($conn, "INSERT INTO Garden (ID, MAC, UserName) VALUES ($id, '$MAC','$use')"))
			{
				//echo mac value on success
				$arr = array('ID' => $id);
				echo json_encode($arr);
			}
			else echo "not gewd";
	}
}
else echo json_encode($emptyset);
?>

