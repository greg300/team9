var ssid = 0;
var macAdd = 0;
var updates = {};

function updateParams() {
	if ( document.getElementById("door").checked == true) {
		
	} else {
		
		document.getElementById("navtop").style.backgroundColor = "#42c5f5";
		document.getElementById("footercolor").style.backgroundColor = "#42c5f5";
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