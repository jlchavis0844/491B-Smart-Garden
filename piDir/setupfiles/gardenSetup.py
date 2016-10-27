#this file will take input from the user to get sensor names and channels
#this will return two lists, the moisture sensor name list and the channel list
#return sensorName list then sesorChan list

GardenName = ""

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

#print(makeGarden())
    