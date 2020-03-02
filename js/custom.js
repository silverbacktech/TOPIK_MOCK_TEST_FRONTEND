$(document).ready(function() {
	$("#dataForm").submit(function(e) {
		event.preventDefault();
		$("#login-error-message").text("");
		let formDatas = new FormData(loginForm);

		// console.log(formDatas.get("email"));
		// console.log(formDatas.values());
		// for (let value of formDatas.values()) {
		// 	console.log(value);
		// }

		$.ajax({
			method: "POST",
			url: "http://127.0.0.1:8000/api/login",
			cache: false,
			data: {
				email: formDatas.get("email"),
				password: formDatas.get("password")
			},
			success: function(result) {
				//checking email password
				if (result.status) {
					//when it does not match
					let access_token = result.values["access_token"];
					localStorage.setItem("token", access_token);
					if (result.values["role"] == "admin") {
						window.location.href = "admin_panel.html";
						// $("#mainContainer").load("admin_panel.html");
					} else if (result.values["role"] == "student"){
						window.location.href = "student_panel.html";
					}
				} else {
					//when it match
					console.log(result);
					$("#login-error-message").text(result.message);
				}
			}
		});
	});

	$("#btnLogOut").click(function() {
		localStorage.removeItem("token");
		location.reload();
	});

	// custon pop up box
});
