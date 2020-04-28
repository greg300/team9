var ssid = 0;
var macAdds = [];
var updates = {};
var userInfo;
var roomname = [];

//this function should reconnect new SSID and potentially populate new roomCount
function passSSID() {
	if (ssid == 0) {
		//console.log("ssid is default");
		var x = document.getElementById("SSID").value;
	} else {
		//console.log("ssid is " + ssid);
		var x = ssid;
	}
	userInfo = firebase.auth().currentUser;
	if (userInfo) {
		var uid = userInfo.uid;
		var ssidPath = "users/" + uid;
		updates[ssidPath + '/SSID'] = x;
		//ssid has been passed to account db info
		//now to match to ssids/ and retrieve sensorNum so as to update roomCount
		var sensorNumRef = firebase.database().ref("ssids/" + x + "/sensorNum");
		sensorNumRef.once('value',function(snapshot) {
			if (snapshot.val() == null)
				alert("Invalid SSID");
			else {
				clearNodes(uid,snapshot.val());
				updates[ssidPath + '/roomCount'] = snapshot.val();
				htmlnodecreation(uid, snapshot.val());
				setTimeout(() => {
					console.log("about to update...");
					setroomnames(snapshot.val());
					updateAccount(x, uid);
				}, 100);
				
			}
		});
	} else {
		console.log("null user");
	}
	setTimeout(() => {
		return firebase.database().ref().update(updates);
	}, 200);
}

function clearNodes(uid, roomnum) {
	for (var i = 0; i < roomnum; i++) {
		var roomstr = "room_" + i;
		var roomid = "id_" + i;
		var maindiv = document.getElementById(roomstr);	
		var subdiv = document.getElementById(roomid);
		console.log("main div is " + maindiv + " and subdiv is " + subdiv);
		if (maindiv != null && subdiv != null)
			maindiv.removeChild(subdiv);
	}
}

function setroomnames(roomnum) {
	for (var i = 0; i < roomnum; i++)
	{
		var roomstrtitleid = "room_" + i + "_title";
		console.log("roomname[" + i + "] is " + roomname[i]);
		document.getElementById(roomstrtitleid).textContent = roomname[i];
	}
}

//updates roomMacAddresses
function updateAccount(ssid, uid) {
	//console.log("starting updateAccount");
	var count = 0;
	var arr = [];
	var macAddRef = firebase.database().ref("ssids/" + ssid);
	macAddRef.once('value',function(snapshot) {
		arr = Object.keys(snapshot.val());	
		arr.pop();
		macAdds = arr;
	});
	setTimeout(() => {
		var x,y;
		while (count < arr.length) {
			//console.log("inside for loop with count = " + count);
			//console.log("arr[count] is " + arr[count]);
			//listeners
			var humstr = "hum" + count;
			var tempstr = "temp" + count;
			var humPath = "ssids/" + ssid + "/" + arr[count] + "/latestHumid";
			var tempPath = "ssids/" + ssid + "/" + arr[count] + "/latestTemp";
			var humRef = firebase.database().ref(humPath);
			var tempRef = firebase.database().ref(tempPath);
			humlisten(humstr, humRef, uid, count);
			templisten(tempstr, tempRef, uid, count);
			updates["users/" + uid + "/rooms/" + count + "/macAddress"] = arr[count];
			count++;
		}
		//console.log("leaving updateAccount");
		return firebase.database().ref().update(updates);
	},50);	
}

function humlisten(humstr, humRef, uid, count) {
	var x;
	humRef.on('value', function(snapshot) {
		console.log("humsnapshot.val is " + snapshot.val());
		updates["users/" + uid + "/rooms/" + count + "/latestHumid"] = snapshot.val();
		x = document.getElementById(humstr);
		x.innerText = snapshot.val();
		return firebase.database().ref().update(updates);
	});
}

function templisten(tempstr, tempRef, uid, count) {
	var y;
	tempRef.on('value', function(snapshot) {
		console.log("tempsnapshot.val is " + snapshot.val());
		updates["users/" + uid + "/rooms/" + count + "/latestTemp"] = snapshot.val();
		y = document.getElementById(tempstr);
		y.innerText = snapshot.val();
		return firebase.database().ref().update(updates);
	});
}

