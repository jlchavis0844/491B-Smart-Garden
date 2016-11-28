'''
Created on Oct 10, 2016

@author: James
'''
import httplib
import json
import sys, os

def sendFile():
    path = ""
    if(os.path.isfile("./config.json") == True):
        path = "./config.json"
    elif(os.path.isfile("config.json") == True):
        path = "config.json"
    else:
        print("could not find config.json")
        exit()
    headers = { "charset" : "utf-8", "Content-Type": "application/json" }
    #path = os.path.dirname(os.path.dirname(sys.argv[0]))
    #filename = os.path.join(path, 'config.json')
    
    url = 'jchavis.hopto.org:49180'
      
    conn = httplib.HTTPConnection(url)
    
    with open(path) as jsonData:
        data = json.load(jsonData)
    #print(data)
    
    data = json.dumps(data)
    #print(data)
    
    conn.request("POST", "/JSONread.php", data, headers)
    
    #request = urllib2.Request(url, data, headers)
    #response = urllib2.urlopen(request)
    
    response = conn.getresponse();
    
    #print(response.read())
    response = conn.getresponse()
    respJson = json.load(response)
    if respJson['status'] != "200 OK":
        print(" " + respJson['error'])
    
    conn.close()
    
def sendJSON(data):
    headers = { "charset" : "utf-8", "Content-Type": "application/json" }
    url = 'jchavis.hopto.org:49180'
    conn = httplib.HTTPConnection(url)
    data = json.dumps(data)
    conn.request("POST", "/JSONread.php", data, headers)
    response = conn.getresponse();
    #print(response.read())
    json_data = json.loads(response.read())
    return json_data['status'] == "200 OK"
    conn.close()
    
#sendFile()