# github
https://github.com/greg300/team9/

# team9
Software Engineering Team 9

Our project is a Web App, it is hosted live online through Google Firebase at https://humidibot-8a6ff.firebaseapp.com/ .
However this project (if it were a product), would need to be sold as a hardware package. For the purposes of this project,
the hardware had the network SSID and password hardcoded. So the hardware would need to be modified in a way that would allow
the user to input credentials for their own network.

For now, since it is live, you can log into the website with these credentials to see the latest readings from my (Alex's)
network. I have 2 sensors running simultaneously, however these may be disconnected in the future.

email: malynovskyalex@gmail.com
password: password

From here, you can visualize the latest readings (if they are not live) and access each room and modify their names or
parameters if you wish. Unfortunately, there is little to be done about witnessing a change in the course of action unless I
feed different input to a connected sensor. A secure connection between the module and the readings is evident this way, 
since all course of actions are calculated client-side for security as well as performance.

However, a video was linked through email showcasing the algorithm in effect. Here is the link again:
https://streamable.com/c99d8d

Starting from /root/, ESP8266connect contains the code that is uploaded to every wifi module in order for it to connect to
the hardcoded network as well as our Firebase database. The libraries are also included that are necessary to run the code.

the Web App source files are entirely contained within WebApp/firebase+html/public

The Html files correspond to the html pages loaded upon accessing the deployed website. The first html file loaded is
index.html which is the login page. There is also a register page html file, a dashboard page html file, and a roomview
html file.

The Js files correspond to the javascript that really makes our WebApp function. A lot of the code involved uses functions
from Firebase in order to interact with their authentication and database features.

Bootstrap related files are contained in /vendor/ as well as gulpfile.js. These bootstrap libraries provided us a lot of
the CSS that went into creating mainly the dashboard and roomview pages. The css for the login and register pages were 
done without bootstrap in /css/

/imgs/ contains the logo of Humidibot as well as another image used for refreshing the plan of action.

favicon.ico is just an icon version of the Humidibot logo which appears to the tab name.

