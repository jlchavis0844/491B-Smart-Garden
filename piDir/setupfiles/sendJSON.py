'''
Created on Oct 10, 2016

@author: James
'''
import httplib
import json
import sys, os

headers = { "charset" : "utf-8", "Content-Type": "application/json" }
path = os.path.dirname(os.path.dirname(sys.argv[0]))
filename = os.path.join(path, 'config.json')
  
url = 'jchavis.hopto.org:49180'
  
conn = httplib.HTTPConnection(url)

with open(filename) as jsonData:
    data = json.load(jsonData)
#print(data)

data = json.dumps(data)
#print(data)

conn.request("POST", "/JSONread.php", data, headers)

#request = urllib2.Request(url, data, headers)
#response = urllib2.urlopen(request)

response = conn.getresponse();

print(response.read())
conn.close()