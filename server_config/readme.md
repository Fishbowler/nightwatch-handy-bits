#Grid Configuration

Whilst not technically Nightwatch, this is a common use case, and examples on the Internet are scarce. This worked for us.

##Hub:

java -jar selenium-server-standalone-3.4.0.jar -role hub -hubConfig hubConfig.json

##Node:

java -jar selenium-server-standalone-3.4.0.jar -role node -nodeConfig nodeConfig-windows.json

##Windows services:

* Install with [nssm](http://nssm.cc/)
* Use absolute paths

Hub: `nssm install SeleniumHub java -jar "C:\Selenium\selenium-server-standalone-3.4.0.jar" -role hub -hubConfig "C:\Selenium\hubConfig.json"`

Node: `nssm install SeleniumNode java -jar "C:\Selenium\selenium-server-standalone-3.4.0.jar" -role node -nodeConfig "C:\Selenium\nodeConfig-windows.json"`
