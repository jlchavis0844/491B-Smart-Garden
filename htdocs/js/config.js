//angular stuff
//var module = angular.module("myapp", ['ngRoute','ngCookies','nvd3']);
app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/SignUp', {
                templateUrl: 'views/SignUp.html',
                controller: 'SignUp'
            }).
            when('/Home', {
                templateUrl: 'views/Home.html',
                controller: 'Home'
            }).
            when('/Reports/:plantId', {
                templateUrl: 'views/Reports.html',
                controller: 'Reports'
            }).
            when('/EditPlant/:plantId?', {
                templateUrl: 'views/EditPlant.html',
                controller: 'EditPlant'
            }).
            when('/CommunityGarden/', {
                templateUrl: 'views/CommunityGarden.html',
                controller: 'CommunityGarden'
            }).
            when('/MyGarden', {
                templateUrl: 'views/MyGarden.html',
                controller: 'MyGarden'
            }).
            when('/About', {
                templateUrl: 'views/About.html'
            }).
            when('/Support', {
                templateUrl: 'views/Support.html'
            }).
            when('/Account',{
                templateUrl: 'views/Account.html',
                controller: 'accountController'
            }).
            when('/Graph', {
                templateUrl: 'views/Graph.html',
                controller: 'dataTransferController'
            }).
            otherwise({
                redirectTo: '/Home'
            });
}]);

//pubnub stuff
pubnub = PUBNUB({
    publish_key   : PUBNUB_PUBLISH_KEY,
    subscribe_key : PUBNUB_SUBSCRIBE_KEY
});
