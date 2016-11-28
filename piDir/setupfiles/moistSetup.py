import json, urllib2, datetime
import setupfiles


#this file will take input from the user to get sensor names and channels
#this will return two lists, the moisture sensor name list and the channel list
#return sensorName list then sesorChan list
stopBool = False
sensorNames = []
sensorChan = []

# writes the garden given to the online database
def sendDelete(gUser, gPass,sName):
    urlBaseS = 'http://jchavis.hopto.org:49180/deleteSensor.php?user=' \
            + gUser + '&password=' + gPass + '&sensorName=' + sName.replace(" ", "%20") 
    resp = urllib2.urlopen(urllib2.Request(urlBaseS))
    result = resp.read()
    print  result # return the response from the PHP (should be encoded as a JSON)
    return json.loads(result)

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
    
def moistSetup():
    while stopBool == False:    
        tempVal = raw_input('enter the sensor name, \'exit\' to quit')
        if tempVal == 'exit':
            print('exiting sensor input')
            return sensorNames, sensorChan
    
        sensorNames.append(tempVal)
        
        tempVal = raw_input('Enter the channel ' + tempVal + ' is on')
        sensorChan.append(tempVal)
    #end while loop

    return sensorNames, sensorChan

def removeSensor():
    with open("config.json", "r") as f:
        data = json.load(f)

    garden = data["Gardens"]
    print("which garden does the sensor belong to?\n")
    gKeys = garden.keys()
    keyNum = len(gKeys)
    for x in range(len(gKeys)):
        print(str(x) + " - " + gKeys[x])
        for y in range(len(garden[gKeys[x]][2]['MoistNames'])):
            print('\t' + garden[gKeys[x]][2]['MoistNames'][y])
    
    answer = raw_input('>>> ')
    while(valid_input(answer, keyNum-1) == False):
        answer = raw_input("Please enter a valid number between 0 and " + str(keyNum - 1) + '\n')
        
    sensors = garden[gKeys[int(answer)]][2]['MoistNames']
    chans = garden[gKeys[int(answer)]][3]['MoistChan']
    limits = garden[gKeys[int(answer)]][4]['MoistLimit']
    gName = gKeys[int(answer)]
    for x in range(len(sensors)):
        print(str(x) + " - " + sensors[x])
    answer = -1
    while(valid_input(answer, len(sensors) -1) == False):
        answer = raw_input("Please choose and enter the number of the sensor you would like to remove\n")
        
    sName = sensors[int(answer)]
    sensors.pop(int(answer))
    chans.pop(int(answer))
    limits.pop(int(answer))
    
    garden[gName][2]['MoistNames'] = sensors
    garden[gName][3]['MoistChan'] = chans
    garden[gName][4]['MoistLimit'] = limits

    data['Gardens'] = garden
    data["updated"] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    result = sendDelete(data['user'], data['password'], sName)
    if(result['status'] == 'ERROR'):
        print('No record was deleted, try deleting garden')
        print('no changes have been saved')
        return
    
    with open("config.json", "w") as f:
        json.dump(data, f)
    
#sendDelete('todd', 'password', 'moist1')
#removeSensor()