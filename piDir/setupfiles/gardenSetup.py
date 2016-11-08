#this file will take input from the user to get sensor names and channels
#this will return two lists, the moisture sensor name list and the channel list
#return sensorName list then sesorChan list
import json, urllib2, datetime
import setupfiles

GardenName = ""

# writes the garen given to the online database
def sendGarden(gUser, gPass, gName, gDesc):
    urlBaseS = 'http://76.94.123.147:49180/addGarden.php?user=' \
            + gUser + '&password=' + gPass + '&gName=' + gName.replace(" ", "%20") \
            + '&gDesc=' + gDesc.replace(" ", "%20")
    resp = urllib2.urlopen(urllib2.Request(urlBaseS))
    
    print resp.read(); # return the reponse from the PHP (should be encoded as a JSON


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
            moistChan.append(tempVal)
            print('The limit is the value at which water should be released')
            limit = raw_input('Enter the limit (0 - 1024 such that 0 is no moisture, 1024 is water)')
            moistLimit.append(limit)
    #end while loop
    return moistNames, moistChan, moistLimit


# setup the temp sensors for this garden
def tempSetup():
    #make lists for the temp sensor values
    tempNames = []
    tempChan = []
    stopBool = False
    #make temps sensors until exit is entered in the sensor name
    while stopBool == False:    
        tempVal = raw_input('enter the sensor name, \'exit\' to quit\n')
        if tempVal == 'exit':
            print('exiting sensor input\n')
            stopBool = True;
        else:
            tempNames.append(tempVal)
            tempVal = raw_input('Enter the channel ' + tempVal + ' is on\n')
            tempChan.append(tempVal)
    #end while loop
    return tempNames, tempChan

#runs the garden setup methods, this should be the entry point for this class
def makeGarden():
    GardenName = raw_input('Enter the name for this garden\n')
    gDesc = raw_input('Enter a description for this garden\n')
    print('Please enter information for the temp sensors\n')
    tempName, tempChan = tempSetup()
    print('Please enter information for the moisture sensors\n')
    moistNames, moistChan, moistLimit = moistSetup()
    return GardenName, tempName, tempChan, moistNames, moistChan, moistLimit, gDesc

def addGarden():
    data = {}
    tempNames= {}
    tempChan= {}
    moistNames= {}
    moistChan={}
    moistLimit = {}
    garden ={}
    gName, tempNames, tempChan, moistNames, moistChan, moistLimit, gDesc = makeGarden()
    
    with open("config.json", "r") as f:
        data = json.load(f)
    
    user = data["user"]
    password = data["password"]
    data["updated"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    garden = data["Gardens"]
    
    # write the keys and values to the json
    garden[gName] = [{"TempNames" : tempNames},\
                    {"TempChan" :  tempChan},\
                    {"MoistNames" : moistNames},\
                    {"MoistChan" : moistChan},\
                    {"MoistLimit" : moistLimit}]
    data["Gardens"] = garden
    sendGarden(user, password, gName, gDesc)
    
    #send the garden to the SQL server
    if(gName != None):
        makeGarden(user, password, gName, gDesc)
        
    #if the temp sensors list isn't empty, send those to the SQL database
    if(len(tempNames) > 0):
        for x in range(0, len(tempNames)):
            setupfiles.fullSetup.sendSensor(user, password, tempNames[x], gName)
        
    #if there are moisture sensors in the list, write them to the SQL database
    if(len(moistNames) > 0):
        for x in range(0, len(moistNames)):
            setupfiles.fullSetup.sendSensor(user, password, moistNames[x], gName)
            
    #write to a JSON file    
    with open("config.json", "w") as f:
        json.dump(data, f)
    
#addGarden()
    