const hum = document.getElementById("hum");
const temp = document.getElementById("temp");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
	var uid = user.uid;
	var humPath = "users/" + uid + "/rooms/0/latestHumid";
	var tempPath = "users/" + uid + "/rooms/0/latestTemp";
	var humRef = firebase.database().ref(humPath);
	var tempRef = firebase.database().ref(tempPath);
	humRef.on('value', function(snapshot) {
		hum.innerText = snapshot.val();
	});
	tempRef.on('value', function(snapshot) {
		temp.innerText = snapshot.val();
	});
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
