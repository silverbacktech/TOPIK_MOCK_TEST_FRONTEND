var serverName = "http://192.168.1.12";
$(document).ready(function() {	
	$("#btnLogOut").click(function() {
		localStorage.removeItem("token");
		localStorage.removeItem("userRole");
		localStorage.removeItem("userId");
		localStorage.removeItem("userName");
		localStorage.removeItem("counter");
		location.reload();
	});
});
