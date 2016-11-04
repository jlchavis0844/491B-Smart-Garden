/*
This file will contain 2 different graphController
The frist one will be moisture
And the second one will be temp and humidity
*/
app.controller("moistureController",[ '$scope' ,function($scope){
    $scope.options = {
    chart: {
        type: 'lineWithFocusChart',
        height: 450,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 60
        },
        duration: 500,
        yDomain: [0,1000],
        useInteractiveGuideline: true,
        xAxis: {
            axisLabel: 'Date',
            tickFormat: function(d){
                        return d3.time.format('%d %b %y')(new Date(d));
                    }
        },
        x2Axis: {
          tickFormat: function(d){
                      return d3.time.format('%d %b %y')(new Date(d));
                  }
        },
        yAxis: {
            axisLabel: ' Moisture',
            tickFormat: function(d){
                return d3.format(',f')(d);
            },
            rotateYLabel: false
        },
        y2Axis: {
            tickFormat: function(d){
                return d3.format(',f')(d);
            }
        }
    },
    title: {
      enable : true,
      text : "Moisture"
    }
};
$scope.data = new Array();

$scope.$on('moistureTransfer',function(event, data){
  saveData(data);
});

function saveData(moistureArray){
  $scope.data = [];
  for (i = 0; i < moistureArray.length;i++){
    var flag = true;
    for (j = 0; j < $scope.data.length; j++){
      if($scope.data[j].key == moistureArray[i].sensorName){
        $scope.data[j].values.push({x:new Date(moistureArray[i].timeStamp), y:parseInt(moistureArray[i].moisture)});
        flag = false;
      }
    }
    if (flag){
      $scope.data.push({key: moistureArray[i].sensorName,
        values:[{x:new Date(moistureArray[i].timeStamp), y:parseInt(moistureArray[i].moisture)}]});
    }
  }
  $scope.options.chart.height = 450;
  $scope.options.chart.width = window.innerWidth - 100;
};


}]);


//-------------------------------------------------------------------//



app.controller("tempController",[ '$scope' ,function($scope){
  $scope.options = {
  chart: {
      type: 'lineWithFocusChart',
      height: 450,
      margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 60
      },
      duration: 500,
      //yDomain: [0,1000],
      useInteractiveGuideline: true,
      xAxis: {
          axisLabel: 'Date',
          tickFormat: function(d){
                      return d3.time.format('%d %b %y')(new Date(d));
                  }
      },
      x2Axis: {
        tickFormat: function(d) {
                    return d3.time.format('%d %b %y')(new Date(d));
                  }
      },
      yAxis: {
          axisLabel: ' Temperature',
          tickFormat: function(d){
              return d3.format(',f')(d);
          },
          rotateYLabel: false
      },
      y2Axis: {
          tickFormat: function(d){
              return d3.format(',f')(d);
          }
      }
  },
  title: {
    enable: true,
    text: "Temperature"
  }
};

  $scope.data = new Array();

  $scope.$on('tempTransfer',function(event, data){
    saveTempData(data);
    refreshCharts();
  });

  function refreshCharts () {
            for (var i = 0; i < nv.graphs.length; i++) {
                nv.graphs[i].update();
            }
        };

  function saveTempData(tempArray){
    $scope.data = [];
    for (i = 0; i < tempArray.length;i++){
      var flag = true;
      for (j = 0; j < $scope.data.length; j++){
        if($scope.data[j].key == tempArray[i].sensorName){
          $scope.data[j].values.push({x:new Date(tempArray[i].timeStamp), y:parseInt(tempArray[i].temp)});
          flag = false;
        }
      }
      if (flag){
        $scope.data.push({key: tempArray[i].sensorName,
          values:[{x:new Date(tempArray[i].timeStamp), y:parseInt(tempArray[i].temp)}]});
      }
    }
    $scope.options.chart.width = window.innerWidth - 100;
  };


}]);

