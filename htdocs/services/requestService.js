
/*
 * After loging in the a sessionToken will be set in the header property
 * to get the data on later requests
 */
app.factory('RequestService', function (){
    var req = {
        method: 'POST',
        url: '',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id':'CGoWmZK6uPmAUuldwGcVwOb871lehEClGlGwVTp2',
          'X-Parse-REST-API-Key': 'h50pKtIj7oNDqWGoz3zUFhoqKbVdeOrPSosGK0zJ'              
        },
        data: {}
    };
    return req;
});