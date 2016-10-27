'''
Created on Oct 10, 2016

@author: James
'''
# call register() function which will continue to run until registration works.
import urllib2 #HTTP connections
goodReg = False;
user = '';
pass1 = '';
pass2 = ''

#User = userName, pass1 and pass2 should be the same
#This function returns true if registration succeeds, false otherwise.
def sendReg(user, pass1, pass2):
    urlBase = 'http://76.94.123.147:49180/register.php?user=' \
                + user + '&password=' + pass1
    resp = urllib2.urlopen(urllib2.Request(urlBase));
    
    respMsg = resp.read();

    if "exists" in respMsg:#if the user name already exists
        print(user + " is already taken, try another one");
        return False # Failure condition
    #if the username doesn't exists but you also can't register
    elif "registered" not in respMsg:
        print(respMsg);
        print('try again later');
        exit();
    else:
        print(respMsg);
        return True;
    #end send reg functions

def passcheck(pass1, pass2):
    return pass1 == pass2;
    #end passcheck function

#Start the registration process
def register():
    #get the user name and passwords
    user = raw_input('Enter the user name you want, \'exit\' to quit: ')
    if user == 'exit':
        print('quiting registration')
        return None, None
    
    pass1 = raw_input('Enter password: ')
    pass2 = raw_input('Enter the password again: ')
    
    #loop on password check until they match then move on
    while passcheck(pass1, pass2) == False:
        print('passwords don\'t match, try again')
        pass1 = raw_input('Enter password: ')
        pass2 = raw_input('Enter the password again: ')

    #try to register user
    while sendReg(user, pass1, pass2) == False:#Run until registration works
        #At this point, the registration failed
        #get the username and password again
        user = raw_input('Enter the user name you want, \'exit\' to quit: ')
        if user == 'exit':
            print('quiting registration')
            return None, None;
        
        pass1 = raw_input('Enter password: ')
        pass2 = raw_input('Enter the password again: ')
        
        #check the passwords, again
        while passcheck(pass1, pass2) == False:#run until passwords match
            print('passwords don\'t match, try again')
            pass1 = raw_input('Enter password: ')
            pass2 = raw_input('Enter the password again: ')

    return user, pass1
#end register path