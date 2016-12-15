app.controller("dataTransferController", [ '$scope', '$http' , function ($scope,$http){

	$scope.moistGraph = false;
	$scope.tempGraph = false;
	$scope.errorMessage = false;
	$scope.responseMessage ="";

	$scope.getReport = function(){
		var endDate = new Date($scope.date);
		var startDate = new Date();

		if(!$scope.myform.user.$error.required && !$scope.myform.password.$error.required && !$scope.myform.gardenName.$error.required)
		{
			if ($scope.period == "Year"){
				startDate.setDate(endDate.getDate() - 365);
			}
			else if ($scope.period == "Month"){
				startDate.setDate(endDate.getDate() - 30);
			}
			else if ($scope.period == "Week"){
				startDate.setDate(endDate.getDate() - 7 );
			}

		   $http({
					url: "http://76.94.123.147:49180/getGardenData.php",
					method : "GET",
					params:{user:$scope.user,
									password:$scope.password,
									gardenName:$scope.gardenName,
									startDate:yyyymmdd(startDate),
									endDate:yyyymmdd(endDate)
									}
				})
				.then(function mySuccess(response) {
					var moistureArray = [];
					var tempArray = [];
					//separate the Array to moiture and sensor
					if(response.data.length == 0){ // This is the case the garden name is invalid
						$scope.responseMessage = "The Garden doesn't exist/ no data exist in that period. Please check again";
						$scope.errorMessage = true;
						$scope.moistGraph = false;
						$scope.tempGraph = false;
					}else if(response.data == "User password is incorrect, "){ //This is the case when the user name or password name is incorrect
						$scope.responseMessage = response.data;
						$scope.errorMessage = true;
						$scope.moistGraph = false;
						$scope.tempGraph = false;
					}else{
						for (i = 0; i < response.data.length; i++){
							if (response.data[i].temp == null){
								moistureArray.push(response.data[i]);
							}else {
								tempArray.push(response.data[i]);
							}
						}
						if (moistureArray.length != 0){
							$scope.moistGraph = true;
							$scope.$broadcast('moistureTransfer',moistureArray);
						}
						else{
							$scope.moistGraph = false;
						}
						if (tempArray.length != 0){
							$scope.tempGraph = true;
							$scope.$broadcast('tempTransfer',tempArray);
							$scope.$broadcast('humidityTransfer',tempArray);

						}
						else{
							$scope.tempGraph = false;
						}
						$scope.errorMessage = false;
					}
	    	}, function myError(response) {
					console.log(response.statusText);
	        console.log("Bad");
	    	});
		}else{
			$scope.tempGraph = false;
			$scope.moistGraph = false;
		}
	};

	function getEndDate(){
		var endDate = new Date(document.getElementById("date").value);
		endDate.setDate(endDate.getDate()+1);
		return $scope.yyyymmdd(endDate);
	};

	function getStartDate(){
		var endDate = new Date(document.getElementById("date").value);
		endDate.setDate(endDate.getDate()+1);
		var startDate = new Date();

		if ($scope.period == "Year"){
			startDate.setDate(endDate.getDate() - 365);
		}
		else if ($scope.period == "Month"){
			startDate.setDate(endDate.getDate() - 30);
		}
		else if ($scope.period == "Week"){
			startDate.setDate(endDate.getDate() - 7 );
		}
		return $scope.yyyymmdd(startDate);
	};


	function decode(url){ // url is the link
		var text;
		var obj = JSON.parse(text);
		return obj;
	};

	function yyyymmdd(date) {
  		var mm = date.getMonth() + 1; // getMonth() is zero-based
  		var dd = date.getDate();
  		if (mm < 10 && dd < 10)
	  		return [date.getFullYear(), !mm[1] && '-0', mm, !dd[1] && '-0', dd].join(''); // padding
	  	else if (mm < 10)
			return [date.getFullYear(), !mm[1] && '-0', mm, !dd[1] && '-', dd].join(''); // padding
		else if (dd < 10)
 	 		return [date.getFullYear(), !mm[1] && '-', mm, !dd[1] && '-0', dd].join(''); // padding
 	 	else
	  		return [date.getFullYear(), !mm[1] && '-', mm, !dd[1] && '-', dd].join(''); // padding
	};
}]);
/*
	   $scope.testing = "http://76.94.123.147:49180/getGardenData.php?user="+$scope.user+"&password="+$scope.password+"&gardenName="+$scope.gardenName+"&startDate="+yyyymmdd(startDate)+"&endDate="+yyyymmdd(endDate);

$(document).ready(function(){
	$("#submitButton").click(function() {
		//console.log(angular.element().scope().getEndDate());
		$.ajax({
                type: "POST",
                url: "http://76.94.123.147:49180/getGardenData.php" ,
                dataType: 'json',
                data: { user: ("#user") ,
            			password : ("#password"),
            			gardenName : ("#gardenName")
            			//startDate : angular.element($('GraphController')).scope().getStartDate(),
            			//endDate : angular.element($('GraphController')).scope().getEndDate()
            		},
                success : function() {
                	console.log("Good");
                    // here is the code that will run on client side after running clear.php on server

                    // function below reloads current page
                    location.reload();
                }
            });
	});
});

/*
		$.ajax({
                type: "POST",
                url: "http://76.94.123.147:49180/getGardenData.php" ,
                dataType: 'json',
                data: { "user": user ,
            			"password" :password,
            			"gardenName":gardenName,
            			"startDate":$scope.yyyymmdd(startDate),
            			"endDate":$scope.yyyymmdd(endDate)},
                success : function() {

                    // here is the code that will run on client side after running clear.php on server

                    // function below reloads current page
                    location.reload();
                }
            });


	$.getJSON("http://76.94.123.147:49180/getGardenData.php?user=testUser&password=password1&gardenName=Garden1&startDate=2015-10-03&endDate=2016-10-02", function(result){
            $.each(result, function(i, field){
                $("div").append(field + " ");
            });
        });


        	*/




					/*
									$scope.sensorName = response.data[0].sensorName;
									$scope.temp = response.data[0].temp;
									$scope.humidity = response.data[0].humidity;
									$scope.moisture = response.data[0].moisture;
									$scope.timeStamp = response.data[0].timeStamp;
									console.log(response);
									console.log($scope.sensorName);
									console.log($scope.temp);
									console.log($scope.humidity);
									console.log($scope.moisture);
									console.log($scope.timeStamp);
									console.log($scope.sensorName);
									console.log(response.data.length);*/
