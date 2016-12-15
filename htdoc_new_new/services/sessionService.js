app.service('SessionService', function ($cookies, RequestService){
    this.restoreSession = function (){
        var sessionToken = $cookies.get('sessionToken');
        var username = $cookies.get('username');
        var objectId = $cookies.get('objectId');

        if(username){   //if a cookie was set before we restore the session
            RequestService.headers['X-Parse-Session-Token'] = sessionToken;
            RequestService.username = username;
            RequestService.objectId = objectId;
        }
        else{   //if no cookies, redirect to the login page
            location.href = "#/Home";
        }
    };
    return this;
});