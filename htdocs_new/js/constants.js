var PUBNUB_SUBSCRIBE_KEY = "sub-c-853eef00-65a0-11e5-bba9-02ee2ddab7fe";
var PUBNUB_PUBLISH_KEY = "pub-c-db55d0d1-65c7-4814-a2a4-f72278c65812";
var WATERING_TIME_IN_MILLI = 5000;
/*
 * Channels
 * Chanels will have the following pattern:
 * username + CHANNEL, to distingguish users from each other
 */
var WEBSITE_CHANNEL = "WebSite";  //Channel for website to recieve messages
var EMBEDDED_CHANNEL = "Embedded";  //Channel for board to recieve messages from the website.

/*
 * Messages
 * strings for telling the board to do something
 */
var SEND_SENSOR_MESSAGE = "SendSensors";
var WATER_MESSAGE = "Water";
var UPDATE_MESSAGE = "Update";
/*
 * Indexes
 * The website will only receive a single message encoded in csv.
 * After converting the string to an array via .split(",") the array will have
 * the following indexes.
 */
var TEMPERATURE_INDEX = 0;
var HUMIDITY_INDEX = 1;
var MOISTURE_INDEX = 2;
var LIGHT_INDEX = 3;