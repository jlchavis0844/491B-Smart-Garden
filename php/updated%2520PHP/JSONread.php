	<?php
	header('Content-Type: json');
	//receive data from the json body
	$data = file_get_contents('php://input');
	$data = json_decode($data, true);
	//var_dump($data);

	$user = $data['user'];
	$password = $data['password'];
	$gardens = $data['Gardens'];

	$tsensors = array();
	$msensors = array();
	$tchan = array();
	$mchan = array();
	$mlimit = array();
	$gardenNames = array();
	//var_dump($gardens);
	foreach ($gardens as $gName => $tName){//rewrite logic goal sensors per garden
		//var_dump($tName[0]);
		foreach ($tName[0] as $key => $value) {
			foreach ($value as $key2 => $value2) {
				print($gName . " " . $key . " ". $value2 . "<br>" );
				array_push($tsensors, $value2);
			}
		}

		foreach ($tName[1] as $key => $value) {
			foreach ($value as $key2 => $value2) {
				print($gName . " " . $key . " ". $value2 . "<br>" );
				array_push($tchan, $value2);
			}
		}

		foreach ($tName[2] as $key => $value) {
			foreach ($value as $key2 => $value2) {
				print($gName . " " . $key . " ". $value2 . "<br>" );
				array_push($msensors, $value2);
			}
		}

		foreach ($tName[3] as $key => $value) {
			foreach ($value as $key2 => $value2) {
				print($gName . " " . $key . " ". $value2 . "<br>" );
				array_push($mchan, $value2);
			}
		}

		foreach ($tName[4] as $key => $value) {
			foreach ($value as $key2 => $value2) {
				print($gName . " " . $key . " ". $value2 . "<br>" );
				array_push($mlimit, $value2);
			}
		}
	}


	$response = array("status" => "true");
	$response["message"] = "200 OK";

	//var_dump($response);
	foreach($tsensors as $key => $value){
		$cmd = "INSERT INTO sensors (user, name, channel) VALUES ($user, $value, $tchan[$key]);";
		$response['command' . $key] = $cmd;

	}

	echo json_encode($response);

	?>