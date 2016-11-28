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
          if (response.data != "	true"){
            console.log(response.data);
            $scope.response = "Since the Garden exist, can't add the Garden.";
          }
          else if(response.data != "	Incorrect password"){
            $scope.response = "The user name/ password is incorrect";
          }
          else{
            console.log(response.data);
            $scope.response = "The Garden add successfully";}
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
            $scope.response = "The Garden add successfully";
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

}]);
