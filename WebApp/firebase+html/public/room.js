var uid = sessionStorage.getItem('uid');
var roomnum = sessionStorage.getItem('i');

var ssid = sessionStorage.getItem('ssid');
var macAdd = sessionStorage.getItem('macAdd');
console.log("ssid is " + ssid + " and macAdd is " + macAdd);
var updates = {};
var refpath = "parameters/" + uid + "/" + roomnum;
var REF = firebase.database().ref(refpath);
var params = [];
var dehum, door, fan, humid, win;
var roomname = document.getElementById("roomname");
var humPath = "ssids/" + ssid + "/" + macAdd + "/latestHumid";
var tempPath = "ssids/" + ssid + "/" + macAdd + "/latestTemp";
var humRef = firebase.database().ref(humPath);
var tempRef = firebase.database().ref(tempPath);

document.addEventListener("DOMContentLoaded", function() {
	humlisten();
	templisten();
	readRoomName();
	REF.once('value',function(snapshot) {
		params = Object.values(snapshot.val());
		console.log(params);
	});
	setTimeout(() => {
		console.log(params);
		paramSetup();
	}, 600);
});

roomname.addEventListener("input", function() {
	updates["users/" + uid + "/rooms/" + roomnum + "/roomName"] = roomname.textContent;	
	setTimeout(() => {
		return firebase.database().ref().update(updates);
	}, 200);
});

function paramSetup() {
	dehum = document.getElementById("dehumidifier");
	door = document.getElementById("door");
	fan = document.getElementById("fan");
	humid = document.getElementById("humidifier");
	win = document.getElementById("window");	
	
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

}

function updateParams() {
	console.log("in updateParams");
	
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
	
	setTimeout(() => {
		return firebase.database().ref().update(updates);
	}, 200);
}

function humlisten() {
	var x = document.getElementById("humidityRead");
	humRef.on('value', function(snapshot) {
		console.log("humidity is reading " + snapshot.val());
		x.innerText = snapshot.val();
	});
}

function templisten() {
	var y = document.getElementById("tempRead");
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
	if ( document.getElementById("mode").checked == true) {
		
		document.getElementById("navtop").style.backgroundColor = "#88db84";
		document.getElementById("footercolor").style.backgroundColor = "#88db84";
	} else {
		
		document.getElementById("navtop").style.backgroundColor = "#42c5f5";
		document.getElementById("footercolor").style.backgroundColor = "#42c5f5";
	}
	//code for residence/greenhouse
	
}