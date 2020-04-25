var ssid = 0;
var macAdd = 0;
var updates = {};

//this function should reconnect new SSID and potentially populate new roomCount
function passSSID() {
	var x = document.getElementById("SSID").value;
	var user = firebase.auth().currentUser;
	if (user) {
		var uid = user.uid;
		var ssidPath = "users/" + uid;
		updates[ssidPath + '/SSID'] = x;
		//ssid has been passed to account db info
		//now to match to ssids/ and retrieve sensorNum so as to update roomCount
		var sensorNumRef = firebase.database().ref("ssids/" + x + "/sensorNum");
		sensorNumRef.once('value',function(snapshot) {
			if (snapshot.val() == null)
				alert("Invalid SSID");
			else {
				alert("Rooms Created");
				updates[ssidPath + '/roomCount'] = snapshot.val();
				//htmlnodePopulate(snapshot.val());
				//^^ this is the function that needs to be worked on
				//probably need to set a small timeout for below function after nodes are populated
				updateAccount(x, uid);
				
			}
		});
	} else {
		console.log("null user");
	}
	setTimeout(() => {
		return firebase.database().ref().update(updates);
	}, 200);
}

//updates roomMacAddresses
function updateAccount(ssid, uid) {
	console.log("starting updateAccount");
	var count = 0;
	var arr = [];
	var macAddRef = firebase.database().ref("ssids/" + ssid);
	macAddRef.once('value',function(snapshot) {
		arr = Object.keys(snapshot.val());	
		arr.pop();
	});
	setTimeout(() => {
		var x,y;
		while (count < arr.length) {
			console.log("inside for loop with count = " + count);
			console.log("arr[count] is " + arr[count]);
			var idnum = count + 1;
			var humstring = "hum" + idnum;
			var tempstring = "temp" + idnum;
			//listeners
			var humPath = "ssids/" + ssid + "/" + arr[count] + "/latestHumid";
			var tempPath = "ssids/" + ssid + "/" + arr[count] + "/latestTemp";
			var humRef = firebase.database().ref(humPath);
			var tempRef = firebase.database().ref(tempPath);
			humlisten(humstring, humRef, uid, count);
			templisten(tempstring, tempRef, uid, count);
			updates["users/" + uid + "/rooms/" + count + "/macAddress"] = arr[count];
			count++;
		}
		console.log("leaving updateAccount");
		return firebase.database().ref().update(updates);
	},50);	
}

function humlisten(humstring, humRef, uid, count) {
	var x;
	humRef.on('value', function(snapshot) {
		console.log("humsnapshot.val is " + snapshot.val());
		updates["users/" + uid + "/rooms/" + count + "/latestHumid"] = snapshot.val();
		x = document.getElementById(humstring);
		x.innerText = snapshot.val();
		return firebase.database().ref().update(updates);
	});
}

function templisten(tempstring, tempRef, uid, count) {
	var y;
	tempRef.on('value', function(snapshot) {
		console.log("tempsnapshot.val is " + snapshot.val());
		updates["users/" + uid + "/rooms/" + count + "/latestTemp"] = snapshot.val();
		y = document.getElementById(tempstring);
		y.innerText = snapshot.val();
		return firebase.database().ref().update(updates);
	});
}

function htmlnodePopulate(roomCount) {
	
	
}

function readSSID(ssidRef) {
	ssidRef.once('value',function(snapshot) {
		return snapshot.val();
	});
}

function readmacAdd(macAddRef) {
	macAddRef.once('value',function(snapshot) {
		return snapshot.val();
	});	
}


//this should be for setup when user first logs in
//populate roomcount and connect already present SSID to rooms
//the user should turn on their devices in the order they want them to appear for first time setup
//then they can rename them
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
	var uid = user.uid;
	var roomCount = firebase.database().ref("users/" + uid + "/roomCount");
	
	//htmlblah to create X html elements from roomCount.
	
	//let's first assume there is already 1 room with defined elements hum1 and temp1
	
	//get SSID
	var ssidRef = firebase.database().ref("users/" + uid + "/SSID");
	ssid = readSSID(ssidRef);
	
	
	} else {
    console.log("null user");
  }
});

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


