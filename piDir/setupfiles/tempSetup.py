#this file will take input from the user to get sensor names and channels
#this will return two lists, the temp sensor name list and the channel list
#return sensorName list then sesorChan list
stopBool = False
sensorNames = []
sensorChan = []

def tempSetup():
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