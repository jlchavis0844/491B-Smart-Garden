app.controller("EditPlant", function ($scope, $http, RequestService, SessionService, $routeParams, $uibModal){
    SessionService.restoreSession();
    $scope.vegetables = VEGETABLES;
    $scope.waterOptions = {        
        floor: 0,
        ceil: 100,
        step: 1,
        translate:function (value){
            return value / 100;
        }
    };
    $scope.moistureOptions = {        
        floor: 0,
        ceil: 700,
        step: 5
    };
    $scope.newPlant = typeof $routeParams.plantId === 'undefined';
    $scope.title = $scope.newPlant ? "New Plant" : "EditPlant";
    if($scope.newPlant){
        $scope.plant = {
            ACL:{},
            waterAmount:3,
            moistureLimit:10
        };        
        $scope.plant.ACL[RequestService.objectId] = {
            read:true,
            write:true
        };
        $scope.plant.ACL["*"] = {
             read:false
         };        
    }    
    RequestService.method = "GET";
    RequestService.url = "https://api.parse.com/1/classes/Plant/"+$routeParams.plantId;
    var success = function(response)
    {        
        $scope.plant = response.data;
        $scope.plant.waterAmount = response.data.waterAmount * 100; //The number slider only increments in intergers so we convert to ints when reading then back to decimals when saving
        if(!$scope.plant.ACL["*"]){
            $scope.plant.ACL["*"] = {
                read:false
            };
        }
    };
    var fail = function (response){
          var x = 0;
    };
    $http(RequestService).then(success, fail);  
    
    var backToPlants = function(response)
    {
        pubnub.publish({
            channel : RequestService.username + EMBEDDED_CHANNEL,
            message : UPDATE_MESSAGE,
            callback: function (){
            }
        });
        location.href = "#/MyGarden";
    };
    $scope.Done = function()
    {
        if($scope.editPlantForm.$valid){
            RequestService.method = $scope.newPlant ? "POST" : "PUT" ;
            RequestService.url = "https://api.parse.com/1/classes/Plant/" + ($scope.newPlant ? "" : $routeParams.plantId);
            if(!$scope.plant.ACL["*"].read){
                delete $scope.plant.ACL["*"];
            }
            RequestService.data = $scope.plant;
            RequestService.data.waterAmount = $scope.plant.waterAmount / 100;
            if($scope.newPlant){
                RequestService.data.harvests = [];
            }            
            RequestService.data.user = RequestService.username;        
            $http(RequestService).then(backToPlants, fail);    
        }
    };

    $scope.Delete = function()
    {
        RequestService.method = "DELETE";
        RequestService.url = "https://api.parse.com/1/classes/Plant/"+$routeParams.plantId;
        $http(RequestService).then(backToPlants, fail);
    };    
    
    $scope.formatHarvest = function (harvestId){
        return $scope.plant.harvests[harvestId].substring(0,20) 
            + ($scope.plant.harvests[harvestId].length > 20 ? "..." : "");
    };
    $scope.editHarvest = function (harvestId) {
        var newHarvest = typeof harvestId === 'undefined';
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/harvest.html',
            controller: 'Harvest',          
            resolve: {
              "harvestMessage": function (){
                  return newHarvest ? "" : $scope.plant.harvests[harvestId];
              }
            }
        });
    
        modalInstance.result.then(function (harvestMessage) {
            if(typeof $scope.plant.harvests === 'undefined'){
                $scope.plant.harvests = [];
            }
            if(newHarvest){
                $scope.plant.harvests.push(harvestMessage);
            }
            $scope.plant.harvests[harvestId] = harvestMessage;
        }, function () {});
    };
});

app.controller('Harvest', function ($scope, $uibModalInstance, harvestMessage) {
    $scope.harvestMessage = harvestMessage;
    $scope.ok = function () {
        $uibModalInstance.close($scope.harvestMessage);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});