'''
Created on Oct 7, 2016

@author: James
Config class that reads config.json, parses the json and provides methods for
setting and getting of parsed datafields
'''
import json, sys, os

class Config:

    def __init__(self):
        self.tempNames =[]
        self.tempChan = []
        self.moistNames=[]
        self.moistChan=[]
        self.moistLimit = []
        self.listOfLists = []
        tempList = []
        print (os.path.dirname(os.path.dirname(sys.argv[0])))
        with open(os.path.dirname(os.path.dirname(sys.argv[0])) + "\\config.json", "r") as f:
            self.data = json.load(f)
            
        # read easy data
        self.user = self.data['user']
        self.passwd = self.data['password']
        self.timeStamp = self.data['updated']
        
        # print data
        gKeys =self.data['Gardens'].keys()
        for x in range(len(gKeys)):
            for y in range(len(self.data['Gardens'][gKeys[x]])):
                self.listOfLists.append(self.data['Gardens'][gKeys[x]][y]\
                                        [self.data['Gardens'][gKeys[x]][y].keys()[0]])
                
        #print(listOfLists)
        
        # save the data to lists
        for i in range(len(gKeys)):
            flexNum = i * 5
            
            tempList = self.listOfLists[flexNum+0]
            self.tempNames.append(tempList)
            
            tempList = self.listOfLists[flexNum+1]
            self.tempChan.append(tempList)
            
            tempList = self.listOfLists[flexNum+2]
            self.moistNames.append(tempList)
            
            tempList = self.listOfLists[flexNum+3]
            self.moistChan.append(tempList)
            
            tempList = self.listOfLists[flexNum+4]
            self.moistLimit.append(tempList)
            
    #         tempNames = tempNames + listOfLists[flexNum+0]
    #         tempChan = tempChan + listOfLists[flexNum+1]
    #         moistNames = moistNames + listOfLists[flexNum+2]
    #         moistChan = moistChan + listOfLists[flexNum+3]
    #         moistLimit = moistLimit + listOfLists[flexNum+4]
     
        # print(listOfLists)
        # return user, passwd, gKeys, tempNames, tempChan, moistNames, moistChan, moistLimit
        
    # return the user name
    def getUser(self):
        return self.user
    
    # return the password
    def getPassword(self):
        return self.passwd
    
    #return the update date
    def getUpdateDate(self):
        return self.timeStamp
    
    # return all the news of all the gardens
    def getGardenNames(self):
        return self.data['Gardens'].keys()
    
    # return the temp sensor names of the given Garden
    # the garden number corresponds to the garden name list returned by getGardenNames()
    def getTempNames(self, x):
        names = self.tempNames[x]
        return names

    # return the temp sensor channel of the given Garden
    # the garden number corresponds to the garden name list returned by getGardenNames()
    def getTempChan(self, x):
        return self.tempChan[x]
    
    # return the moisture sensor names of the given Garden
    # the garden number corresponds to the garden name list returned by getGardenNames()
    def getMoistNames(self, x):
        return self.moistNames[x]

    # return the moisture sensor channel of the given Garden
    # the garden number corresponds to the garden name list returned by getGardenNames()
    def getMoistChan(self, x):
        return self.moistChan[x]
    
    # return the moisture sensor limit of the given Garden
    # the garden number corresponds to the garden name list returned by getGardenNames()
    def getMoistLimit(self, x):
        return self.moistLimit[x]
    
    # saves the current data as the config.json
    def save(self):
        with open(os.path.dirname(os.path.dirname(sys.argv[0])) + "\\config.json", "w") as f:
            json.dump(self.data, f)
            
    # set and save the new user name
    def setUser(self, val):
        self.data['user'] = val
        self.user = val
        self.save()
    
    # set and save the new password
    def setPassword(self, val):
        self.data['password'] = val
        self.password = val
        self.save()
        
    # set and save the new time stamp
    def setUpdatedDate(self, val):
        self.data['updated'] = val
        self.timeStamp = val
        self.save()
        
    # Sets the config values of the garden given to the values passed
    # changes made here are automatically saved to the config.json
    # x = garden index returned in getGardenNames, starts at 0
    # val = the list of the new vales, must be in a list for
    def setTempNames(self, x, val):
        gKeys = self.getGardenNames()
        # self.data['Gardens'][gKeys[x]][0]['TempNames']
        #  "     "        "       "  ...[1]['TempChan'] and so on
        self.data['Gardens'][gKeys[x]][0]['TempNames'] = val
        self.tempNames[x] = val
        self.save()

    # Sets the config values of the garden given to the values passed
    # changes made here are automatically saved to the config.json
    # x = garden index returned in getGardenNames, starts at 0
    # val = the list of the new vales, must be in a list for
    def setTempChan(self, x, val):
        gKeys = self.getGardenNames()
        self.data['Gardens'][gKeys[x]][1]['TempChan'] = val
        self.tempChan[x] = val
        self.save()
        
    # Sets the config values of the garden given to the values passed
    # changes made here are automatically saved to the config.json
    # x = garden index returned in getGardenNames, starts at 0
    # val = the list of the new vales, must be in a list for
    def setMoistNames(self, x, val):
        gKeys = self.getGardenNames()
        self.data['Gardens'][gKeys[x]][2]['MoistNames'] = val
        self.moistNames[x] = val
        self.save()

    # Sets the config values of the garden given to the values passed
    # changes made here are automatically saved to the config.json
    # x = garden index returned in getGardenNames, starts at 0
    # val = the list of the new vales, must be in a list for
    def setMoistChan(self, x, val):
        gKeys = self.getGardenNames()
        self.data['Gardens'][gKeys[x]][3]['MoistChan'] = val
        self.moistChan[x] = val
        self.save()
        
    # Sets the config values of the garden given to the values passed
    # changes made here are automatically saved to the config.json
    # x = garden index returned in getGardenNames, starts at 0
    # val = the list of the new vales, must be in a list for        
    def setMoistLimit(self, x, val):
        gKeys = self.getGardenNames()
        self.data['Gardens'][gKeys[x]][4]['MoistLimit'] = val
        self.moistLimit[x] = val
        self.save()
        
    #returns JSON as a dict
    def getJSON(self):
        return self.data
    
    #returns JSON as a string
    def getJSONString(self):
        return json.dumps(self.data)
