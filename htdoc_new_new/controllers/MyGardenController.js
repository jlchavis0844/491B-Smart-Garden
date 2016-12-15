app.controller("MyGarden", function ($scope, $http, RequestService, SessionService){
    SessionService.restoreSession();
    RequestService.method = "GET";
    RequestService.url = "https://api.parse.com/1/classes/Plant";
    RequestService.params = {
        where: {
            "user":RequestService.username
        }
    };
        
    $http(RequestService).then(success, fail);
    var success = function(response){
        $scope.user = response.data;
        $scope.plants = response.data.results;
    };
    var fail = function (response){
        var x = 0;
    };    
    $scope.newPlant = function(){
        location.href = '#/EditPlant/';
    };
    $scope.waterPlants = function (){
        pubnub.publish({
            channel : RequestService.username + EMBEDDED_CHANNEL,
            message : WATER_MESSAGE,
            callback: function (){
            }
        });
        $scope.watering = true;
        setTimeout(function (){
            $scope.watering = false;
            $scope.$apply();
        }, WATERING_TIME_IN_MILLI);
    };
    
    $scope.Graph = function(plantId)
    {
        location.href = '#/Reports/'+plantId;
    };
    
    $http(RequestService).then(success, fail);
    
    var sendGetSensorMessage = function(){
        pubnub.publish({
            channel : RequestService.username + EMBEDDED_CHANNEL,
            message : SEND_SENSOR_MESSAGE,
            callback: function (){
            }
        });
    };
    pubnub.subscribe({
        channel : RequestService.username + WEBSITE_CHANNEL,
        message : function(message,env,ch,timer,magic_ch){
            var sensorArray = message.split(",");
            $scope.temperature = sensorArray[TEMPERATURE_INDEX];
            $scope.humidity = sensorArray[HUMIDITY_INDEX];
            $scope.moisture = sensorArray[MOISTURE_INDEX];
            $scope.light = sensorArray[LIGHT_INDEX];
            $scope.$apply();
            sendGetSensorMessage();
        }        
    });
    sendGetSensorMessage();
    $scope.$on("$destroy", function () {
        pubnub.unsubscribe({
            channel : RequestService.username + WEBSITE_CHANNEL
        });
    });
});