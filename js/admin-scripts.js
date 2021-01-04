$(document).ready(function () {
	// server name
	var serverName = "http://127.0.0.1:8000";
	let loggedInUser = localStorage.getItem("userName");
	let loggedInUserRole = localStorage.getItem("userRole");
	if (loggedInUserRole != "admin") {
		window.location.href = "student_panel.html";
	}
	$("#userName").html("Welcome " + loggedInUser);
	//Initialize dialog
	$("#editLangDialog").dialog({
		autoOpen: false,
		show: {},
		hide: {},
	});

	$("#changeAdminPasswordDialog").dialog({
		autoOpen: false,
		show: {},
		hide: {},
	});

	// show or hide content
	let selected;
	$("a.show-content").click(function () {
		var toShow = $(this).attr("data");
		// $(".main-content").removeClass("show");
		if (selected !== undefined) selected.removeClass("show");
		selected = $("#" + toShow);
		selected.addClass("show");
	});

	$("#mainLogo").click(function () {
		location.reload();
	});

	// add sets starts
	$("#tabAddSets").click(function () {
		$("#languageInputSelect").empty();
		$("#setTableBody").empty();
		$.ajax({
			method: "GET",
			url: serverName + "/api/language/show",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			cache: false,
			success: function (result) {
				//checking email password
				if (result.status) {
					//when it does not match
					console.log(result);
				} else {
					//when it does match
					$.each(result, function (i, item) {
						$("#languageInputSelect").append(
							$("<option>", {
								value: item.id,
								text: item.language_name,
							})
						);
					});
				}
			},
		});

		$.ajax({
			method: "GET",
			url: serverName + "/api/set/show",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			cache: false,
			success: function (result) {
				//checking email password
				if (result.status) {
					//when it does not match
				} else {
					//when it does match
					$.each(result, function (key, set) {
						var NewRow = '<tr><td">' + set.id + "</td>";
						NewRow += '<td id="setId">' + set.id + "</td>";

						$.each(set.language, function (keys, language) {
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
			},
		});
	});

	// add set button
	$("#btnAddSet").click(function (e) {
		e.preventDefault();
		let setName = $("#inputSet").val();
		let languageId = $("#languageInputSelect").find(":selected").val();

		$.ajax({
			method: "POST",
			url: serverName + "/api/set/" + languageId,
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			cache: false,
			data: {
				name: setName,
			},
			success: function (result) {
				//checking email password
				if (result.status) {
					//when it does match
					alert("The set has been added");
					$("#tabAddSets").click();
				} else {
					//when it does not match
					alert("There was an error adding the set");
				}
			},
		});
	});

	// button add reading questions

	$("#setTableBody").on("click", "#addReading", function () {
		let groupLang = $(this).parents().siblings("#setLangName").html();
		let groupSet = $(this).parents().siblings("#setId").html();
		$("#groupSetId").val(groupSet);
		$("#groupLanguageName").val(groupLang);
		$("#tabAddReadingQuestions").click();
	});

	// add reading questions

	$("#btnAddGroup").click(function (e) {
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
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
				data: {
					group_name: gpName,
				},
				cache: false,
				success: function (result) {
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
				},
			});
		} else {
			alert("Fill in the required data");
		}

		// rest
		$("#groupInputDiv").find("form").empty();
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
									.attr("name", "question")
									.attr("placeholder", "Enter Question")
							),
							$("<div>").append(
								$("<input>")
									.attr(
										"class",
										"form-control-file mt-3 mb-3"
									)
									.attr("type", "file")
									.attr("name", "questionfile")
									.prop("multiple", true)
							),
							$("<div>").append(
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "text")
									.attr("name", "option1")
									.attr("style", "width:25%;display:inline")
									.attr("placeholder", "Option 1"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "text")
									.attr("name", "option2")
									.attr("style", "width:25%;display:inline")
									.attr("placeholder", "Option 2"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "text")
									.attr("name", "option3")
									.attr("style", "width:25%;display:inline")
									.attr("placeholder", "Option 3"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "text")
									.attr("name", "option4")
									.attr("style", "width:25%;display:inline")
									.attr("placeholder", "Option 4")
							),
							$("<div>").append(
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "radio")
									.attr("value", "1")
									.attr("name", "right-answer" + i)
									.attr("style", "width:25%;display:inline"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "radio")
									.attr("value", "2")
									.attr("name", "right-answer" + i)
									.attr("style", "width:25%;display:inline"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "radio")
									.attr("value", "3")
									.attr("name", "right-answer" + i)
									.attr("style", "width:25%;display:inline"),
								$("<input>")
									.attr("class", "form-control")
									.attr("type", "radio")
									.attr("value", "4")
									.attr("name", "right-answer" + i)
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

	$("#groupInputDiv").on("click", "#btnAddGroupQuestions", function () {
		let formDatas = new FormData(questionsForm);
		let formData = new FormData();

		for (let entry of formDatas.entries()) {
			if (entry[0] == "question")
				formData.append(entry[0] + "[]", entry[1]);
			else if (entry[0] == "questionfile")
				formData.append(entry[0] + "[]", entry[1]);
			else if (entry[0] == "option1")
				formData.append(entry[0] + "[]", entry[1]);
			else if (entry[0] == "option2")
				formData.append(entry[0] + "[]", entry[1]);
			else if (entry[0] == "option3")
				formData.append(entry[0] + "[]", entry[1]);
			else if (entry[0] == "option4")
				formData.append(entry[0] + "[]", entry[1]);
			else formData.append("answers[]", entry[1]);
		}

		let groupId = $("#groupSetFormId").val();
		console.log(groupId);

		fetch(serverName + "/api/add-questions/" + groupId, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
				Accept: "application/json",
			},
			body: formData,
		})
			.then((response) => response.json())
			.then((json) => console.log(json))
			.catch((err) => console.log(err));
	});

	// add sets ends

	// student part begins

	// add student begins

	$("#tabAddStudents").click(function () {
		$("#formAddStudents").find("button[type=reset]").click();
	});

	$("#formAddStudents").submit(function (e) {
		e.preventDefault();
		let stname = $("#studentAddName").val();
		let stemail = $("#studentAddEmail").val();
		let stpassword = $("#studentAddPassword").val();
		let strole = "student";
		console.log(stname, stemail, stpassword, strole);
		$.ajax({
			method: "POST",
			url: serverName + "/api/register/",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
				Accept: "application/json",
			},
			data: {
				name: stname,
				email: stemail,
				password: stpassword,
				password_confirmation: stpassword,
				role: strole,
			},
			cache: false,
			success: function (result) {
				//checking email password
				if (result.status) {
					//when it does match
					alert("The student has been added");
					$("#tabViewStudents").click();
				} else {
					//when it does not match
				}
			},
		});
	});

	// generate student password

	$("#studentAddEmail,#studentAddPhone").change(function () {
		$("#studentGeneratePassword").prop("checked", false);
		$("#studentAddPassword").val("");
	});

	$("#studentGeneratePassword").click(function () {
		let email = $("#studentAddEmail").val().split("@")[0];
		let phone = $("#studentAddPhone").val().slice(-4);
		if (email || phone != "") {
			$("#studentAddPassword").val(email + phone);
		} else {
			alert("Enter full information");
			$("#studentGeneratePassword").prop("checked", false);
		}
	});

	// view students starts

	$("#tabViewStudents").click(function () {
		let role = "student";
		$("#studentsTableBody").empty();
		$.ajax({
			method: "GET",
			url: serverName + "/api/user/showUsers/" + role,
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			cache: false,
			success: function (result) {
				//checking email password
				if (result.status) {
					//when it does not match
				} else {
					// when it does match
					$.each(result, function (key, student) {
						var NewRow = '<tr><td">' + student.id + "</td>";
						NewRow += '<td id="studentId">' + student.id + "</td>";
						NewRow +=
							'<td id="studentName">' + student.name + "</td>";
						NewRow +=
							'<td id="studentName">' + student.email + "</td>";

						NewRow +=
							"<td>" +
							'<button class="btn btn-danger" id="deleteStudent" data=' +
							student.id +
							">Delete</button>" +
							"</td>";

						$("#studentsTableBody").append(NewRow);
					});
				}
			},
		});
	});

	$("#studentsTableBody").on("click", "#deleteStudent", function () {
		if (confirm("Are you sure you want to delete this student?")) {
			let delId = $(this).attr("data");
			$.ajax({
				method: "POST",
				url: serverName + "/api/user/delete/" + delId,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
				cache: false,
				success: function (result) {
					//checking email password
					if (result.status) {
						//when it does match
						alert("The student has been deleted");
						$("#tabViewStudents").click();
					} else {
						//when it does not match
						alert("There was an error deleting the student");
					}
				},
			});
		} else {
		}
	});

	// view students ends

	// add languages tab
	// to load all the languages on tab click
	$("#tabAddLanguages").click(function () {
		$("#languageTableBody").empty();
		$.ajax({
			method: "GET",
			url: serverName + "/api/language/show",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			cache: false,
			success: function (result) {
				//checking email password
				if (result.status) {
					//when it does not match
				} else {
					//when it does match
					$.each(result, function (key, language) {
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
			},
		});
	});

	// add language button
	$("#btnAddLanguage").click(function (e) {
		e.preventDefault();
		let language = $("#inputLanguage").val();

		$.ajax({
			method: "POST",
			url: serverName + "/api/language",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			cache: false,
			data: {
				language_name: language,
			},
			success: function (result) {
				//checking email password
				if (result.status) {
					//when it does match
					alert("The language has been added");
					$("#tabAddLanguages").click();
				} else {
					//when it does not match
					alert("There was an error adding the language");
				}
			},
		});
	});

	// delete language button
	$("#languageTableBody").on("click", "#deleteLang", function () {
		if (confirm("Are you sure you want to delete this language?")) {
			let delId = $(this).attr("data");
			$.ajax({
				method: "POST",
				url: serverName + "/api/language/delete/" + delId,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
				cache: false,
				success: function (result) {
					//checking email password
					if (result.status) {
						//when it does match
						alert("The language has been deleted");
						$("#tabAddLanguages").click();
					} else {
						//when it does not match
						alert("There was an error deleting the language");
					}
				},
			});
		} else {
		}
	});

	//Open it when #opener is clicked
	$("#languageTableBody").on("click", "#editLang", function () {
		$("#editLangDialog").dialog("open");
		let editId = $(this).parents().siblings("#langId").html();
		let oldLang = $(this).parents().siblings("#langName").html();
		$("#inputEditLanguage").val(oldLang);
		$("#editLanguageId").val(editId);
	});

	// edit language button
	$("#saveEditLanguage").click(function () {
		let changedLang = $("#inputEditLanguage").val();
		let changeId = $("#editLanguageId").val();
		$.ajax({
			method: "POST",
			url: serverName + "/api/language/edit/" + changeId,
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			data: {
				language_name: changedLang,
			},
			cache: false,
			success: function (result) {
				//checking email password
				if (result.status) {
					//when it does match
					$("#editLangDialog").dialog("close");
					alert("The language has been edited");
					$("#tabAddLanguages").click();
				} else {
					//when it does not match
				}
			},
		});
	});

	// add language ends here

	// admin part begins here

	// add student begins

	// $("#tabAddStudents").click(function() {
	// 	$("#formAddStudents")
	// 		.find("button[type=reset]")
	// 		.click();
	// });

	// $("#formAddStudents").submit(function(e) {
	// 	e.preventDefault();
	// 	let stname = $("#studentAddName").val();
	// 	let stemail = $("#studentAddEmail").val();
	// 	let stpassword = $("#studentAddPassword").val();
	// 	let strole = "student";
	// 	console.log(stname, stemail, stpassword, strole);
	// 	$.ajax({
	// 		method: "POST",
	// 		url: serverName + "/api/register/",
	// 		headers: {
	// 			Authorization: "Bearer " + localStorage.getItem("token"),
	// 			Accept: "application/json"
	// 		},
	// 		data: {
	// 			name: stname,
	// 			email: stemail,
	// 			password: stpassword,
	// 			password_confirmation: stpassword,
	// 			role: strole
	// 		},
	// 		cache: false,
	// 		success: function(result) {
	// 			//checking email password
	// 			if (result.status) {
	// 				//when it does match
	// 				alert("The student has been added");
	// 				$("#tabViewStudents").click();
	// 			} else {
	// 				//when it does not match
	// 			}
	// 		}
	// 	});
	// });

	// // generate student password

	// $("#studentAddEmail,#studentAddPhone").change(function() {
	// 	$("#studentGeneratePassword").prop("checked", false);
	// 	$("#studentAddPassword").val("");
	// });

	// $("#studentGeneratePassword").click(function() {
	// 	let email = $("#studentAddEmail")
	// 		.val()
	// 		.split("@")[0];
	// 	let phone = $("#studentAddPhone")
	// 		.val()
	// 		.slice(-4);
	// 	if (email || phone != "") {
	// 		$("#studentAddPassword").val(email + phone);
	// 	} else {
	// 		alert("Enter full information");
	// 		$("#studentGeneratePassword").prop("checked", false);
	// 	}
	// });

	// // view students starts

	$("#tabViewAdmin").click(function () {
		let role = "admin";
		$("#adminTableBody").empty();
		$.ajax({
			method: "GET",
			url: serverName + "/api/user/showUsers/" + role,
			headers: {
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
			cache: false,
			success: function (result) {
				//checking email password
				if (result.status) {
					//when it does not match
				} else {
					// when it does match
					$.each(result, function (key, admin) {
						var NewRow = '<tr><td">' + admin.id + "</td>";
						NewRow += '<td id="adminId">' + admin.id + "</td>";
						NewRow += '<td id="adminName">' + admin.name + "</td>";
						NewRow +=
							'<td id="adminEmail">' + admin.email + "</td>";
						NewRow +=
							"<td>" +
							'<button class="btn btn-primary" id="changeAdminPassword" data=' +
							admin.id +
							">Change Password</button>" +
							"</td>";
						if (result.length > 1) {
							NewRow +=
								"<td>" +
								'<button class="btn btn-danger" id="deleteAdmin" data=' +
								admin.id +
								">Delete</button>" +
								"</td>";
						}

						$("#adminTableBody").append(NewRow);
					});
				}
			},
		});
	});

	$("#adminTableBody").on("click", "#deleteAdmin", function () {
		if (confirm("Are you sure you want to delete this admin?")) {
			let delId = $(this).attr("data");
			$.ajax({
				method: "POST",
				url: serverName + "/api/user/delete/" + delId,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
				cache: false,
				success: function (result) {
					//checking email password
					if (result.status) {
						//when it does match
						alert("The admin has been deleted");
						$("#tabViewAdmin").click();
					} else {
						//when it does not match
						alert("There was an error deleting the admin");
					}
				},
			});
		} else {
		}
	});

	// edit password admin

	//Open it when #opener is clicked
	$("#adminTableBody").on("click", "#changeAdminPassword", function () {
		let editId = $(this).parents().siblings("#adminId").html();
		let editEmail = $(this).parents().siblings("#adminEmail").html();
		let editName = $(this).parents().siblings("#adminName").html();
		$("#changeAdminPasswordDialog").dialog("open");

		$("#adminIdC").val(editId);
		$("#adminNameC").val(editName);
		$("#adminEmailC").html(editEmail);
	});

	// change password button
	$("#saveNewPassword").click(function () {
		if (
			$("#inputNewPassword").val() == $("#inputNewPasswordC").val() &&
			$("#inputNewPasswordC").val() != ""
		) {
			let adminId = $("#adminIdC").val();
			let adminEmail = $("#adminEmailC").html();
			let adminName = $("#adminNameC").val();
			let adminPassword = $("#inputNewPasswordC").val();
			let role = "admin";

			$.ajax({
				method: "POST",
				url: serverName + "/api/user/edit/" + adminId,
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
					Accept: "application/json",
				},
				data: {
					name: adminName,
					email: adminEmail,
					password: adminPassword,
					password_confirmation: adminPassword,
					role: role,
				},
				cache: false,
				success: function (result) {
					//checking email password
					if (result.status) {
						//when it does match
						$("#changeAdminPasswordDialog").dialog("close");
						alert("The password has been changed");
						$("#tabViewAdmin").click();
					} else {
						//when it does not match
					}
				},
			});
		} else {
			$("#errorMessageAdminChangePassword").html("Passwords don't match");
		}
	});

	// add admin begins

	$("#formAddAdmin").submit(function (e) {
		e.preventDefault();

		let adname = $("#adminAddName").val();
		let ademail = $("#adminAddEmail").val();
		let adpassword = $("#adminAddPassword").val();
		let adpasswordc = $("#adminAddPasswordC").val();
		let adrole = "admin";

		if (adpassword != adpasswordc) {
			$("#addAdminError").html("The passwords don't match");
		} else {
			$.ajax({
				method: "POST",
				url: serverName + "/api/register/",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
					Accept: "application/json",
				},
				data: {
					name: adname,
					email: ademail,
					password: adpassword,
					password_confirmation: adpasswordc,
					role: adrole,
				},
				cache: false,
				success: function (result) {
					//checking email password
					if (result.status) {
						//when it does match
						alert("The admin has been added");
						$("#tabViewAdmin").click();
					} else {
						//when it does not match
					}
				},
			});
		}
	});

	// admin part ends here
});
