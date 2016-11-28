# this file will take input from the user to get sensor names and channels
# this will return two lists, the moisture sensor name list and the channel list
# return sensorName list then sesorChan list
import json, urllib2, datetime, httplib
import setupfiles
from setupfiles.sendJSON import sendJSON

GardenName = ""

def valid_input(answer, limit):
    if(is_number(answer) == False):
        return False
    elif(int(answer) < 0 or int(answer) > limit):
        return False
    else:
        return True
        

# check if input is a number
def is_number(s):
    try:
        int(s)
        return True
    except ValueError:
        return False

# writes the garden given to the online database
def sendGarden(gUser, gPass, gName, gDesc):
    urlBaseS = 'http://76.94.123.147:49180/addGarden.php?user=' \
            + gUser + '&password=' + gPass + '&gName=' + gName.replace(" ", "%20") \
            + '&gDesc=' + gDesc.replace(" ", "%20")
    resp = urllib2.urlopen(urllib2.Request(urlBaseS))
    
    print resp.read();  # return the response from the PHP (should be encoded as a JSON

    # this functyion will open config, walkthrough adding a sensor to a garden and then send the new config and SQL the sensor
def addNewSensor(type):
    # open the config and load as a json
    with open("config.json", "r") as f:
        data = json.load(f)

    # set current garden by asking user
    garden = data["Gardens"]
    print("which garden would you like to add a sensor to?\n")
    gKeys = garden.keys()
    keyNum = len(gKeys)
    for x in range(len(gKeys)):
        print(str(x) + "- " + gKeys[x])
        
    # should be 0 - len(gKeys)
    print('please enter the number of the garden you want\n')  
    answer = raw_input('>>> ')
    # check for invalid input
    while(valid_input(answer, keyNum) == False):  # if input is not valid
        print('invalid input, please enter the number of the garden you want\n')
        answer = raw_input('>>> ')  # get input again
        
    choice = gKeys[int(answer)]  # choice is the name of the garden we ar working with
    garden = data['Gardens'][choice]  # load garden as a list
    
    if(type == "moist"):  # if the setup if for a moisture sensor
        names = garden['MoistNames']
        chans = garden['MoistChan']  # if for a temp sensor
        names = garden['TempNames']
        chans = garden['TempChan']
    
    # get the sensor name
    print('please enter the name of the sensor\n')  
    sName = raw_input('>>> ')
    names.append(sName)
    
    # get the sensor channel
    print('please enter the channel of the sensor\n')  
    sChan = raw_input('>>> ')
        
    while(valid_input(sChan, 99) == False):
        print('invalid input, please enter the number of the channel\n')
        sChan = raw_input('>>> ')
    
    chans.append(sChan)
    
    # if this is a moisture sensor, get limit
    if(type == "moist"):
        limit = garden['MoistLimit']
        print('please enter the limit of the sensor\n')  
        mLimit = raw_input('>>> ')
        
        while(valid_input(mLimit, 1023) == False):
            print('invalid input, please enter the limit of the sensor\n')
            mLimit = raw_input('>>> ')
        
        limit.append(mLimit)
        garden['MoistLimit'] = limit
        garden['MoistNames'] = names
        garden['MoistChan'] = chans
    else:
        garden['TempNames'] = names
        garden['TempChan'] = chans
    
    data['Gardens'][choice] = garden
    
    with open("config.json", "w") as f:
        json.dump(data, f)
    
    if(sendJSON(data)):
        print('sending json worked')
    else:
        print('sending json failed')
        
    setupfiles.fullSetup.sendSensor(data['user'], data['password'], sName, choice)
    print("done with adding the sensor")
    
# set the moisture sensors for this garden
def moistSetup():
    # instantiate the lists to hold the moisture sensor values
    moistNames = []
    moistChan = []
    moistLimit = []
    stopBool = False
    
    # add information to the moisture sensors lists if the loop is not set to be broken
    while stopBool == False:    
        tempVal = raw_input('enter the sensor name, \'exit\' to quit\n')
        # if the user enters 'next' as the sensor name, quit
        if tempVal == 'exit':
            print('exiting sensor input\n')
            stopBool = True;
        else:
            moistNames.append(tempVal)
            tempVal = raw_input('Enter the channel ' + tempVal + ' is on\n')
            while(is_number(tempVal) == False):
                tempVal = raw_input('Please use a number for the channel ' + tempVal + ' is on\n')

            moistChan.append(tempVal)
            print('The limit is the value at which water should be released')
            limit = raw_input('Enter the limit (0 - 1023 such that 0 is no moisture, 1023 is water)')

            while(is_number(limit) == False):
                limit = raw_input('Limit must be a number between 0 - 1023')

            moistLimit.append(limit)
    # end while loop
    return moistNames, moistChan, moistLimit

