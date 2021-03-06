$(document).ready(function() {
	//Initialize dialog
	$("#editLangDialog").dialog({
		autoOpen: false,
		show: {},
		hide: {}
	});

	// show or hide content
	let selected;
	$("a.show-content").click(function() {
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
			url: "http://127.0.0.1:8000/api/language/show",
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
			url: "http://127.0.0.1:8000/api/set/show",
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
			url: "http://127.0.0.1:8000/api/set/" + languageId,
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

	// add reading questions

	$(".answerTypeRadio").change(function() {
		let ans = $("input[name=readingSelector]:checked").val();
		if (ans == "text") {
			$(".answerFile").prop("disabled", true);
			$(".answerText").prop("disabled", false);
		} else {
			$(".answerText").prop("disabled", true);
			$(".answerFile").prop("disabled", false);
		}
	});
	// add sets ends

	// add languages tab
	// to load all the languages on tab click
	$("#tabAddLanguages").click(function() {
		$("#languageTableBody").empty();
		$.ajax({
			method: "GET",
			url: "http://127.0.0.1:8000/api/language/show",
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
			url: "http://127.0.0.1:8000/api/language",
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
				url: "http://127.0.0.1:8000/api/language/delete/" + delId,
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
			url: "http://127.0.0.1:8000/api/language/edit/" + changeId,
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
