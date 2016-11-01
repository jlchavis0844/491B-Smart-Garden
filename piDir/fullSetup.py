"""
Created on Oct 6, 2016

@author: James
"""
# This class funs the complete setup of the SmartGarden 
# if the installFiles() method is used as an entry into this class
# then the script will run the DHT and MCP install of Adafruits python libraries
# if the fullSetup method is used as the entry point, then the no installation is run
# but the user, sensors, and gardens are all set up.
import json, urllib2, datetime
import setupfiles.gardenSetup #garden and senor setup
import setupfiles.register #user name setup
import Adafruit_Python_DHT.ez_setup #tempSensor setup files
import Adafruit_Python_MCP3008.ez_setup #for the D to A ship for moisture sensors
import Adafruit_Python_GPIO.ez_setup


# adds sensors to the online database with the given parameters
def sendSensor(userS, passS, sName, gName):
    urlBaseS = 'http://76.94.123.147:49180/addSensor.php?user=' \
            + userS + '&password=' + passS + '&sName=' + sName.replace(" ", "%20") \
            + '&gName=' + gName.replace(" ", "%20")
    resp = urllib2.urlopen(urllib2.Request(urlBaseS));
    
    print resp.read(); # print the reponse from the PHP (should be encoded as a JSON

# writes the garen given to the online database
def makeGarden(gUser, gPass, gName, gDesc):
    urlBaseS = 'http://76.94.123.147:49180/addGarden.php?user=' \
            + gUser + '&password=' + gPass + '&gName=' + gName.replace(" ", "%20") \
            + '&gDesc=' + gDesc.replace(" ", "%20")
    resp = urllib2.urlopen(urllib2.Request(urlBaseS))
    
    print resp.read(); # return the reponse from the PHP (should be encoded as a JSON

# installs the Adafruit drivers to this machine
# if setUpCmd is anything but "False", the method also calls the fullStep() method
def installFiles(setUpCmd):
    print('installing DHT files')
    Adafruit_Python_DHT.ez_setup.main()
    print('installing MCP files')
    Adafruit_Python_MCP3008.ez_setup.main()
    print('installing GPIO files')
    Adafruit_Python_GPIO.ez_setup.main()
    
    # this is included to give the option of just running the library setups
    if setUpCmd != "False":# anything but false
        fullSetup() 

# runs all setup steps except the library files
# runs user, sensor, and garden setup
def fullSetup():
    
    stopBool = False
    # instantiate the lists that will be put into the json as values
    data = {}
    tempNames= {}
    tempChan= {}
    moistNames= {}
    moistChan={}
    moistLimit = {}
    garden ={}
    goodAnswers = ['y', 'Y', 'yes', 'Yes', 'YES']
    
    #register username and password
    user, password = setupfiles.register.register()
    data["user"] = user
    data["password"] = password
    data["updated"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    #start the garden setup
    while stopBool == False:
        # call the garden and sensor setup
        gName, tempNames, tempChan, moistNames, moistChan, moistLimit, gDesc = setupfiles.gardenSetup.makeGarden()
        
        # write the keys and values to the json
        garden[gName] = [{"TempNames" : tempNames},\
                        {"TempChan" :  tempChan},\
                        {"MoistNames" : moistNames},\
                        {"MoistChan" : moistChan},
                        {"MoistLimit" : moistLimit}]
        
        #print(garden)

        data["Gardens"] = garden
        #print(data)
        
        #send the garden to the SQL server
        if(gName != None):
            makeGarden(user, password, gName, gDesc)
        
        #if the temp sensors list isn't empty, send those to the SQL database
        if(len(tempNames) > 0):
            for x in range(0, len(tempNames)):
                sendSensor(user, password, tempNames[x], gName)
        
        #if there are moisture sensors in the list, write them to the SQL database
        if(len(moistNames) > 0):
            for x in range(0, len(moistNames)):
                sendSensor(user, password, moistNames[x], gName)
                
        # check to see if garden input loop should be broken    
        answer = raw_input("Would you like to add another Garden?\n Yes or No\t")
               
        if (answer in goodAnswers):
            print("adding another garden")
        else:
            print("ending setup, writing to config.json")
            stopBool = True
    #end while loop
    
    #write to a JSON file    
    with open("config.json", "w") as f:
        json.dump(data, f)
    
    #with open("config.json", "r") as f:
        #data = json.load(f)
    #print(data)
    answer = raw_input("would you like to schedule readings to be taken automatically?")
    if (answer in goodAnswers): 
        setupfiles.timer.scheduleJob()
        
    return data