# setup the temp sensors for this garden
def tempSetup():
    # make lists for the temp sensor values
    tempNames = []
    tempChan = []
    stopBool = False
    # make temps sensors until exit is entered in the sensor name
    while stopBool == False:    
        tempVal = raw_input('enter the sensor name, \'exit\' to quit\n')
        if tempVal == 'exit':
            print('exiting sensor input\n')
            stopBool = True;
        else:
            tempNames.append(tempVal)
            tempVal = raw_input('Enter the channel number' + tempVal + ' is on\n')

            while(is_number(tempVal) == False):
                tempVal = raw_input('Not a number, enter the channel ' + tempVal + ' is on\n')

            tempChan.append(tempVal)
    # end while loop
    return tempNames, tempChan

# runs the garden setup methods, this should be the entry point for this class
def makeGarden():
    GardenName = raw_input('Enter the name for this garden\n')
    gDesc = raw_input('Enter a description for this garden\n')
    print('Please enter information for the temp sensors\n')
    tempName, tempChan = tempSetup()
    print('Please enter information for the moisture sensors\n')
    moistNames, moistChan, moistLimit = moistSetup()
    return GardenName, tempName, tempChan, moistNames, moistChan, moistLimit, gDesc

def removeGarden():
    with open("config.json", "r") as f:
        data = json.load(f)

    garden = data["Gardens"]
    print("which garden would you like to remove?\n")
    gKeys = garden.keys()
    keyNum = len(gKeys)
    for x in range(len(gKeys)):
        print(str(x) + "- " + gKeys[x])
    
    print('please enter the number of the garden you want\n')  
    answer = raw_input('>>> ')
    
    while(valid_input(answer, keyNum) == False):
        print('invalid input, please enter the number of the garden you want\n')
        answer = raw_input('>>> ')
    
    choice = gKeys[int(answer)]
    print("Removing " + choice)
    data['Gardens'].pop(choice)
    data["updated"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    with open("config.json", "w") as f:
        json.dump(data, f)
        
    if(sendJSON(data)):
        print('sending json worked')
    else:
        print('sending json failed')
        
    urlBaseS = 'http://jchavis.hopto.org:49180/deleteGarden.php?user=' \
            + data["user"] + '&password=' + data["password"] + '&gardenName=' + choice
    resp = urllib2.urlopen(urllib2.Request(urlBaseS))
    response = json.load(resp)
    return response['status'] != "ERROR"
    
# This method is used to add a garden to an existing method
def addGarden():
    # Make empty JSON objects to hold values
    data = {}
    tempNames = {}
    tempChan = {}
    moistNames = {}
    moistChan = {}
    moistLimit = {}
    garden = {}

    # calls the garden setup method to get values
    gName, tempNames, tempChan, moistNames, moistChan, moistLimit, gDesc = makeGarden()
    
    # open the config to read in the file
    with open("config.json", "r") as f:
        data = json.load(f)
    
    # get information with the 
    user = data["user"]
    password = data["password"]
    data["updated"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    garden = data["Gardens"]
    
    # write the keys and values to the json
    garden[gName] = [{"TempNames" : tempNames}, \
                    {"TempChan" :  tempChan}, \
                    {"MoistNames" : moistNames}, \
                    {"MoistChan" : moistChan}, \
                    {"MoistLimit" : moistLimit}]
    data["Gardens"] = garden
    sendGarden(user, password, gName, gDesc)
    
    # send the garden to the SQL server
    if(gName != None):
        makeGarden(user, password, gName, gDesc)
        
    # if the temp sensors list isn't empty, send those to the SQL database
    if(len(tempNames) > 0):
        for x in range(0, len(tempNames)):
            setupfiles.fullSetup.sendSensor(user, password, tempNames[x], gName)
        
    # if there are moisture sensors in the list, write them to the SQL database
    if(len(moistNames) > 0):
        for x in range(0, len(moistNames)):
            setupfiles.fullSetup.sendSensor(user, password, moistNames[x], gName)
            
    # write to a JSON file    
    with open("config.json", "w") as f:
        json.dump(data, f)
    
# addGarden()
# removeGarden()
