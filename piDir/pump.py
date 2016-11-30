#pump pin
#just call Pump() whenever the moisture level gets below the set value
def Pump(seconds):
    GPIO_PIN = 16
    GPIO.setup(GPIO_PIN, GPIO.OUT)

# Send a signal to the relay
    def SendSignal():
        try:
            GPIO.output(GPIO_PIN, GPIO.HIGH)
            time.sleep(seconds)
            GPIO.output(GPIO_PIN, GPIO.LOW)
        except:
            print ("Something wrong")
            pass

    SendSignal()
    GPIO.cleanup()

#the code i used to get a reading and check it against a set value
#mlimit is moisture limit
#seconds is time to leave pump on
#channel is what channel for the mcp3008
    #check water channel use spi library
def GetReading(channel, mLimit, seconds):
    spi = spidev.SpiDev()
    spi.open(0,0)
    for chans in channel: 
        rawData = spi.xfer([1,(8+chans) << 4, 0])
        processedData = ((rawData[1]&3) << 8) + rawData[2]
        moistReadings.append(processedData)
    CheckWater(mLimit, seconds, processedData)


#same variables current is currently measured moisture
#user defined moisture limit can place signal processing here to start pump
def CheckWater(mLimit, seconds, current):
    if(current < mLimit):
        #possible way to keep track of watering cycles/ water usage
        #send the signal to the pump
        #and a bit to the database to show it was watered that day
        #watering time also goes here, a timer to be able to dispense 
        #a certain amount of water
        print("watering")
        #Pump(seconds)
    else:
        print("no water needed")