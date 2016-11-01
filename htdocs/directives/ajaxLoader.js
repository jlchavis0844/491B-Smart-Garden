/*
 * http://stackoverflow.com/questions/17144180/angularjs-loading-screen-on-ajax-request
 * 
 * Really helpful directive that automattacly shows an ajax spinner when making
 * a web request, and hides it when done
 */
app.directive('loading',   ['$http' ,function ($http)
    {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if(v){
                        elm.css('display', 'block');
                    }else{
                        elm.css('display', 'none');
                    }
                });
            }
        };

    }]);