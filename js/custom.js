$(document).ready(function() {	
	$("#btnLogOut").click(function() {
		localStorage.removeItem("token");
		localStorage.removeItem("userRole");
		localStorage.removeItem("userId");
		localStorage.removeItem("userName");
		location.reload();
	});
});
