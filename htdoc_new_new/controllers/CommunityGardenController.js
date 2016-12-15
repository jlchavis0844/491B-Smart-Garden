app.controller("CommunityGarden", function ($scope, $http, RequestService)
{
    $scope.page = 1;
    $scope.paging = 0;
    var fail = function(response){};
    $scope.end = function()
    {
        return($scope.max-$scope.page*20>=0);
    };
    var success = function(response)
    {
            $scope.max = response.data.count;
            $scope.pages = parseInt($scope.max/20);
            RequestService.method = "GET";
            RequestService.url = "https://api.parse.com/1/classes/Plant/";
            RequestService.params = 
            {
                    "limit":10,
                    "skip":($scope.page-1)*10
             };
        if($scope.query)
        {
            httpQuery();
        }
        var success = function(response)
        {
            $scope.plants = response.data.results;
        };
        $http(RequestService).then(success,fail);



    };
    var httpQuery = function()
    {
        RequestService.params.where =  
        {
            "$or":
            [
                {"user":{"$regex":$scope.query,"$options":"i"}},
                {"plantName":{"$regex":$scope.query,"$options":"i"}},
                {"plantType":{"$regex":$scope.query,"$options":"i"}}
            ]
        };
            
    };
    var load = function()
    {
        RequestService.method = "GET";
        RequestService.url = "https://api.parse.com/1/classes/Plant/";
        RequestService.params = 
        {
            "count":1,
            "limit":0
        };  
        if($scope.query)
        {
            httpQuery();
        }
        $http(RequestService).then(success,fail);
    };
        load();
    $scope.search = function()
    {
        $scope.query = document.getElementById("query").value;
        $scope.page = 1;
        load();
    };
    function sortNumber(a,b) 
    {
        return a - b;
    }
    $scope.goTo = function(page)
    {
        $scope.page = page;
        load();
    }
    $scope.isThisCurrentPage = function(page)
    {
        if(page==$scope.page)
        {
            return "current";
        }
        else
        {
            return "notCurrent";
        }
    }
    $scope.getNumber = function() 
    {
        var pages = [$scope.page];
        for(var i = 1; i <= 2 && $scope.page-i!=0;i++)
        {
            pages.push($scope.page-i);
        }
        for (var i = 1; i<=2 && $scope.page+i<=($scope.max/20)+1;i++)
        {
            pages.push($scope.page+i);
        }
        pages.sort(sortNumber);
        return pages;
    }
    $scope.navigateToGraph = function(id)
    {
        location.href = "#/Reports/"+id;
    }
    $scope.previous = function()
    {
        document.getElementById("query").value = $scope.query;
        $scope.page--;
        load();
    };
    $scope.next = function()
    {
        document.getElementById("query").value = $scope.query;
        $scope.page++;
        load();
    };
});