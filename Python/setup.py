import os.path #file check
import urllib2 #HTTP connections
urlBase = 'http://76.94.123.147:49180/register.php?'
goodAnswers = ['y', 'Y', 'yes', 'Yes', 'YES']

#Start the registration process
def register():
    user = raw_input('Enter the user name you want: ')
    pass1 = raw_input('Enter password: ')
    pass2 = raw_input('Enter the password again: ')
    
    if pass1 != pass2:
        print('passwords do not match, try again')
        register()
    
    urlBase = 'http://76.94.123.147:49180/register.php?user=' \
                + user + '&password=' + pass1
    resp = urllib2.urlopen(urllib2.Request(urlBase))
    
    respMsg = resp.read()
    
    if "exists" in respMsg:
        print(user + " is already taken, try another one");
        register()
    elif "registered" not in respMsg:
        print(respMsg)
        print('try again later')
        exit()
    else:
        print(respMsg)
  

if os.path.isfile("./gardenData.conf") == False:
    print("No install detected, do you want to run the setup process?")
    answer = raw_input("Enter Y to cotinue, anything else to quit\n")
    #print(answer in goodAnswers)
    if (answer in goodAnswers):
        register()
    else:
        print("Goodbye!")
        exit()
else:
    installed = True;