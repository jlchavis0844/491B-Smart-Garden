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
  $scope.data = [{key:"",values:[]}];

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
  for (i = 0; i < $scope.data.length;i++){
    fillDataGap($scope.data[i].values,$scope.data[i].values.length,i);
  }
  $scope.options.chart.width = window.innerWidth - 100;
};

function fillDataGap(incomingData,dataLength,order){
  var minDate = new Date(incomingData[0].x).getTime();
  var maxDate = new Date(incomingData[dataLength-1].x).getTime();
  var currentDate = minDate;
  var midPoint,change = true;
  d = new Date(currentDate);
  while(change){
    change = false;
    var lengthOfData = $scope.data[order].values.length;
    for(j = 0; j < lengthOfData-1;j++){
      if($scope.data[order].values[j+1].x.getTime() - $scope.data[order].values[j].x.getTime() > (24 * 60 * 60 * 1000)/4){
        midPointX = $scope.data[order].values[j].x.getTime() + ($scope.data[order].values[j+1].x.getTime() - $scope.data[order].values[j].x.getTime()) / 2;
        midPointY = ($scope.data[order].values[j+1].y + $scope.data[order].values[j].y) / 2;
        $scope.data[order].values.push({x:new Date(midPointX), y: midPointY});
        change = true;
      }
    }
    $scope.data[order].values.sort(function(a,b){return a.x.getTime() - b.x.getTime()});
  }
}

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

  $scope.data = [{key:"",values:[]}];


  $scope.$on('tempTransfer',function(event, incomingData){
    saveTempData(incomingData);
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
      }
    }
    for (i = 0; i < $scope.data.length;i++){
      fillDataGap($scope.data[i].values,$scope.data[i].values.length,i);
    }
    $scope.options.chart.width = window.innerWidth - 100;
  };

  function fillDataGap(incomingData,dataLength,order){
    var minDate = new Date(incomingData[0].x).getTime();
    var maxDate = new Date(incomingData[dataLength-1].x).getTime();
    var currentDate = minDate;
    var midPoint,change = true;
    d = new Date(currentDate);
    while(change){
      change = false;
      var lengthOfData = $scope.data[order].values.length;
      for(j = 0; j < lengthOfData-1;j++){
        if($scope.data[order].values[j+1].x.getTime() - $scope.data[order].values[j].x.getTime() > (24 * 60 * 60 * 1000)/4){
          midPointX = $scope.data[order].values[j].x.getTime() + ($scope.data[order].values[j+1].x.getTime() - $scope.data[order].values[j].x.getTime()) / 2;
          midPointY = ($scope.data[order].values[j+1].y + $scope.data[order].values[j].y) / 2;
          $scope.data[order].values.push({x:new Date(midPointX), y: midPointY});
          change = true;
        }
      }
      $scope.data[order].values.sort(function(a,b){return a.x.getTime() - b.x.getTime()});
    }
  }


}]);

app.controller("humidityController",[ '$scope' ,function($scope, _){
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

  $scope.data = [{key:"",values:[]}];

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
    for (i = 0; i < $scope.data.length;i++){
      fillDataGap($scope.data[i].values,$scope.data[i].values.length,i);
    }
    $scope.options.chart.width = window.innerWidth - 100;
  }

  function fillDataGap(incomingData,dataLength,order){
    var minDate = new Date(incomingData[0].x).getTime();
    var maxDate = new Date(incomingData[dataLength-1].x).getTime();
    var currentDate = minDate;
    var midPoint,change = true;
    d = new Date(currentDate);
    while(change){
      change = false;
      var lengthOfData = $scope.data[order].values.length;
      for(j = 0; j < lengthOfData-1;j++){
        if($scope.data[order].values[j+1].x.getTime() - $scope.data[order].values[j].x.getTime() > (24 * 60 * 60 * 1000)/4){
          midPointX = $scope.data[order].values[j].x.getTime() + ($scope.data[order].values[j+1].x.getTime() - $scope.data[order].values[j].x.getTime()) / 2;
          midPointY = ($scope.data[order].values[j+1].y + $scope.data[order].values[j].y) / 2;
          $scope.data[order].values.push({x:new Date(midPointX), y: midPointY});
          change = true;
        }
      }
      $scope.data[order].values.sort(function(a,b){return a.x.getTime() - b.x.getTime()});
    }
  }


}]);
