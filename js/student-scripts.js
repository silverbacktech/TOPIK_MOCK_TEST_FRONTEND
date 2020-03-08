$(document).ready(function() {
	var serverName = "http://127.0.0.1:8000";
	let loggedInUser = localStorage.getItem("userName");
	let loggedInUserRole = localStorage.getItem("userRole");
	if (loggedInUserRole != "student") {
		window.location.href = "admin_panel.html";
	}
	$(".userName").html("welcome " + loggedInUser);

	// ajax call to show the language names
	$.ajax({
		method: "GET",
		url: serverName + "/api/student-languages",
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
				$.each(result, function(i, item) {
					$("#examLanguages").append(
						"<span class='language-badge' data=" +
							item.id +
							">" +
							item.language_name +
							"</span>"
					);
				});
			}
		}
	});

	$("#examLanguages").on("click", ".language-badge", function() {
		$("#setTableBody").empty();
		$("#setTable").removeClass("hidecss");
		$("#setAlertHeader").removeClass("hidecss");
		var language_id = $(this).attr("data");
		var language_name = $(this).html();
		$.ajax({
			method: "GET",
			url: serverName + "/api/student-sets/" + language_id,
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
					$.each(result, function(key, set) {
						var NewRow = '<tr><td">' + set.id + "</td>";
						NewRow += "<td>" + set.id + "</td>";
						NewRow +=
							"<td id='languageRow' style='text-transform: capitalize;'>" +
							language_name +
							"</td>";
						NewRow += "<td>" + set.name + "</td>";
						NewRow +=
							"<td>" +
							'<button class="btn btn-success" id="beginExam" data=' +
							set.id +
							">Take Test</button>" +
							"</td>";

						$("#setTableBody").append(NewRow);
					});
				}
			}
		});
	});

	$("#setTableBody").on("click", "#beginExam", function() {
		let id = $(this).attr("data");
		let languageName = $(this)
			.parent()
			.siblings("#languageRow")
			.html();
		let url =
			"exam_panel.html?setId=" +
			encodeURIComponent(id) +
			"&languageName=" +
			encodeURIComponent(languageName);
		window.location.href = url;
	});
});
