<?php // content="text/plain; charset=utf-8"
/**

A poor graph example of how to graph data using a php. takes code from GetData.php
Call using:
127.0.0.1/earlyGraph.php?user=testUser&name=Sensor1&password=password1&min=2015-10-04 00:00:00&max=2016-10-04 12:00:00

*/

require_once ('jpgraph/jpgraph.php');
require_once ('jpgraph/jpgraph_line.php');

// SQL server declerations
$host = "76.94.123.147";//server IP
$port = 4910;//mySQL port
$socket = "";//not used
$user = "491user";//server username
$password = "password1";//server password
$dbname = "gardens";//removes need to have database.tableName

//check for all parameters
if(!isset($_GET ["user"]))
	die('missing user name');

if(!isset($_GET ["password"]))
	die('missing password');

if(!isset($_GET ["name"]))
	die('missing sensor name');

if(!isset($_GET["min"]))
	die('missing min time');

if(!isset($_GET["max"]))
	die('missing max time');

//read in all parameters
$gUser = $_GET ["user"];
$gPass = $_GET ["password"];
$gMin = $_GET["min"];
$gMax = $_GET["max"];
$gName = $_GET["name"];


// connect to database
$con = new mysqli ( $host, $user, $password, $dbname, $port, $socket ) 
or die ( 'Could not connect to the database server' . mysqli_connect_error () );
	
/*
 Verify user name and password
 */
// declare password check statement
$query = "SELECT password from logintable WHERE userName = '$gUser'";

$result = "reset";//clearing status results, 1 good, 0 bad
$passwordResult = "this should not be here";//debug purpose
if ($stmt = $con->prepare ( $query )) {//build query
	$result = $stmt->execute ();//sMax query, record swucess/fail in $result
	if(!$result){//if query failed
		die('failed getting password');
	}
	$stmt->bind_result ( $passwordResult );//assign returned value
	$stmt->fetch ();//store password into above line
	$stmt->close ();//close statement
}

// if password given isn't same query returns, kill
if ($passwordResult != $gPass) {
	die ( 'User password is incorrect, ' . $con->error );
}

/**
 Generate time stamp for the log in table.
 */
$now = new DateTime ();
$now->setTimezone ( new DateTimeZone ( 'America/Los_Angeles' ) );
$tStamp = $now->format ( 'Y-m-d H:i:s' );

// update login timestamp
$query = "UPDATE `logintable` SET `lastLogin` ='$tStamp' WHERE `userName` ='$gUser'";

//sMax the login time stamp
$result = "reset";//clear query results
// sMax statement using the same connection, don't check response
if ($stmt = $con->prepare ( $query )) {
	$result = $stmt->execute (); // send
	$stmt->close (); // close
	if(!$result){//on fail
		die('failed on timestamp, ' . $con->error);
	}
}

//make the query to get the readings for this sensor
$query = "SELECT `timeStamp`, `temp`, `humidity`, `moisture` FROM `gardens`.`readings` WHERE `timeStamp` < '$gMax' AND 
		  timeStamp > '$gMin' AND `sensorName` = '$gName';";

//call the SQL query
$result = mysqli_query($con, $query);
if(!$result){
	die('could not fetch results, ' . $con->error);
}

$myArray = array();//to hold the sql results

//make read the results into an associate array
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)){
	$myArray[] = $row;

}

#echo json_encode($myArray);//put array into JSON array

#$datay1 = array(20,15,23,15);
#$datay2 = array(12,9,42,8);
#$datay3 = array(5,17,32,24);

$xArray = [];//holds x-axis values

foreach ($myArray as $name => $value){//read timeStamps into xArray
	$xArray[] = substr($value['timeStamp'],5,5);
}
#print_r($xArray);

$tArray = [];//holds temp values
foreach ($myArray as $name => $value){//read timeStamps into xArray
	$tArray[] = $value['temp'];
}
#print_r($tArray);

$hArray = [];//holds temp values
foreach ($myArray as $name => $value){//read timeStamps into xArray
	$hArray[] = $value['humidity'];
}
#print_r($hArray);

// Setup the graph
$graph = new Graph(300,250);
$graph->SetScale("textlin");

$theme_class=new UniversalTheme;

$graph->SetTheme($theme_class);
$graph->img->SetAntiAliasing(false);
$graph->title->Set('Filled Y-grid');
$graph->SetBox(false);

$graph->img->SetAntiAliasing();

$graph->yaxis->HideZeroLabel();
$graph->yaxis->HideLine(false);
$graph->yaxis->HideTicks(false,false);

$graph->xgrid->Show();
$graph->xgrid->SetLineStyle("solid");
$graph->xaxis->SetTickLabels($xArray);
$graph->xgrid->SetColor('#E3E3E3');

// Create the first line
$p1 = new LinePlot($tArray);
$graph->Add($p1);
$p1->SetColor("#6495ED");
$p1->SetLegend('Temp');

// Create the second line
$p2 = new LinePlot($hArray);
$graph->Add($p2);
$p2->SetColor("#B22222");
$p2->SetLegend('Humidity');

// Create the third line
/*$p3 = new LinePlot($datay3);
$graph->Add($p3);
$p3->SetColor("#FF1493");
$p3->SetLegend('Line 3');*/

$graph->legend->SetFrameWeight(1);

// Output line
$graph->Stroke();

?>

