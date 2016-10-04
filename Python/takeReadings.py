import Adafruit_GPIO.SPI as SPI#software SPI import
import Adafruit_MCP3008 #for the Digital to Analog converter
import Adafruit_DHT #for the temp sensor
import RPi.GPIO as GPIO #for the digital pins
import sys, ast, datetime ##basic imports, nothing cool here
import json # for sending data
import urllib2 #for php calls

#DHT declerations
sensor = Adafruit_DHT.DHT11 #set sensor type, use DHT22 or DHT11
#pins = [19, 17, 6, 22] - we will reads these in later from sensors.lst

#connection variables
timeStamp = str(datetime.datetime.now()).split('.')[0] #timestamp
urlBase = 'http://76.94.123.147:49180/SendData.php?' #base url

# Software SPI configuration: various pins
CLK  = 18
MISO = 23
MOSI = 24
CS   = 25
mcp = Adafruit_MCP3008.MCP3008(clk=CLK, cs=CS, miso=MISO, mosi=MOSI) #combine MCP3008 pins
#channel = 0 #MCP3008 channel - this will be read from channels.lst

#ready digital pin
GPIO.setmode(GPIO.BCM)#set board type (BCM or BOARD)
GPIO.setup(12,GPIO.IN)#mark pin as input

#read in sensor pins, names and channel locations from conf
file = open('gardenData.conf', 'r')
tempSensors = ast.literal_eval(file.readline());
sensorNames = ast.literal_eval(file.readline());
channels = ast.literal_eval(file.readline());
moistNames = ast.literal_eval(file.readline());
userInfo = ast.literal_eval(file.readline());

print(tempSensors)
print(sensorNames)
print(channels)
print(moistNames)
print(userInfo)


#read in log in info
userName = userInfo[0] #read in user name
password = userInfo[1] #read in password
urlBase += ('user=' + userName + '&password=' + password)#append url info


#making arrays to hold the readings based on size of tempSensors and channels
tempReadings = []
humReadings = []
moistReadings = []
tempResponses = []
moistReponses = []

#flips the bit values of the read in rate
def invert(number):
    xorNum = 0b1111111111#8 bits, all high
    answer = number ^ xorNum # XOR opperation
    #print("converting " + bin(number)+" xor " + str(xorNum) + " to " + bin(answer))
    return answer #returns flipped bits

#converts celcius to farenheight
def convertTemp(temp):
        return ((temp*1.8)+32)
		
		
#will take temp readings and store them in tempReadings
def readTemps():
	#start read loop for sensors	
	for i in tempSensors:
		humidity, temperature = Adafruit_DHT.read_retry(sensor, i)#get readings
		tempReadings.append(temperature)#append to temp list
		humReadings.append(humidity)#append to humid list
		
		#if this is true, hopefully None (null) is written to the list and the order is maintained
		if humidity is None and temperature is None:
			print('Failed to get reading.')

#will take the moisture readings
def getMoist(): #;0)
	for x in channels:
			moisture = invert(mcp.read_adc(x))#get readings
			moistReadings.append(moisture)#store to end of list

def writeToLog(writeData):
	fo = open("log.txt", "a")
	for curr in writeData:
		fo.write(curr + ' ' + timeStamp + '\n')

	fo.close()


def sendTempReadings():
	for index, w in enumerate(tempReadings):
		if sensorNames[index] is None:
			print("there are now more sensor names")
			break
		else:
			strData = '&name=' + sensorNames[index] + '&temp=' + str(w) +'&hum=' + str(humReadings[index])
			url = urlBase + strData
			print('calling ' + url)
			resp = urllib2.urlopen(urllib2.Request(url))#make PHP call
			tempResponses.append(strData + ' ' + resp.read())#store reponse
	print(tempResponses)#print all responses
	writeToLog(tempResponses)

def sendMoistTemps():
	for index, w in enumerate(moistReadings):
		if moistNames[index] is None:
			print("there are now more sensor names")
			break
		else: 
			strData = '&name=' + moistNames[index] + '&moisture=' + str(w)
			url = urlBase + strData
			print('calling ' + url)
			resp = urllib2.urlopen(urllib2.Request(url))#make PHP call
			moistReponses.append(strData + ' ' + resp.read())#store reponse
	print(moistReponses)#print all responses
	writeToLog(moistReponses)


readTemps()#get temperature and humidity readings
getMoist()# get moisture readings
sendTempReadings()#send the temp/humid readings
sendMoistTemps()#send moisture readings