function htmlnodecreation(uid, roomnum) {
	for (var i = 0; i < roomnum; i++) {	
		var humstr = "hum" + i;
		var tempstr = "temp" + i;
		var roomstr = "room_" + i;
		var roomid = "id_" + i;
		var roomstrtitle = roomstr + "_title";
		var detstring = "det_" + i;
		var linebr = document.createElement("br");
		
		var div = document.getElementById(roomstr);//HERE
			var subdiv1 = document.createElement("div");
			subdiv1.setAttribute('class','card');
			subdiv1.setAttribute('id',roomid);
				var subdiv2 = document.createElement("div");
				subdiv2.setAttribute('class','card-body');
					var h4 = document.createElement("h4");
					h4.setAttribute('class','card-title');
					h4.setAttribute('id',roomstrtitle);
					(function(index) {
						let roomnameRef = firebase.database().ref("users/" + uid + "/rooms/" + index + "/roomName");
						roomnameRef.once('value',function(snapshot) {
							console.log("i = " + index + " and roomname is " + snapshot.val());
							roomname[index] = snapshot.val();
						});	
					})(i);					
					subdiv2.appendChild(h4);
					
					var p = document.createElement("p");
					p.setAttribute('class','card-text');
					p.textContent = "Humidity:"+String.fromCharCode(160);
					subdiv2.appendChild(p);
					
					var hum = document.createElement("span");
					hum.setAttribute('id',humstr);//HERE
					p.appendChild(hum);
					
					var percent = document.createTextNode("%");
					p.appendChild(percent);
					p.appendChild(linebr);
					
					var temptext = document.createTextNode("Temperature:" + String.fromCharCode(160));
					p.appendChild(temptext);
					
					var temp = document.createElement("span");
					temp.setAttribute('id',tempstr);//HERE
					p.appendChild(temp);
					
					var deg = document.createTextNode(String.fromCharCode(160) + "deg");
					p.appendChild(deg);
				var subdiv3 = document.createElement("div");
				subdiv3.setAttribute('class','card-footer');
					var details = document.createElement("BUTTON");
					details.setAttribute('id',detstring);
					//details.setAttribute("onclick","sessionSave("+uid+","+i+")");
					details.setAttribute('class','btn btn-primary');
					details.innerHTML = "Details";
					subdiv3.appendChild(details);
			subdiv1.appendChild(subdiv2);
			subdiv1.appendChild(subdiv3);
		div.appendChild(subdiv1);
		(function(index) {
			let detstring = "det_" + index;
			document.getElementById(detstring).addEventListener("click",
				function() {
					let roomiden = detstring[4];
					sessionSave(uid,roomiden);
			});
			
			
		})(i);
	}
}

function sessionSave(userid, i) {
	//console.log("in session save with userid = " + userid + " and with room_num = " + i);
	sessionStorage.setItem('uid',userid);
	sessionStorage.setItem('i',i);
	console.log("macAdds are " + macAdds);
	sessionStorage.setItem('macAdd',macAdds[i]);
	sessionStorage.setItem('ssid',ssid);
	
	setTimeout(() => {
		console.log("leaving...");
		window.location.replace("https://humidibot-8a6ff.firebaseapp.com/roomview.html");
	},100);
}

function readSSID(ssidRef) {
	ssidRef.once('value',function(snapshot) {
		//console.log("inside readSSID snap is " + snapshot.val());
		ssid = snapshot.val();
	});
}



function readmacAdd(macAddRef) {
	macAddRef.once('value',function(snapshot) {
		return snapshot.val();
	});	
}

document.addEventListener("DOMContentLoaded", function() {
	firebase.auth().onAuthStateChanged(function(user) {
		userInfo = firebase.auth().currentUser;
	});
	
	setTimeout(() => {
		setup();
	}, 200);
});

//first load setup
function setup() {
	if (userInfo) {
	    var uid = userInfo.uid;
		var ssidRef = firebase.database().ref("users/" + uid + "/SSID");
		readSSID(ssidRef);
		setTimeout(() => {
			passSSID();
		},200);
	} else {
		console.log("null user");
		alert("Known bug. Either ctrl+F5 or enter SSID again");
	}
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


