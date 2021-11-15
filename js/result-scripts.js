$(document).ready(function() {
    
	var loggedInUser = localStorage.getItem("userName");
	var loggedInUserRole = localStorage.getItem("userRole");
    var loggedInUserId = localStorage.getItem("userId");
    var result = localStorage.getItem("studentResult");
    var readingResult = localStorage.getItem("reading").split(',');
    var listeningResult = localStorage.getItem("listening").split(',');
    // console.log(result);
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

    // console.log(readingResult,readingResult.length,listeningResult,listeningResult.length);

    var num=1;
    for(var i=0;i<readingResult.length;i++){
        // console.log("dataL",readingResult[i])
        $(".result-reading").append($("<p class='rslt rslt"+readingResult[i]+"'>"+num+"</p>"));
        num=num+1;
    }
    for(var i=0;i<listeningResult.length;i++){
        $(".result-listening").append($("<p class='rslt rslt"+listeningResult[i]+"'>"+num+"</p>"));
        num=num+1;
    }

    // remove token after exam 
    localStorage.removeItem("token");

})