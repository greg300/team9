const database = firebase.database();

function toggleLogin() {
	if (firebase.auth().currentUser) {
		//sign out
		firebase.auth().signOut().then(function() {
			alert("You have been signed out.");
			window.location.replace('https://humidibot-8a6ff.firebaseapp.com');
		}).catch(function(error) {
			//Error
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(errorMessage);
			console.log(error);
		});
	} else {
		//sign in
		var x = document.getElementById("email").value;
		var y = document.getElementById("pass").value;
		if (x == "" || y == "") {
		  alert("One or more fields are empty.");
		  return;
		}
		// Sign in with email and pass.
		firebase.auth().signInWithEmailAndPassword(x, y).then(function() {
			
			window.location.replace('https://humidibot-8a6ff.firebaseapp.com/dashboard.html');
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  if (errorCode === 'auth/wrong-password') {
			alert('Wrong password.');
		  } else {
			alert(errorMessage);
		  }
		  console.log(error);
		  //document.getElementById('quickstart-sign-in').disabled = false;
		});
	}
		//document.getElementById('quickstart-sign-in').disabled = true;
}

function resetpass() {
	var x = document.getElementById("email").value;
	
	if (x == "") {
		alert("One or more fields are empty.");
		return;
	}
	
	//send password reset
	firebase.auth().sendPasswordResetEmail(x).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
		window.location.replace('https://humidibot-8a6ff.firebaseapp.com/');
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
}

function validateForm() {
	var x = document.getElementById("email").value;
	var y = document.getElementById("pass").value;
	var z = document.getElementById("confirmpass").value;
	
	if (x == "" || y == "" || z == "") {
		alert("One or more fields are empty.");
		return;
	} else if (y != z) {
		alert("Passwords not the same.");
		return;
	}
	//register
	firebase.auth().createUserWithEmailAndPassword(x,y).then(function(user) {
		var user = firebase.auth().currentUser;
		let uid = user.uid;
		database.ref('users/' + uid).set({
			roomCount: 1,
			rooms: {
				name: "Default Room",
				latestTemp: 50,
				latestHumid: 50,
			}
		database.ref('parameters/' + uid).set({
			door: false;
			fan: false;
			windows: false;
			}
		});
		
		window.location.replace('https://humidibot-8a6ff.firebaseapp.com/');
		alert("Registration successful!");
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode == 'auth/weak-password') {
		  alert('The password is too weak.');
		} else {
		  alert(errorMessage);
		}
		console.log(error);
		// [END_EXCLUDE]
	});
		
	
}
