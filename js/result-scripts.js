$(document).ready(function() {
    
	var loggedInUser = localStorage.getItem("userName");
	var loggedInUserRole = localStorage.getItem("userRole");
    var loggedInUserId = localStorage.getItem("userId");
    var result = localStorage.getItem("studentResult");
    console.log(result);
	if (loggedInUserRole != "student") {
        window.location.href = "admin_panel.html";
        if(result==null){
            window.location.href = "student_panel.html";
        }
    }
    
    let results = result.split(".");
    
    $("#studentInfo").html(loggedInUser);

    $("#totalScore").html(results[2]+"/"+results[0]);

    $("#totalQuestions").html(results[0]);

    $("#rightAnswers").html(results[2]);

    $("#wrongAnswers").html(results[0]-results[2]);

    // remove token after exam 
    localStorage.removeItem("token");

})