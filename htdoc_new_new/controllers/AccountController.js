app.controller("accountController",['$scope' , '$http' ,function($scope,$http){
  $scope.tab = 1;

  $scope.response = "";

  $scope.setTab = function(newTab){
    $scope.tab = newTab;
  };

  $scope.isTab = function(tabNum){
    return $scope.tab === tabNum;
  };

  $scope.register = function(){
    if(!$scope.regist.user.$error.required && !$scope.regist.password.$error.required){
      $http({
         url: "http://76.94.123.147:49180/register.php",
         method : "GET",
         params:{user:$scope.user,
                 password:$scope.password
                 }
       })
       .then(function mySuccess(response) {
         $scope.response = response.data;
       }, function myError(response){
         $scope.response = response.data;
       });
    }
    else{ //This is when user do not enter the password and user correctly

    }
  }

  $scope.addGarden = function(){
    if(!$scope.addgarden.user.$error.required && !$scope.addgarden.password.$error.required &&
    !$scope.addgarden.garden.$error.required){
      $http({
         url: "http://76.94.123.147:49180/addGarden.php",
         method : "GET",
         params:{user:$scope.user,
                 password:$scope.password,
                 gName:$scope.garden
                 }
       })
       .then(function mySuccess(response) {
          console.log(response)
          if(response.data =="	true"){
            $scope.response = "The Garden add successfully";
          }
          else{
            $scope.response = "Error"
          }
       }, function myError(response){
         $scope.response = response.data;
       });
    }
    else{ //This is when user do not enter the password and user correctly

    }
  }

  $scope.addSensor = function(){
    if(!$scope.addsensor.user.$error.required && !$scope.addsensor.password.$error.required &&
    !$scope.addsensor.garden.$error.required &&
    !$scope.addsensor.sensor.$error.required){
      $http({
         url: "http://76.94.123.147:49180/addSensor.php",
         method : "GET",
         params:{user:$scope.user,
                 password:$scope.password,
                 gName:$scope.garden,
                 sName:$scope.sensor
                 }
       })
       .then(function mySuccess(response) {
          console.log(response)
          if (response.data == "true"){
            console.log(response.data);
            $scope.response = "The Sensor add successfully";
          }
          else if(response.data == "Incorrect password"){
            $scope.response = "The user name/ password is incorrect";
          }
          else{
            console.log(response.data);
            $scope.response = "The Sensor Name already exist";
          }
       }, function myError(response){
         $scope.response = response.data;
       });
    }
    else{ //This is when user do not enter the password and user correctly

    }
  }

  $scope.deleteGarden = function(){
    if(!$scope.delGarden.user.$error.required && !$scope.delGarden.password.$error.required &&
    !$scope.delGarden.garden.$error.required){
      $http({
         url: "http://76.94.123.147:49180/deleteGarden.php",
         method : "GET",
         params:{user:$scope.user,
                 password:$scope.password,
                 gardenName:$scope.garden
                 }
       })
       .then(function mySuccess(response) {
          if (response.data.updated == "0 | 1"){
            $scope.response = "The Garden delete successfully";
          }
          else{
            $scope.response = "The Garden is not exist";
          }
       }, function myError(response){
         $scope.response = response.data;
       });
    }
    else{ //This is when user do not enter the password and user correctly

    }
  }

  $scope.deleteSensor = function(){
    if(!$scope.delSensor.user.$error.required && !$scope.delSensor.password.$error.required &&
    !$scope.delSensor.garden.$error.required &&
    !$scope.delSensor.sensor.$error.required){
      $http({
         url: "http://76.94.123.147:49180/deleteSensor.php",
         method : "GET",
         params:{user:$scope.user,
                 password:$scope.password,
                 //gName:$scope.garden,
                 sensorName:$scope.sensor
                 }
       })
       .then(function mySuccess(response) {
          console.log(response)
          if (response.data.updated != 0){
            console.log(response.data);
            console.log(typeof(response.data.updated))
            $scope.response = "The sensor delete successfully.";
          }
          else{
            $scope.response = "The sensor delete is fail.";
          }
       }, function myError(response){
         $scope.response = response.data;
       });
    }
    else{ //This is when user do not enter the password and user correctly

    }
  }

}]);
