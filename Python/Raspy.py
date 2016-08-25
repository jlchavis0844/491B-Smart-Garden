import json
from datetime import datetime
import urllib.request
import spidev

def SendData(data):
    today = datetime.now().strftime("%Y-%m-%d")
    moist = data
    use = "TestingDB"
    url = 'http://172.112.41.210:8110/php/SendData.php?use='+use+'&Moisture='+str(moist)+'&Gdate=' + today + '&Water=' + str(CheckWater(moist))
    response = urllib.request.urlopen(url)
    re = response.read().decode('utf-8')
    obj = json.loads(re)
    print(obj)

def CheckTime(waterTime):
    #format time (13:25:00) is a watering time at 1:25pm local time
    tick = datetime.strptime(waterTime, '%H:%M:%S')
    while(tick.strftime('%H:%M:%S') != datetime.now().strftime('%H:%M:%S')):
        {}
    SendData(GetReading(0))
    
def CheckWater(mLimit):
    if(mLimit < 500):
        water = 1
    else:
        water = 0
    return water

def GetReading(channel):
    rawData = spi.xfer([1,(8+channel) << 4, 0])
    processedData = ((rawData[1]&3) << 8) + rawData[2]
    return processedData
    
spi = spidev.SpiDev()
spi.open(0,0)
waterChannel = 0

print(GetReading(waterChannel))

CheckTime('21:15:00')
