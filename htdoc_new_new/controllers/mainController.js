app.controller("mainController", function ($scope,$cookieStore,$uibModal, RequestService){    
    $scope.loggedIn = function(){
        return RequestService.username;
    };
    $scope.signOut = function (){
        delete RequestService.headers['X-Parse-Session-Token'];
        $cookieStore.remove('sessionToken');
        $cookieStore.remove('username');
        $cookieStore.remove('objectId');
        RequestService.username = "";
        location.href = '#/Home';
    };
    
    $scope.clickLink = function (url) {
        location.href = url;
    };
    
    $scope.expandPic = function (url) {        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/partials/picture.html',
            controller: 'Picture',
            size:'lg',
            resolve:{
                url: function () {
                    return url;
                }
            }
        });
    
        modalInstance.result.then(function (url) {            
        }, function () {});
    };
});

app.controller('Picture', function ($scope, $uibModalInstance, url) {
    $scope.url = url;
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});