var answerOption = [];
var answerId = [];
var currentQuestion=['reading','1'];
$(document).ready(function() {
	var serverName = "http://127.0.0.1:8000";
	var loggedInUser = localStorage.getItem("userName");
	var loggedInUserRole = localStorage.getItem("userRole");
	var loggedInUserId = localStorage.getItem("userId");
	if (loggedInUserRole != "student") {
		window.location.href = "admin_panel.html";
	}

	//Initialize dialog

	$("#examInstructionDialog").dialog({
		autoOpen: false,
		closeOnEscape: false,
		draggable:false,
		resizable: false,
		buttons: {
			// start timer 
			Start: function() {
				var fiveMinutes = 60 * 50,display = document.querySelector('#time');
				startTimer(fiveMinutes, display);
				$( this ).dialog( "close" );
				$('#modalOverlay').removeClass('hideQuestions');
			}
		},
		show: {},
		hide: {},   
	});

	// make unclickable checkbox: when made through css- checkbox greys out 
	$("#readingNos,#listeningNos").on(
		"click",
		"input:checkbox",
		function() {
			return false;
	});

	// getting parameters from url
	var queryString = new Array();
	$(function() {
		if (queryString.length == 0) {
			if (window.location.search.split("?").length > 1) {
				var params = window.location.search.split("?")[1].split("&");
				for (var i = 0; i < params.length; i++) {
					var key = params[i].split("=")[0];
					var value = decodeURIComponent(params[i].split("=")[1]);
					queryString[key] = value;
				}
			}
		}
		if (
			queryString["setId"] != null &&
			queryString["languageName"] != null
		) {
			$.ajax({
				method: "GET",
				url: serverName + "/api/student-questions/" + queryString["setId"],
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token")
				},
				cache: false,
				success: function(result) {
					//checking email password
					if (result.status) {
						//when it does not match
						console.log(result);
					} else {
						// when it does match
						console.log(result);

						let cols = result.readingQuestions.length;
						if (cols >= 1) {
							var readingNo=0;
							var listeningNo=0;
							var groupName;

							// for reading questions 
							$.each(result.readingQuestions, function(i, data) {
								
								// insert the number of reading questions in navigation 
								readingNo = readingNo + parseInt(data.reading_questions.length);
								document.getElementById('readingNo').innerHTML = readingNo;
								groupName = data.group_text;

								$.each(data.reading_questions, function(
									i,
									questions
								) {
									// console.log(questions.question_content);
									$("#examQuestionSection")
										.find("#examQuestionsForm")
										.append(
											$("<div class='question-part' id="+'reading_'+questions.id+">")
												.append($("<h4 class='group-title'>").html(
													groupName
												))
												.append(
													$(
														"<span class='question-no'>"
													).append(questions.id),
													$("<p>")
														.attr(
															"class",
															"mt-3 mb-3 questions"
														)
														.html(
															questions.question_content
														)
														.attr(
															"data",
															questions.id
														)
														.attr(
															"name",
															"question"
														)
												)
												.append(
													(questions.question_image ? 
														$("<img>", {
															id: "theImg",
															src:
																serverName +
																"/cover_img/" +
																questions.question_image
														}):'<div></div>'	
													)
												)
									);
									
									// add questio numbers in right sidebar 

									$("#questionNos")
									.find("#readingNos")
									.append($("<div>").append(
										$("<button class='question-btn' id="+'readingBtn_'+questions.id+">"+questions.id+"</Button>")
									).append($("<input type='checkbox' class='readingCheck' id=checkRed"+questions.id+">")));

									// adding answer to array
									answerOption.push(
										questions.reading_answer[
											"reading_options_id"
										]
									);

									answerId.push(
										questions.reading_answer["id"]
									);

									$.each(questions.reading_options, function(
										j,
										options
									) {
										$("#examQuestionSection")
											.find('#reading_'+options.reading_questions_id)
											.append(
												$(
													"<div class='options'>"
												).append(
													$("<input>")
														.attr(
															"class",
															"form-control readingAns"
														)
														.attr(
															"id",
															"right-answer"
														)
														.attr("type", "radio")
														.attr(
															"value",
															options.id
														)
														.attr(
															"data",
															options.reading_questions_id
														)
														.attr(
															"name",
															"right-answer" +
																options.reading_questions_id +
																""
														),
													$("<label for=''>").html(
														options.reading_options_content
													)
												)
											);
									});
								});
							}); // reading questions end 

							// for listening questions 
							$.each(result.listeningQuestions, function(i, data) {
								
								// insert the number of reading questions in navigation 
								listeningNo = listeningNo + parseInt(data.listening_questions.length);
								document.getElementById('listeningNo').innerHTML = listeningNo;
								groupName = data.group_text;
								
								$.each(data.listening_questions, function(
									i,
									questions
								) {
									// console.log(questions.question_content);
									$("#examQuestionSection")
										.find("#examQuestionsForm")
										.append(
											$("<div class='question-part' id="+'listening_'+questions.id+">")
												.append($("<h4 class='group-title'>").html(
													groupName
												))
												.append(
													$(
														"<span class='question-no'>"
													).append(questions.id),
													$("<p>")
														.attr(
															"class",
															"mt-3 mb-3 questions"
														)
														.html(
															// questions.question_content
															'question content - milauna baki'
														)
														.attr(
															"data",
															questions.id
														)
														.attr(
															"name",
															"question"
														)
												)
												.append(
													(questions.image_file ? 
														$("<img>", {
															id: "theImg",
															src:
																serverName +
																"/cover_img/" +
																questions.image_file
														}):'<div></div>'	
													)
												)
												.append(
													(questions.audio_file ? 
														$("<audio controls class='listening_audio' id=audio_"+questions.id+">").append($("<source>", {
															src:
																serverName +
																"/cover_img/" +
																questions.audio_file,
															type:"audio/mp3"
														})):'<div></div>'	
													)
												)
												.append(
													(questions.audio_file ? 
														$("<button type='button' class='playBtn' data='audio_"+questions.id+"'></button>"):'<div></div>'	
													)
												)
										);

									
									// add questio numbers in right sidebar 

									$("#questionNos")
									.find("#listeningNos")
									.append($("<div>").append(
										$("<button class='question-btn' id="+'listeningBtn_'+questions.id+">"+questions.id+"</Button>")
									).append($("<input type='checkbox' class='listeningCheck' id=checkLis"+questions.id+">")));

									// adding answer to array
									answerOption.push(
										questions.listening_answer[
											"reading_options_id"
										]
									);

									answerId.push(
										questions.listening_answer["id"]
									);

									$.each(questions.listening_options, function(
										j,
										options
									) {
										$("#examQuestionSection")
											.find('#listening_'+options.listening_questions_id)
											.append(
												$(
													"<div class='options'>"
												).append(
													$("<input>")
														.attr(
															"class",
															"form-control listeningAns"
														)
														.attr(
															"id",
															"right-answer"
														)
														.attr("type", "radio")
														.attr(
															"value",
															options.id
														)
														.attr(
															"data",
															options.listening_questions_id
														)
														.attr(
															"name",
															"right-answer" +
																options.listening_questions_id +
																""
														),
													$("<label for=''>").html(
														options.option_content
													)
												)
											);
									});
								});
								
							});
							// listening questions end

							// insert the number of total questions in navigation 
							var totalNo = listeningNo+readingNo;
							document.getElementById('totalNo').innerHTML = totalNo;


							// $("#examQuestionSection")
							// 	.find("form")
							// 	.append(
							// 		$("<div>").append(
							// 			$("<input>")
							// 				.attr("class", "btn btn-success")
							// 				.attr("type", "button")
							// 				.attr("value", "End Reading Exam")
							// 				.attr("name", "btn-submit-answers")
							// 				.attr(
							// 					"id",
							// 					"btnSubmitReadingQuestions"
							// 				)
							// 		)
							// 	);
						}
					}
				}
			});
		} else {
		}
	});

	// play or pause audio 
	$("#examQuestionSection").on("click",".playBtn",function() {
		// console.log($(this).attr('data'));
		var myAudio = document.getElementById($(this).attr('data'));
        if(myAudio.paused) {
            myAudio.play();
        }
        else {
           myAudio.pause();
        }
	});

	// check right sidebar checkbox on answer selection 

	$("#examQuestionSection").on(
		"click",
		".readingAns",
		function() {
			$("#checkRed"+$(this).attr('data')+"").prop('checked', true);
	});
	
	$("#examQuestionSection").on(
		"click",
		".listeningAns",
		function() {
			console.log($(this).attr('data'));
			// $("#checkLis"+$(this).attr('data')+"").prop('checked', true);
			$("#checkLis"+$(this).attr('data')+"").prop('checked', true);
	});
	
	// change reading/ listening question 
	$("#questionNos").on("click",".question-btn",function() {
		var nos = $(this).attr('id').split('_');
		if(nos[0]=='readingBtn'){
			$(".question-part").css({"display": "none"});
			$(".question-part#reading_"+nos[1]+"").css({"display": "flex","flex-direction":"column"});
			currentQuestion=['reading',nos[1]];
		}
		else{
			$(".question-part").css({"display": "none"});
			$(".question-part#listening_"+nos[1]+"").css({"display": "flex","flex-direction":"column"});
			currentQuestion=['listening',nos[1]];
		}
	});

	// change questions on button press 
	$("#btnNext").click(function(){
		var maxReading =parseInt($("#readingNo").html());
		var maxListening =parseInt($("#listeningNo").html());
		var currentQ = parseInt(currentQuestion[1]);
		
		if(currentQuestion[0]=='reading'){
			if(currentQ!=maxReading){
				console.log("1");
				var i =currentQ+1;
				currentQuestion[1]=i;
				$(".question-part").css({"display": "none"});
				$(".question-part#reading_"+i+"").css({"display": "flex","flex-direction":"column"});
			}else{
				console.log("2");
				currentQuestion=["listening",1];
				$(".question-part").css({"display": "none"});
				$(".question-part#listening_1").css({"display": "flex","flex-direction":"column"});
			}
		}else{
			if(currentQ<maxListening){
				console.log("3");
				var i =currentQ+1;
				currentQuestion[1]=i;
				$(".question-part").css({"display": "none"});
				$(".question-part#listening_"+i+"").css({"display": "flex","flex-direction":"column"});
			}else{
				
			}
		}
	})
	$("#btnPrevious").click(function(){
		var maxReading =parseInt($("#readingNo").html());
		var maxListening =parseInt($("#listeningNo").html());
		var currentQ = parseInt(currentQuestion[1]);
		// console.log(currentQuestion)
		
		if(currentQuestion[0]=='reading'){
			if(currentQ!=1){
				var i =currentQ-1;
				currentQuestion[1]=i;
				$(".question-part").css({"display": "none"});
				$(".question-part#reading_"+i+"").css({"display": "flex","flex-direction":"column"});
			}else{
				
			}
		}else{
			if(currentQ==1){
				currentQuestion=["reading",maxReading];
				$(".question-part").css({"display": "none"});
				$(".question-part#reading_"+maxReading+"").css({"display": "flex","flex-direction":"column"});
			}else{
				var i =currentQ-1;
				currentQuestion[1]=i;
				$(".question-part").css({"display": "none"});
				$(".question-part#listening_"+i+"").css({"display": "flex","flex-direction":"column"});
			}
		}
	})



	$("#examQuestionSection").on(
		"click",
		"#btnSubmitReadingQuestions",
		function() {
			// console.log("df");

			let questions = $("span[name='question']")
				.map(function() {
					return $(this).attr("data");
				})
				.get();

			let answers = $("input[type='radio']:checked")
				.map(function() {
					return $(this).val();
				})
				.get();

			console.log(answerId);
			$.ajax({
				method: "post",
				url: serverName + "/api/submitted-answers/" + loggedInUserId,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
					Accept: "application/json"
				},
				data: {
					reading_question_id: questions,
					reading_answer_id: answerId
				},
				cache: false,
				success: function(result) {
					//checking email password
					if (result.status) {
						alert("the answers has been submitted");
						console.log(result);
					} else {
						//when it does not match
						console.log(result);
					}
				}
			});

			let rightAnswer = 0;
			for (i = 0; i < answerOption.length; i++) {
				if (answerOption[i] == answers[i]) {
					rightAnswer++;
				}
			}
			// console.log(rightAnswer);
			alert(
				"Total Questions: " +
					answerOption.length +
					" Total Correct: " +
					rightAnswer
			);
		}
	);
});

// other functions 
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}
