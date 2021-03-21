var readingAnswerOption = [];
var listeningAnswerOption = [];
var readingAnswerId = [];
var listeningAnswerId = [];
var redStudentResult = [];
var lisStudentResult = [];
var qNo =1;
var currentQuestion=['reading','1'];
var examStarted = false;
var isSubmitting = false;
$(document).ready(function() {
	
	var loggedInUser = localStorage.getItem("userName");
	var loggedInUserRole = localStorage.getItem("userRole");
	var loggedInUserId = localStorage.getItem("userId");
	if (loggedInUserRole != "student") {
		window.location.href = "admin_panel.html";
	}

	

	//Initialize dialog

	$("#examInstructionDialog").dialog({
		autoOpen: true,
		closeOnEscape: false,
		draggable:false,
		resizable: false,
		buttons: {
			// start timer 
			Start: function() {
				$( this ).dialog( "close" );
				$('#modalOverlay').removeClass('hideQuestions');
			}
		},
		show: {},
		hide: {},   
	});

	// test audio 
	$("#testAudioBtn").click(function(){

		var testAudio = document.getElementById("testAudio");

		$("#testAudioSrc").attr("src",serverName + "/api/test-audio/test_audio.mp3");
		
		testAudio.load();
		testAudio.play();
	});

	$("#timerEndDialog").dialog({
		autoOpen: false,
		closeOnEscape: false,
		draggable:false,
		resizable: false,
		// buttons: {
		// 	// submit test 
		// 	Submit:function(){
		// 		$("#btnSubmitReadingQuestions").click();
		// 		$( this ).dialog( "close" );
		// 		$('#modalOverlay').addClass('hideQuestions');
		// 	}
		// },
		show: {},
		hide: {},   
	}).prev(".ui-dialog-titlebar").css({"background":"red","color":"white"});

	// set username and other info of student 
	$("#examStudentName").html("이름 : "+loggedInUser);
	$("#examStudentId").html(loggedInUserId);

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
											$("<div class='question-part readingQuestionPart' id="+'reading_'+qNo+" data="+questions.id+">")
												.append($("<h4 class='group-title'>").html(
													groupName
												))
												.append(
													$("<p>")
														.attr(
															"class",
															"mt-3 mb-3 questions"
														)
														.html(
															qNo+" . "+
															(questions.question_content?questions.question_content:"")
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
													(questions.question_instruction ? 
														$("<p>", {
															html: questions.question_instruction,
															class:"question-instructions"
														}):''	
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

									$("#examAllQuestionSection")
									.find("#readingNos")
									.append(
										$("<a class='question-btn' id="+'readingBtn_'+qNo+">"+qNo+"</a>")
									);

									// adding answer to array
									readingAnswerOption.push(
										questions.reading_answer[
											"reading_options_id"
										]
									);

									readingAnswerId.push(
										questions.reading_answer["id"]
									);

									// add place for options 
									$("#questionOptionsSection").append(
										$("<div class='optionsPart' id=readingOpt_"+qNo+">")
									);

									$.each(questions.reading_options, function(
										j,
										options
									) {
										$("#questionOptionsSection")
											.find("#readingOpt_"+qNo+"")
											.append(
												$(
													"<div>"
												).append(
													$("<input>")
														.attr(
															"class",
															"form-control radioAns readingAns redOpt"+qNo+""
														)
														.attr(
															"id",
															"right-answer-"+options.id+""
														)
														.attr("type", "radio")
														.attr(
															"value",
															options.id
														)
														.attr(
															"data",
															qNo
														)
														.attr(
															"name",
															"red-right-answer" +
																options.reading_questions_id +
																""
														),
														$("<label for='right-answer-"+options.id+"'>").html(j+1).attr("class","radioSpan"),
													$("<label for='right-answer-"+options.id+"'>").html(
														options.reading_options_content
													).attr("class","radioLabel")
												)
											);
									});
									qNo=qNo+1;
								});
							}); // reading questions end 

							// for listening questions 
							$.each(result.listeningQuestions, function(i, data) {
								
								// insert the number of reading questions in navigation 
								listeningNo = listeningNo + parseInt(data.listening_questions.length);
								document.getElementById('listeningNo').innerHTML = listeningNo;
								groupName = data.group_text;
								groupImage = data.group_image;
								
								$.each(data.listening_questions, function(
									i,
									questions
								) {
									// console.log(questions.question_content);
									$("#examQuestionSection")
										.find("#examQuestionsForm")
										.append(
											$("<div class='question-part listeningQuestionPart' id="+'listening_'+qNo+" data="+questions.id+">")
												.append($("<h4 class='group-title'>").html(
													groupName
												))
												.append(
													(groupImage ? 
														$("<img>", {
															class: "lisGroupImage",
															src:
																serverName +
																"/cover_img/" +
																groupImage
														}):'<div></div>'	
													)
												)
												.append(
													$("<p>")
														.attr(
															"class",
															"mt-3 mb-3 questions"
														)
														.html(
															qNo+" . "+
															(questions.question_content?questions.question_content:"")
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
														$("<audio controls class='listening_audio' id=audio_"+qNo+" data-audio="+questions.audio_file+">").append($("<source>", {
															src:"",
															type:"audio/mp3",
															id:"source_"+qNo+"",
														})):'<div></div>'	
													)
												)
												.append(
													(questions.audio_file ? 
														$("<button type='button' class='playBtn' data='audio_"+qNo+"' data-btn='audio_"+qNo+"'></button>"):'<div></div>'	
													)
												)
										);

									
									// add questio numbers in right sidebar 

									$("#examAllQuestionSection")
									.find("#listeningNos")
									.append(
										$("<a class='question-btn' id="+'listeningBtn_'+qNo+">"+qNo+"</a>")
									);

									// adding answer to array
									listeningAnswerOption.push(
										questions.listening_answer[
											"listening_options_id"
										]
									);

									listeningAnswerId.push(
										questions.listening_answer["id"]
									);

									// add place for options 
									$("#questionOptionsSection").append(
										$("<div class='optionsPart' id=listeningOpt_"+qNo+">")
									);

									$.each(questions.listening_options, function(
										j,
										options
									) {
										$("#questionOptionsSection")
											.find("#listeningOpt_"+qNo+"")
											.append(
												$(
													"<div>"
												).append(
													$("<input>")
														.attr(
															"class",
															"form-control radioAns listeningAns lisOpt"+qNo+""
														)
														.attr(
															"id",
															"lis-right-answer-"+options.id+""
														)
														.attr("type", "radio")
														.attr(
															"value",
															options.id
														)
														.attr(
															"data",
															qNo
														)
														.attr(
															"name",
															"lis-right-answer" +
																options.listening_questions_id +
																""
														),
														$("<label for='lis-right-answer-"+options.id+"'>").html(j+1).attr("class","radioSpan"),
														((options.option_content==null)?"":(options.option_content.split(".").pop())=="png" ? 
															$("<img>", {
																id: "theImg",
																src:
																	serverName +
																	"/cover_img/" +
																	options.option_content
															}):	(options.option_content.split(".").pop())=="jpeg" ? 
															$("<img>", {
																id: "theImg",
																src:
																	serverName +
																	"/cover_img/" +
																	options.option_content
															}):(options.option_content.split(".").pop())=="jpg" ? 
															$("<img>", {
																id: "theImg",
																src:
																	serverName +
																	"/cover_img/" +
																	options.option_content
															}):'<label class="radioLabel" for="lis-right-answer-'+options.id+'">'+options.option_content+'</label>'
														),

												)
											);
									});
									qNo=qNo+1;
								});
								
							});
							// listening questions end

							// insert the number of total questions in navigation 
							var totalNo = listeningNo+readingNo;
							document.getElementById('totalNo').innerHTML = totalNo;
							document.getElementById('remainingNo').innerHTML = totalNo;
						}
					}
				}
			});
		} else {
		}
	});


	// play or pause audio 
	$("#examQuestionSection").on("click",".playBtn",function() {
		var audioId = $(this).attr('data');
		var myAudio = document.getElementById(audioId);
		var audioSrc = $("#"+audioId+"").data("audio");
		var htmlSrcId = "source_"+audioId.split("_").pop();

		// let counter = localStorage.getItem('counter');
		let serverName ="http://192.168.1.12/";
			// if(localStorage.getItem('userId')%3==0){
			// 	serverName = "http://127.0.0.1:8001/";
			// }
			// else if(localStorage.getItem('userId')%2==0){
			// 	serverName = "http://127.0.0.1:8002";
			// }
			// else{
			// 	serverName = "http://127.0.0.1:8003";
			// }
		$("#"+htmlSrcId+"").attr("src",serverName + "/api/audio-stream/"+audioSrc);
		
		myAudio.load();
		myAudio.play();

		var lodin = $('<span style="text-align:center">Loading...</span>');
		var loaded = $('<span style="text-align:center">▶</span>');

		$(this).attr("disabled",true);
		$(this).after(lodin);
		lodin.delay(5000).hide(0);
		setTimeout(function() {
			$("[data-btn='" + audioId + "']").attr("disabled",false);
		}, 5000);

			myAudio.onplaying = function() {
			$("[data-btn='" + audioId + "']").attr("disabled",true);
			$("[data-btn='" + audioId + "']").css("border","5px solid blue");
			
			lodin.replaceWith(loaded);
			loaded.delay(2000).hide(0); 
		};


		
		// $(this).after("<span style='text-align:center'>Loading...</span>")
		// myAudio.onplay = function(){
		// 	console.log("playin");
		// 	console.log(audioSrc.duration())
		// }
		// myAudio.addEventListener("loadedmetadata", function(_event) {
		// 	var duration = myAudio.duration;
		// 	console.log(duration);
		// });
	});

	// check right sidebar checkbox on answer selection

	// pause all audio 
	function pauseAllAudio(){
		var sounds = document.getElementsByTagName('audio');
  		for(i=0; i<sounds.length; i++) {
			  sounds[i].pause();
			  sounds[i].currentTime = 0;
		};
	};
	
	// open questions bar 
	$("#viewQuestionNumbers").click(function(){
		if(examStarted){
			pauseAllAudio();
			$(".exam-main").toggle();
			$("#examAllQuestionSection").toggle();
		}
	});

	$("#questionOptionsSection").on(
		"click",
		".readingAns",
		function() {
			$("#readingBtn_"+$(this).attr('data')+"").css({'background-color': 'blue','color':'white'});

			// enter remaining numbers in navigation 
			$("#remainingNo").html(parseInt($("#totalNo").html())-$("input[type=radio]:checked").length);
	});

	$("#questionOptionsSection").on(
		"click",
		".listeningAns",
		function() {
			$("#listeningBtn_"+$(this).attr('data')+"").css({'background-color': 'blue','color':'white'});

			// enter remaining numbers in navigation 
			$("#remainingNo").html(parseInt($("#totalNo").html())-$("input[type=radio]:checked").length);
	});

	
	// change reading/ listening question 
	$("#examAllQuestionSection").on("click",".question-btn",function() {

		if(examStarted==false){
			var fiftyMinutes = 60 * 50,display = document.querySelector('#time');
			startTimer(fiftyMinutes, display);
			examStarted=true;
		}

		var nos = $(this).attr('id').split('_');
		if(nos[0]=='readingBtn'){
			$("#examAllQuestionSection").hide();
			$(".exam-main").show();
			
			$(".question-part").css({"display": "none"});
			$(".question-part#reading_"+nos[1]+"").css({"display": "flex","flex-direction":"column"});
			$(".optionsPart").css({"display": "none"});
			$(".optionsPart#readingOpt_"+nos[1]+"").css({"display": "flex","flex-direction":"column"});
			currentQuestion=['reading',nos[1]];
		}
		else{
			$("#examAllQuestionSection").hide();
			$(".exam-main").show();

			$(".question-part").css({"display": "none"});
			$(".question-part#listening_"+nos[1]+"").css({"display": "flex","flex-direction":"column"});
			$(".optionsPart").css({"display": "none"});
			$(".optionsPart#listeningOpt_"+nos[1]+"").css({"display": "flex","flex-direction":"column"});
			currentQuestion=['listening',nos[1]];
		}
	});

	// change questions on next previous button press 
	$("#btnNext").click(function(){
		var maxReading =parseInt($("#readingNo").html());
		var maxListening =parseInt($("#listeningNo").html());
		var currentQ = parseInt(currentQuestion[1]);
		
		if(currentQuestion[0]=='reading'){
			if(currentQ!=maxReading){
				var i =currentQ+1;
				currentQuestion[1]=i;
				$(".question-part").css({"display": "none"});
				$(".question-part#reading_"+i+"").css({"display": "flex","flex-direction":"column"});
				$(".optionsPart").css({"display": "none"});
				$(".optionsPart#readingOpt_"+i+"").css({"display": "flex","flex-direction":"column"});
			}else{
				if(maxListening>=1){
					currentQuestion=["listening",maxReading+1];
					$(".question-part").css({"display": "none"});
					$(".question-part#listening_"+currentQuestion[1]+"").css({"display": "flex","flex-direction":"column"});
					$(".optionsPart").css({"display": "none"});
					$(".optionsPart#listeningOpt_"+currentQuestion[1]+"").css({"display": "flex","flex-direction":"column"});
				}else{

				}
			}
		}else{
			pauseAllAudio();
			if(currentQ<maxReading+maxListening){
				var i =currentQ+1;
				currentQuestion[1]=i;
				$(".question-part").css({"display": "none"});
				$(".question-part#listening_"+i+"").css({"display": "flex","flex-direction":"column"});
				$(".optionsPart").css({"display": "none"});
				$(".optionsPart#listeningOpt_"+i+"").css({"display": "flex","flex-direction":"column"});
			}else{
				
			}
		}
		$(window).scrollTop(0);

	})
	$("#btnPrevious").click(function(){
		var maxReading =parseInt($("#readingNo").html());
		var currentQ = parseInt(currentQuestion[1]);
		// console.log(currentQuestion)
		
		if(currentQuestion[0]=='reading'){
			if(currentQ!=1){
				var i =currentQ-1;
				currentQuestion[1]=i;
				$(".question-part").css({"display": "none"});
				$(".question-part#reading_"+i+"").css({"display": "flex","flex-direction":"column"});
				$(".optionsPart").css({"display": "none"});
				$(".optionsPart#readingOpt_"+i+"").css({"display": "flex","flex-direction":"column"});
			}else{
				
			}
		}else{
			pauseAllAudio();
			if(currentQ==maxReading+1){
				currentQuestion=["reading",maxReading];
				$(".question-part").css({"display": "none"});
				$(".question-part#reading_"+maxReading+"").css({"display": "flex","flex-direction":"column"});
				$(".optionsPart").css({"display": "none"});
				$(".optionsPart#readingOpt_"+maxReading+"").css({"display": "flex","flex-direction":"column"});
			}else{
				var i =currentQ-1;
				currentQuestion[1]=i;
				$(".question-part").css({"display": "none"});
				$(".question-part#listening_"+i+"").css({"display": "flex","flex-direction":"column"});
				$(".optionsPart").css({"display": "none"});
				$(".optionsPart#listeningOpt_"+i+"").css({"display": "flex","flex-direction":"column"});
			}
		}
		$(window).scrollTop(0);
	})


	$("#btnSubmitReadingQuestions").click(function(){
		isSubmitting=true;
		$("#btnSubmitReadingQuestions").attr("disabled",true);
		$("#btnSubmitReadingQuestions").css({"background":"yellow","color":"black"});
		$("#btnSubmitReadingQuestions").html("Please wait...");
		if (confirm("Are you sure you want to submit the exam?")) {
			ajaxSubmit();
		}
		else {
			$("#btnSubmitReadingQuestions").attr("disabled",false);
			$("#btnSubmitReadingQuestions").css({"background":"blue","color":"white"});
			$("#btnSubmitReadingQuestions").html("제출 (Submit)");
			isSubmitting=false;
		}
	});

	function ajaxSubmit(){
			$('#modalOverlay').addClass('hideQuestions');
			let maxReading =parseInt($("#readingNo").html());
			let maxListening =parseInt($("#listeningNo").html());
			let quesAttempted =0;
			let redAns=[],lisAns=[];

			// store answers of reading and listening in a array 
			for(i=1;i<=maxReading;i++){
				if($(".redOpt"+i+"").is(':checked')){
					redAns.push($(".redOpt"+i+":checked").val());
					quesAttempted++;
				}else{
					redAns.push(null);
				}
			}
			for(i=maxReading+1;i<=maxReading+maxListening;i++){
				if($(".lisOpt"+i+"").is(':checked')){
					lisAns.push($(".lisOpt"+i+":checked").val());
					quesAttempted++;
				}else{
					lisAns.push(null);
				}
			}

			// check how many right how many wrong 
			let redRightAnswer=0;
			let lisRightAnswer=0;
			
			// 1 right answer | 0 unanswered | 2 wrong 
			for (i = 0; i < readingAnswerOption.length; i++) {
				if (readingAnswerOption[i] == redAns[i]) {
					redRightAnswer++;
					redStudentResult.push(1);
				}else if(redAns[i]==null){
					redStudentResult.push(0);
				}else{
					redStudentResult.push(2);
				}
			}
			
			for (i = 0; i < listeningAnswerOption.length; i++) {
				if (listeningAnswerOption[i] == lisAns[i]) {
					lisRightAnswer++;
					lisStudentResult.push(1);
				}else if(lisAns[i]==null){
					lisStudentResult.push(0);
				}else{
					lisStudentResult.push(2);
				}
			}


			// getting total questions id, both reading and listening 

			let redQuestions = $(".readingQuestionPart")
			.map(function() {
				return $(this).attr("data");
			})
			.get();

			let lisQuestions = $(".listeningQuestionPart")
			.map(function() {
				return $(this).attr("data");
			})
			.get();

			// console.log(redQuestions,redAns,lisQuestions,lisAns,queryString["setId"],loggedInUserId);

			let resultPageItems = (maxReading+maxListening)+"."+quesAttempted+"."+(redRightAnswer+lisRightAnswer);
			
				$.ajax({
					method: "post",
					url: serverName + "/api/submitted-answers/" + loggedInUserId,
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
						Accept: "application/json"
					},
					data: {
						reading_question_id: redQuestions,
						reading_answer_id: redAns,
						listening_question_id: lisQuestions,
						listening_answer_id: lisAns,
						student_id:loggedInUserId,
						set_id: queryString['setId'],
						scored_points: redRightAnswer+lisRightAnswer,
					},
					cache: false,
					success: function(result) {
						//checking email password
						if (result.status) {
							localStorage.setItem("studentResult", resultPageItems);
							localStorage.setItem("reading",redStudentResult);
							localStorage.setItem("listening",lisStudentResult);
							window.location.href = "resultpanel.html";
						} else {
							//when it does not match
							alert("There was an error submiting the answers.");
						}
					}
				});
	}

	// other functions 
	function startTimer(duration, display) {
		var timer = duration, minutes, seconds;
		setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			display.textContent = minutes + ":" + seconds;

			if(timer<60&&timer>57){
				$("#time").css("color","red");
				$("#testAudio")[0].play();
			}
			if (--timer == 0) {
				$("#timerEndDialog").dialog('open');
				$("#time").html("00:00");
				isSubmitting=true;
				ajaxSubmit();
			}
		
    }, 1000);
}
});

// warn user before reload / change page 
window.onbeforeunload = function (e) {
	if (isSubmitting==false) {
		var message = "You have not saved your changes.", e = e || window.event;
		if (e) {
			e.returnValue = message;
		}
		return message;
	}
}


