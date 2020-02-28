$(document).ready(function() {
	// server name
	var serverName = "http://127.0.0.1:8000";
	//Initialize dialog
	$("#editLangDialog").dialog({
		autoOpen: false,
		show: {},
		hide: {}
	});

	// show or hide content
	let selected;
	$("a.show-content").click(function() {
		console.log(selected);
		var toShow = $(this).attr("data");
		// $(".main-content").removeClass("show");
		if (selected !== undefined) selected.removeClass("show");
		selected = $("#" + toShow);
		selected.addClass("show");
	});

	// get information of logged in user
	// $.ajax({
	//     method: "POST",
	//     url: "http://127.0.0.1:8003/user/show",
	//     cache: false,
	//     data: {
	//         email: formDatas.get("email"),
	//         password: formDatas.get("password")
	//     },
	//     success: function(result) {
	//         //checking email password
	//         if (result.status) {
	//             //when it does not match
	//             let access_token = result.values["access_token"];
	//             localStorage.setItem("token", access_token);
	//             if (result.values["role"] == "admin") {
	//                 window.location.href = "admin_panel.html";
	//                 // $("#mainContainer").load("admin_panel.html");
	//             } else {
	//                 // window.location.href = "student_panel.html";
	//             }
	//         } else {
	//             //when it match
	//             console.log(result);
	//             $("#login-error-message").text(result.message);
	//         }
	//     }
	// });

	// add sets starts
	$("#tabAddSets").click(function() {
		$("#languageInputSelect").empty();
		$("#setTableBody").empty();
		$.ajax({
			method: "GET",
			url: serverName + "/api/language/show",
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
					//when it does match
					$.each(result, function(i, item) {
						$("#languageInputSelect").append(
							$("<option>", {
								value: item.id,
								text: item.language_name
							})
						);
					});
				}
			}
		});

		$.ajax({
			method: "GET",
			url: serverName + "/api/set/show",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token")
			},
			cache: false,
			success: function(result) {
				//checking email password
				if (result.status) {
					//when it does not match
				} else {
					//when it does match
					$.each(result, function(key, set) {
						// $.each(set.language, function(keys, language) {
						// 	console.log(language.language_name);
						// });
						var NewRow = '<tr><td">' + set.id + "</td>";
						NewRow += '<td id="setId">' + set.id + "</td>";

						$.each(set.language, function(keys, language) {
							NewRow +=
								'<td id="setLangName" data=' +
								language.id +
								">" +
								language.language_name +
								"</td>";
						});

						NewRow += '<td id="setName">' + set.name + "</td>";
						NewRow +=
							"<td>" +
							'<button class="btn btn-info" id="addReading" data=' +
							set.id +
							">Add Reading Questions</button>" +
							"</td>";
						NewRow +=
							"<td>" +
							'<button class="btn btn-info" id="addListening" data=' +
							set.id +
							">Add Listening Questions</button>" +
							"</td>";
						NewRow +=
							"<td>" +
							'<button class="btn btn-primary" id="editSet" data=' +
							set.id +
							">Edit</button>" +
							"</td>";

						NewRow +=
							"<td>" +
							'<button class="btn btn-danger" id="deleteSet" data=' +
							set.id +
							">Delete</button>" +
							"</td>";

						$("#setTableBody").append(NewRow);
					});
				}
			}
		});
	});

	// add set button
	$("#btnAddSet").click(function(e) {
		e.preventDefault();
		let setName = $("#inputSet").val();
		let languageId = $("#languageInputSelect")
			.find(":selected")
			.val();

		$.ajax({
			method: "POST",
			url: serverName + "/api/set/" + languageId,
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token")
			},
			cache: false,
			data: {
				name: setName
			},
			success: function(result) {
				//checking email password
				if (result.status) {
					//when it does match
					alert("The set has been added");
					$("#tabAddSets").click();
				} else {
					//when it does not match
					alert("There was an error adding the set");
				}
			}
		});
	});

	// button add reading questions

	$("#setTableBody").on("click", "#addReading", function() {
		let groupLang = $(this)
			.parents()
			.siblings("#setLangName")
			.html();
		let groupSet = $(this)
			.parents()
			.siblings("#setId")
			.html();
		$("#groupSetId").val(groupSet);
		$("#groupLanguageName").val(groupLang);
		$("#tabAddReadingQuestions").click();
	});

	// add reading questions

	$("#btnAddGroup").click(function(e) {
		e.preventDefault();
		// insert group name into db
		let gpName = $("#inputGroupTitle").val();
		let gpId = $("#groupSetId").val();
		let gpQuestions = $("#inputGroupQuestionNo").val();
		if ((gpQuestions, gpName, gpId != "")) {
			$.ajax({
				method: "POST",
				url: serverName + "/api/add-question-group/" + gpId,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token")
				},
				data: {
					group_name: gpName
				},
				cache: false,
				success: function(result) {
					//checking email password
					if (result.status) {
						//when it does match
						console.log("The group has been added");
						$("#inputGroupTitle").attr("disabled", true);
						$("#groupSetFormId").val(result.value["id"]);
					} else {
						//when it does not match
						console.log("The group has not been added");
					}
				}
			});
		} else {
			alert("Fill in the required data");
		}

		// rest
		$("#groupInputDiv")
			.find("form")
			.empty();
		let cols = $("#inputGroupQuestionNo").val();
		if (cols >= 1) {
			for (let i = 0; i < cols; i++) {
				$("#groupInputDiv")
					.find("form")
					.append(
						$("<div>").append(
							$("<div>").append(
								$("<h4>").append(i),
								$("<input>")
									.attr("class", "form-control mt-3 mb-3")
									.attr("type", "text")
									.attr("name", "question[]")
									.attr("placeholder", "Enter Question")
							),
							$("<div>").append(
								$("<input>")
									.attr(
										"class",
										"form-control-file mt-3 mb-3"
									)
									.attr("type", "file")
									.attr("name", "questionfile" + i + "")
									.prop("multiple", true)
							),
							$("<div>").append(
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "text")
									.attr("name", "option1[]")
									.attr("style", "width:25%;display:inline")
									.attr("placeholder", "Option 1"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "text")
									.attr("name", "option2[]")
									.attr("style", "width:25%;display:inline")
									.attr("placeholder", "Option 2"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "text")
									.attr("name", "option3[]")
									.attr("style", "width:25%;display:inline")
									.attr("placeholder", "Option 3"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "text")
									.attr("name", "option4[]")
									.attr("style", "width:25%;display:inline")
									.attr("placeholder", "Option 4")
							),
							$("<div>").append(
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "radio")
									.attr("value", "1")
									.attr("name", "right-answer" + i + "")
									.attr("style", "width:25%;display:inline"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "radio")
									.attr("value", "2")
									.attr("name", "right-answer" + i + "")
									.attr("style", "width:25%;display:inline"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "radio")
									.attr("value", "3")
									.attr("name", "right-answer" + i + "")
									.attr("style", "width:25%;display:inline"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "radio")
									.attr("value", "4")
									.attr("name", "right-answer" + i + "")
									.attr("style", "width:25%;display:inline")
							)
						)
					);
			}
			$("#groupInputDiv")
				.find("form")
				.append(
					$("<div>").append(
						$("<input>")
							.attr("class", "btn btn-success")
							.attr("type", "button")
							.attr("value", "Add Questions")
							.attr("name", "btn-group-questions")
							.attr("id", "btnAddGroupQuestions")
					)
				);
		}
	});

	$("#groupInputDiv").on("click", "#btnAddGroupQuestions", function() {
		// console.log("warks");

		let formDatas = new FormData(questionsForm);

		let questions = $("input[name='question[]']")
			.map(function() {
				return $(this).val();
			})
			.get();
		let option1s = $("input[name='option1[]']")
			.map(function() {
				return $(this).val();
			})
			.get();
		let option2s = $("input[name='option2[]']")
			.map(function() {
				return $(this).val();
			})
			.get();
		let option3s = $("input[name='option3[]']")
			.map(function() {
				return $(this).val();
			})
			.get();
		let option4s = $("input[name='option4[]']")
			.map(function() {
				return $(this).val();
			})
			.get();

		let answers = [];
		let noQ = $("#inputGroupQuestionNo").val();
		for (let i = 0; i < noQ; i++) {
			answers[i] = formDatas.get("right-answer" + i + "");
		}

		let questionFile = [];
		for (let i = 0; i < noQ; i++) {
			questionFile[i] = formDatas.get("questionfile" + i + "");
		}

		console.log(questionFile);
		let jsonObject = {};

		// questionFile.forEach(function() {

		// });
		console.log(jsonObject);

		let groupId = $("#groupSetFormId").val();
		// console.log(groupId);

		$.ajax({
			method: "post",
			url: serverName + "/api/add-questions/" + groupId,
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
				Accept: "application/json"
			},
			data: {
				question: questions,
				questionfile: questionFile,
				option1: option1s,
				option2: option2s,
				option3: option3s,
				option4: option4s,
				answer: answers
			},
			cache: false,
			success: function(result) {
				//checking email password
				if (result.status) {
					//when it does match
					console.log(result);
				} else {
					//when it does not match
					console.log(result);
				}
			}
		});
	});

	// add sets ends

	// add languages tab
	// to load all the languages on tab click
	$("#tabAddLanguages").click(function() {
		console.log("language");
		$("#languageTableBody").empty();
		$.ajax({
			method: "GET",
			url: serverName + "/api/language/show",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token")
			},
			cache: false,
			success: function(result) {
				//checking email password
				if (result.status) {
					//when it does not match
				} else {
					//when it does match
					$.each(result, function(key, language) {
						var NewRow = '<tr><td">' + language.id + "</td>";
						NewRow += '<td id="langId">' + language.id + "</td>";
						NewRow +=
							'<td id="langName">' +
							language.language_name +
							"</td>";
						NewRow +=
							"<td>" +
							'<button class="btn btn-primary" id="editLang" data=' +
							language.id +
							">Edit</button>" +
							"</td>";

						NewRow +=
							"<td>" +
							'<button class="btn btn-danger" id="deleteLang" data=' +
							language.id +
							">Delete</button>" +
							"</td>";

						$("#languageTableBody").append(NewRow);
					});
				}
			}
		});
	});

	// add language button
	$("#btnAddLanguage").click(function(e) {
		e.preventDefault();
		let language = $("#inputLanguage").val();

		$.ajax({
			method: "POST",
			url: serverName + "/api/language",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token")
			},
			cache: false,
			data: {
				language_name: language
			},
			success: function(result) {
				//checking email password
				if (result.status) {
					//when it does match
					alert("The language has been added");
					$("#tabAddLanguages").click();
				} else {
					//when it does not match
					alert("There was an error adding the language");
				}
			}
		});
	});

	// delete language button
	$("#languageTableBody").on("click", "#deleteLang", function() {
		if (confirm("Are you sure you want to delete this language?")) {
			let delId = $(this).attr("data");
			$.ajax({
				method: "POST",
				url: serverName + "/api/language/delete/" + delId,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token")
				},
				cache: false,
				success: function(result) {
					//checking email password
					if (result.status) {
						//when it does match
						alert("The language has been deleted");
						$("#tabAddLanguages").click();
					} else {
						//when it does not match
						alert("There was an error deleting the language");
					}
				}
			});
		} else {
		}
	});

	//Open it when #opener is clicked
	$("#languageTableBody").on("click", "#editLang", function() {
		$("#editLangDialog").dialog("open");
		let editId = $(this)
			.parents()
			.siblings("#langId")
			.html();
		let oldLang = $(this)
			.parents()
			.siblings("#langName")
			.html();
		$("#inputEditLanguage").val(oldLang);
		$("#editLanguageId").val(editId);
	});

	// edit language button
	// $("#languageTableBody").on("click", "#editLang", function() {
	$("#saveEditLanguage").click(function() {
		let changedLang = $("#inputEditLanguage").val();
		let changeId = $("#editLanguageId").val();
		$.ajax({
			method: "POST",
			url: serverName + "/api/language/edit/" + changeId,
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token")
			},
			data: {
				language_name: changedLang
			},
			cache: false,
			success: function(result) {
				//checking email password
				if (result.status) {
					//when it does match
					$("#editLangDialog").dialog("close");
					alert("The language has been edited");
					$("#tabAddLanguages").click();
				} else {
					//when it does not match
					$("#editLangDialog").dialog("close");
					alert("There was an error editing the language");
					console.log(result);
				}
			}
		});
	});

	// add language ends here
});
