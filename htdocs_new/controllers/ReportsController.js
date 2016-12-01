app.controller("Reports", function ($scope, $http, RequestService, SessionService, $routeParams){
    SessionService.restoreSession();
    var harvest; //index of the chosen harvest
    var check = true; // will check if you are picking a specific date
    
     
    var success1 = function(response){
        $scope.harvestComments = response.data.harvests;
        $scope.harvestComments.push("Harvest in progress..."); // current harvest comment
        $scope.harvestIndex = response.data.harvests.length-1; // index of last element
        harvest = response.data.harvests.length-1; //current harvest
     };    
    
    var fail1 = function (){
         
    };
    RequestService.method = "GET";
    RequestService.url = "https://api.parse.com/1/classes/Plant/"+$routeParams.plantId;
    $http(RequestService).then(success1, fail1); // get harvest comments for plant

    
    
    var success = function (response){
 
        var sensorDataList = response.data.results; // array of sensor data
        var sensorDataArrayWOZeros = []; // array of sensor data with water levels greater than 0
        var sensorCumulativeWater = JSON.parse(JSON.stringify(sensorDataList)); // array of sensor data with cumulative water
        for(var i = 0;i<sensorDataList.length;i++)
        {
            if(sensorDataList[i].water>0)
                sensorDataArrayWOZeros.push(sensorDataList[i]); // add object to array if the water level is greater than 0
        }
        for(var i = 1;i<sensorCumulativeWater.length;i++)
        {
            sensorCumulativeWater[i].water+=sensorCumulativeWater[i-1].water; // add water level of previous object to current one
        }
        if(check){ // if harvest is changed then change the dates to the first and last date of harvest
        $scope.startDate = sensorDataList[0].createdAt; // set start date to first date of harvest
        $scope.endDate = sensorDataList[sensorDataList.length-1].createdAt; // set end date to last date of harvest
        }
              
        
        $scope.data1 = [ 
            {
                key:"Humidity",
                values:_.map(sensorDataList,function (sensorData){
                    return {
                        x: moment(sensorData["createdAt"]).unix(),
                        y:sensorData["humidity"]
                    };
                })
            },
            {
                key:"Temperature",
                values:_.map(sensorDataList,function (sensorData){
                    return {
                        x: moment(sensorData["createdAt"]).unix(),
                        y:sensorData["temperature"]
                    };
                })
            },
            {
                key:"Moisture",
                values:_.map(sensorDataList,function (sensorData){
                    return {
                        x: moment(sensorData["createdAt"]).unix(),
                        y:sensorData["moisture"]
                    };
                })
            },
            {
                key:"Light",
                values:_.map(sensorDataList,function (sensorData){
                    return {
                        x: moment(sensorData["createdAt"]).unix(),
                        y:sensorData["light"]
                    };
                })
            }
        ];
        
        $scope.data2 = [ 
            {
                key:"Water",
                values:_.map(sensorDataArrayWOZeros,function (sensorData){
                    return {
                        x: moment(sensorData["createdAt"]).unix(),
                        y:sensorData["water"]
                    };
                })
            }
        ];

         $scope.data3 = [ 
            {
                key:"Water",
                values:_.map(sensorCumulativeWater,function (sensorData){
                    return {
                        x: moment(sensorData["createdAt"]).unix(),
                        y:sensorData["water"]
                    };
                })
            },
            
        ];
 
    };
    var fail = function (){
        
    };        
    
    $scope.options1 = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 50,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                xAxis: {
                    axisLabel: 'Time',
                    tickFormat: function(d){
                        return moment(d*1000.0).format('M/D hA');
                    }
                },
                yAxis: {
                    axisLabel: 'Sensor Data',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                }                
            }
    };    
    
    $scope.options2 = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 50,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                showControls:false,
                reduceXTicks: true,
                 xAxis: {
                    axisLabel: 'Time',
                    tickFormat: function(d){
                        return moment(d*1000.0).format('M/D h:mA');
                    }
                },
                yAxis: {
                    axisLabel: 'Water Used',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                }
                               
            }
    };   
    
    $scope.options3 = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 50,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                xAxis: {
                    axisLabel: 'Time',
                    tickFormat: function(d){
                        return moment(d*1000.0).format('M/D hA');
                    }
                },
                yAxis: {
                    axisLabel: 'Total Water Used',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                }                
            }
    };    
  
    $scope.startDateOpen = function() {
        check = false;
        $scope.startDateShow = true;
    };
    $scope.startDateShow = false;
    
    $scope.$watchCollection('[startDate, endDate]', function(){ //runs when data changes, also runs when you open the page since it runs when the data gets initialized
        RequestService.url = 'https://api.parse.com/1/classes/SensorData';
        RequestService.method = 'GET';
        if(check) // if true, get sensor data based on the harvest chosen 
        {
        RequestService.params = {
            order:"createdAt",
            where: {                
                "plant":$routeParams.plantId,
                "harvest": harvest              
            },
            "limit":1000    //This needs to be set to get more than 100, 1000 is the max limit
        };
        }
        else{ // get sensor data of harvest given a specific date
        RequestService.params = {
            order:"createdAt",
            where: {                
                "plant":$routeParams.plantId,
                "harvest": harvest,
                "createdAt":{
                    "$gte":{
                        "__type": "Date",
                        "iso": moment($scope.startDate).toISOString()
                    },
                    "$lte":{
                        "__type": "Date",
                        "iso": moment($scope.endDate).toISOString()
                    }
                }                
            },
            "limit":1000    //This needs to be set to get more than 100, 1000 is the max limit
        };
        }
        $http(RequestService).then(success, fail);
    });
    
    
    $scope.endDateOpen = function() {
        check = false;
        $scope.endDateShow = true;
    };
    $scope.endDateShow = false;
    
    $scope.selected = function(index){
        harvest = parseInt(index);
        check=true;
        $scope.startDate = null; // change dates to call function
        $scope.endDate = null; 
    };

}); 