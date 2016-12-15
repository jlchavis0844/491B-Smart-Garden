app.controller("SignUp", function ($scope, $http, RequestService, LogInService){    
    $scope.signUp = function (){        
        RequestService.url = 'https://api.parse.com/1/users';
        RequestService.method = 'POST';
        RequestService.data = { 
            username: $scope.username,
            password: $scope.password
        };        
       $http(RequestService).then(LogInService.success($scope.username), LogInService.error);
    };
});