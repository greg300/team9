//written by: Alex Malynovsky
//tested by: Nathaniel Glikman
//debugged by: Gregory Giovannini

var uid = sessionStorage.getItem('uid');
var roomnum = sessionStorage.getItem('i');

var ssid = sessionStorage.getItem('ssid');
var macAdd = sessionStorage.getItem('macAdd');
console.log("ssid is " + ssid + " and macAdd is " + macAdd);
var updates = {};
var refpath = "parameters/" + uid + "/" + roomnum;
var REF = firebase.database().ref(refpath);
var params = [];
var	dehum = document.getElementById("dehumidifier");
var	door = document.getElementById("door");
var	fan = document.getElementById("fan");
var	humid = document.getElementById("humidifier");
var	win = document.getElementById("window");	
var roomname = document.getElementById("roomname");
var humPath = "ssids/" + ssid + "/" + macAdd + "/latestHumid";
var tempPath = "ssids/" + ssid + "/" + macAdd + "/latestTemp";
var humRef = firebase.database().ref(humPath);
var tempRef = firebase.database().ref(tempPath);
var x = document.getElementById("humidityRead");
var y = document.getElementById("tempRead");

//on document load listener
document.addEventListener("DOMContentLoaded", function() {
	humlisten();
	templisten();
	readRoomName();
	REF.once('value',function(snapshot) {
		params = Object.values(snapshot.val());
	});
	setTimeout(() => {
		paramSetup();
	}, 600);
});

//event listener for room name change
roomname.addEventListener("input", function() {
	updates["users/" + uid + "/rooms/" + roomnum + "/roomName"] = roomname.textContent;	
	setTimeout(() => {
		return firebase.database().ref().update(updates);
	}, 200);
});

//first time parameter synch
function paramSetup() {
	if (params[0] == true) {
		dehum.setAttribute("checked","true");
		dehum.checked = true;
	}
	if (params[1] == true) {
		door.setAttribute("checked","true");
		door.checked = true;
	}
	if (params[2] == true) {
		fan.setAttribute("checked","true");
		fan.checked = true;
	}
	if (params[3] == true) {
		humid.setAttribute("checked","true");
		humid.checked = true;
	}
	if (params[4] == true) {
		win.setAttribute("checked","true");
		win.checked = true;
	}
	
	var arr = params;
	var mode = document.getElementById("mode");
	if ( mode.checked == true ) {
		plantcourseChange(params);
	} else {
		courseChange(params);
	}

}

//function for updating new params and synchronizing with db
function updateParams() {
	dehum = document.getElementById("dehumidifier").checked;
	door = document.getElementById("door").checked;
	fan = document.getElementById("fan").checked;
	humid = document.getElementById("humidifier").checked;
	win = document.getElementById("window").checked;	

	updates[refpath + "/dehumidifier"] = dehum;
	updates[refpath + "/door"] = door;
	updates[refpath + "/fan"] = fan;
	updates[refpath + "/humidifier"] = humid;
	updates[refpath + "/window"] = win;
	
	var arr = [dehum, door, fan, humid, win];
	var mode = document.getElementById("mode");
	if ( mode.checked == true ) {
		plantcourseChange(arr);
	} else {
		courseChange(arr);
	}
	setTimeout(() => {
		return firebase.database().ref().update(updates);
	}, 200);
}

//Algorithm Layer (Not Fully implemented - Fully documented within /Research/)

