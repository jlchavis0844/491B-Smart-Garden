app.controller("Home", function ($scope, $http, $cookieStore, RequestService, LogInService, SessionService){
    SessionService.restoreSession();
//    var sessionToken = $cookieStore.get('sessionToken');
//    var username = $cookieStore.get('username');
//    var objectId = $cookieStore.get('objectId');
//    
//    if(username){   //we assign in two steps since having undefined headers could mess with the requests
////        RequestService.headers['sessionToken'] = sessionToken;
//        RequestService.username = username;
////        RequestService.objectId = objectId;
//        location.href = "#/Home";
//    }
    
    $scope.signIn = function (usrName, passwrd){        
        RequestService.url = 'https://api.parse.com/1/login';
        RequestService.method = 'GET';
        RequestService.params = {
            username: usrName,
            password: passwrd
        };
        $http(RequestService).then(LogInService.success(usrName), LogInService.error);
        location.href = "#/MyGarden";
    };
});