app.controller("humidityController",[ '$scope' ,function($scope){
  $scope.options = {
  chart: {
      type: 'lineWithFocusChart',
      height: 450,
      margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 60
      },
      duration: 500,
      //yDomain: [0,1000],
      useInteractiveGuideline: true,
      xAxis: {
          axisLabel: 'Date',
          tickFormat: function(d){
                      return d3.time.format('%d %b %y')(new Date(d));
                  }
      },
      x2Axis: {
        tickFormat: function(d) {
              return d3.time.format('%d %b %y')(new Date(d));
                  }
      },
      yAxis: {
          axisLabel: ' Humidity',
          tickFormat: function(d){
              return d3.format(',f')(d);
          },
          rotateYLabel: false
      },
      y2Axis: {
          tickFormat: function(d){
              return d3.format(',f')(d);
          }
      }
  },
  title: {
    enable: true,
    text: "Humidity"
  }
}

  $scope.data = new Array();

  $scope.$on('humidityTransfer',function(event, data){
    saveHumanityData(data);
  });

  function saveHumanityData(humidityArray){
    $scope.data = [];
    for (i = 0; i < humidityArray.length;i++){
      var flag = true;
      for (j = 0; j < $scope.data.length; j++){
        if($scope.data[j].key == (humidityArray[i].sensorName)){
          $scope.data[j].values.push({x:new Date(humidityArray[i].timeStamp), y:parseInt(humidityArray[i].humidity)});
          flag = false;
        }
      }
      if (flag){
        $scope.data.push({key: (humidityArray[i].sensorName),
          values:[{x:new Date(humidityArray[i].timeStamp), y:parseInt(humidityArray[i].humidity)}]});
      }
    }
    $scope.options.chart.width = window.innerWidth - 100;
  }


}]);


/*
$scope.data = [{
  key: "Sample1",
  values: [{ x: 1, y:2 },{x:2,y:3},{x:3,y:10}]},
{
  key: "Sample2",
  values: [{x:1,y:3}, {x:2, y:7}, {x:3,y:9}]
}
];*/


/*
$scope.data = [];

$scope.$on('tempTransfer',function(event, data){
  console.log("sended");
  console.log(data);
  saveData(data);
});

function saveData(tempArray){
  $scope.data = [];
  for (i = 0; i < tempArray.length;i++){
    var flag = true;
    for (j = 0; j < $scope.data.length; j++){
      if($scope.data[j].key == tempArray[i].sensorName){
        $scope.data[j].values.push({x:new Date(tempArray[i].timeStamp), y:parseInt(tempArray[i].temp)});
        flag = false;
      }
    }
    if (flag){
      $scope.data.push({key: tempArray[i].sensorName,
        values:[{x:new Date(tempArray[i].timeStamp), y:parseInt(tempArray[i].temp)}]});
    }
  }
  console.log($scope.data);
};*/

/*
$scope.data = new Array();

$scope.$on('tempTransfer',function(event, data){
  console.log("sended");
  saveTempData(data);
  saveHumanityData(data);
});

function saveTempData(tempArray){
  $scope.data = [];
  for (i = 0; i < tempArray.length;i++){
    var flag = true;
    for (j = 0; j < $scope.data.length; j++){
      if($scope.data[j].key == tempArray[i].sensorName){
        $scope.data[j].values.push({x:new Date(tempArray[i].timeStamp), y:parseInt(tempArray[i].temp)});
        flag = false;
      }
    }
    if (flag){
      $scope.data.push({key: tempArray[i].sensorName,
        values:[{x:new Date(tempArray[i].timeStamp), y:parseInt(tempArray[i].temp)}]});
      $scope.data[$scope.data.length-1].type = "line";
      $scope.data[$scope.data.length-1].yAxis = 1;
    }
  }
  console.log($scope.data);
};

function saveHumanityData(humidityArray){
  for (i = 0; i < humidityArray.length;i++){
    var flag = true;
    for (j = 0; j < $scope.data.length; j++){
      if($scope.data[j].key == (humidityArray[i].sensorName+ " Humidity")){
        $scope.data[j].values.push({x:new Date(humidityArray[i].timeStamp), y:parseInt(humidityArray[i].humidity)});
        flag = false;
      }
    }
    if (flag){
      $scope.data.push({key: (humidityArray[i].sensorName + " Humidity"),
        values:[{x:new Date(humidityArray[i].timeStamp), y:parseInt(humidityArray[i].humidity)}]});
      $scope.data[$scope.data.length-1].type = "line";
      $scope.data[$scope.data.length-1].yAxis = 2;
    }
  }
};*/
