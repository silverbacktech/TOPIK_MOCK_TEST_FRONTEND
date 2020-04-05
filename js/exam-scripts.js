var answerOption = [];
var answerId = [];
$(document).ready(function() {
	var serverName = "http://127.0.0.1:8000";
	var loggedInUser = localStorage.getItem("userName");
	var loggedInUserRole = localStorage.getItem("userRole");
	var loggedInUserId = localStorage.getItem("userId");
	if (loggedInUserRole != "student") {
		window.location.href = "admin_panel.html";
	}

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
				url: serverName + "/api/student-groups/" + queryString["setId"],
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
						let cols = result.length;
						if (cols >= 1) {
							$.each(result, function(i, data) {
								// console.log(data);
								$("#examQuestionSection")
									.find("#examQuestionsForm")
									.append(
										$("<h4 class='group-title'>").html(
											data.group_text
										)
									);
								$.each(data.reading_questions, function(
									i,
									questions
								) {
									// console.log(questions.question_content);
									$("#examQuestionSection")
										.find("#examQuestionsForm")
										.append(
											$("<div class='question-part'>")
												.append(
													$(
														"<span class='question-no'>"
													).append(i + 1),
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
													$("<img>", {
														id: "theImg",
														src:
															serverName +
															"/cover_img/" +
															questions.question_image
													})
												)
										);

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
											.find("#examQuestionsForm")
											.append(
												$(
													"<div class='options'>"
												).append(
													$("<input>")
														.attr(
															"class",
															"form-control"
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
							});
							$("#examQuestionSection")
								.find("form")
								.append(
									$("<div>").append(
										$("<input>")
											.attr("class", "btn btn-success")
											.attr("type", "button")
											.attr("value", "End Reading Exam")
											.attr("name", "btn-submit-answers")
											.attr(
												"id",
												"btnSubmitReadingQuestions"
											)
									)
								);
						}
					}
				}
			});
		} else {
		}
	});

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