//Algorithm Layer - Greenhouse
function plantcourseChange(arr) {
	//0 is dehum, 1 is door, 2 is fan, 3 is humid, 4 is win
	//x.innerText is humidity y.innerText is temperature
	//course is course-of-action text
	var recarr = arr;
	
	console.log("in plant course change with arr = " + arr);
	var dehum = recarr[0];
	var door = recarr[1];
	var fan = recarr[2];
	var humid = recarr[3];
	var win = recarr[4];
	var course = document.getElementById("course")
	var humidity = x.innerText;
	var temperature = y.innerText;
	console.log("course is set to " + course + " and humidity is " + humidity + " and temperature is " + temperature);
	
	//Cases
	//Case 1 Temp < 60 Humidity < 35
	if ( humidity < 50 )
	{
		if ( temperature <= 60 ) {
			//Dry and Cold
		} else if ( temperature > 60 && temperature <= 75 ) {
			console.log("in expected cat");
			course.innerHTML = "The environment is too dry for your plants."
			if (dehum == true)
				course.innerHTML += " Turn off your dehumidifier if it's on.";
			if (win == true)
				course.innerHTML += " Close a window.";
			if (fan == true)
				course.innerHTML += " You can also try turning off any fans.";
			else if (door == true)
				course.innerHTML += " You can also close any doors.";
		} else if ( temperature > 75 ) {
			//Dry and Hot
		}
	}
	else if ( humidity >= 50 && humidity < 70)
	{ //Humidity is Fine
		if ( temperature <= 60 ) {
			//Cold
		} else if ( temperature > 60 && temperature <= 75 ) {
			//Perfect
			course.innerHTML = "All temperatures are in desired ranges."
		} else if ( temperature > 75 ) {
			//Hot
		}
	}
	else if ( humidity >= 70 )
	{
		if ( temperature <= 60 ) {
			//Moist and Cold
		} else if ( temperature > 60 && temperature <= 75 ) {
			//Moist and temp fine
			course.innerHTML = "The environment is too humid."
			if (dehum == true)
				course.innerHTML += " Turn on your dehumidifier.";
			if (win == true)
				course.innerHTML += " Open your window.";
			if (fan == true)
				course.innerHTML += " You can also turn on your fan.";
			else if (door == true)
				course.innerHTML += " You can also open your door.";
		} else if ( temperature > 75 ) {
			//Moist and Hot
		}
	}
}

//Algorithm Layer - Residence
function courseChange(arr) {
	//0 is dehum, 1 is door, 2 is fan, 3 is humid, 4 is win
	//x.innerText is humidity y.innerText is temperature
	//course is course-of-action text
	var recarr = arr;
	
	
	console.log("in course change with arr = " + arr);
	var dehum = recarr[0];
	var door = recarr[1];
	var fan = recarr[2];
	var humid = recarr[3];
	var win = recarr[4];
	var course = document.getElementById("course")
	var humidity = x.innerText;
	var temperature = y.innerText;
	console.log("course is set to " + course + " and humidity is " + humidity + " and temperature is " + temperature);
	
	//Cases
	//Case 1 Temp < 60 Humidity < 35
	if ( humidity < 30 )
	{
		if ( temperature <= 60 ) {
			//Dry and Cold
		} else if ( temperature > 60 && temperature <= 75 ) {
			//Dry and temp Fine
		} else if ( temperature > 75 ) {
			//Dry and Hot
		}
	}
	else if ( humidity >= 30 && humidity < 50)
	{ //Humidity is Fine
		if ( temperature <= 60 ) {
			//Cold
		} else if ( temperature > 60 && temperature <= 75 ) {
			//Perfect
			course.innerHTML = "All temperatures are in desired ranges."
		} else if ( temperature > 75 ) {
			//Hot
		}
	}
	else if ( humidity >= 50 )
	{
		if ( temperature <= 60 ) {
			//Moist and Cold
		} else if ( temperature > 60 && temperature <= 75 ) {
			//Moist and temp fine
			course.innerHTML = "The environment is too humid."
			if (dehum == true)
				course.innerHTML += " Turn on your dehumidifier.";
			if (win == true)
				course.innerHTML += " Or open your window.";
			if (fan == true)
				course.innerHTML += " You can also turn on your fan.";
			else if (door == true)
				course.innerHTML += " You can also open your door.";
		} else if ( temperature > 75 ) {
			//Moist and Hot
		}
	}
	
}

//Auxiliary functions and listeners

function humlisten() {
	
	humRef.on('value', function(snapshot) {
		console.log("humidity is reading " + snapshot.val());
		x.innerText = snapshot.val();
	});
}

function templisten() {
	
	tempRef.on('value', function(snapshot) {
		y.innerText = snapshot.val();
	});
}

function readRoomName() {
	let z = document.getElementById("roomname");
	let roomnameRef = firebase.database().ref("users/" + uid + "/rooms/" + roomnum + "/roomName");
	roomnameRef.once('value',function(snapshot) {
		z.innerText = snapshot.val();
	});	
}

function toggleMode() {
	updateParams();
	if ( document.getElementById("mode").checked == true) {
		
		document.getElementById("navtop").style.backgroundColor = "#88db84";
		document.getElementById("footercolor").style.backgroundColor = "#88db84";
	} else {
		
		document.getElementById("navtop").style.backgroundColor = "#42c5f5";
		document.getElementById("footercolor").style.backgroundColor = "#42c5f5";
	}	
}