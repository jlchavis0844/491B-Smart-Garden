app.factory('LogInService', function ($cookies, RequestService){
    return {
        /*
         * The response doesn't give back the username when signing up
         * but once you log in you'll probably need it, so we have to
         * pass it in from the controller then return the success callback
         * function.
         */
        success: function(username){
            return function(response) {
                RequestService.headers['X-Parse-Session-Token'] = response.data.sessionToken;
                RequestService.username = username;
                RequestService.objectId = response.data.objectId;
                var expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 365);
                $cookies.put('sessionToken', response.data.sessionToken,{expires: expireDate});
                $cookies.put('username', username, {expires: expireDate});
                $cookies.put('objectId', response.data.objectId, {expires: expireDate});
                
                location.href = "#/myGarden";
            };
        },
        error: function (response){
            alert(response["data"]["error"]);
        }
    };    
});