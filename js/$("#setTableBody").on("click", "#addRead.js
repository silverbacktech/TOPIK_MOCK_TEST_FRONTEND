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
    // if ((gpQuestions, gpName, gpId != "")) {
    //     $.ajax({
    //         method: "POST",
    //         url: serverName + "/api/add-question-group/" + gpId,
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("token"),
    //         },
    //         data: {
    //             group_name: gpName,
    //         },
    //         cache: false,
    //         success: function (result) {
    //             //checking email password
    //             if (result.status) {
    //                 //when it does match
    //                 console.log("The group has been added");
    //                 $("#inputGroupTitle").attr("disabled", true);
    //                 $("#groupSetFormId").val(result.value["id"]);
    //             } else {
    //                 //when it does not match
    //                 console.log("The group has not been added");
    //             }
    //         },
    //     });
    // } else {
    //     alert("Fill in the required data");
    // }

    // rest
    $("#lGroupInputDiv").find("form").empty();
    let cols = $("#lGnputGroupQuestionNo").val();
    if (cols >= 1) {
        for (let i = 0; i < cols; i++) {
            $("#lGroupInputDiv")
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
        $("#lGroupInputDiv")
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
    let i = 0;
    for (let entry of formDatas.entries()) {
        if (entry[0] == "question")
            formData.append(entry[0] + `[]`, entry[1]);
        else if (entry[0] == "questionfile"){
            formData.append(entry[0] + `[${i}]`, entry[1]);
            i++;
        }
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
    // console.log(groupId);

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



NewRow +=
							"<td>" +
							'<button class="btn '+(student.status==1?"btn-success":"btn-secondary")+'" id="statusStudent" data=' +
							student.id +
							">"+(student.status==1?"Active":"Inactive")+"</button>" +
                            "</td>";
                            

    $("#studentsTableBody").on("click", "#statusStudent", function () {
        if (confirm("Are you sure you want to change the student status?")) {
            let delId = $(this).attr("data");
            $.ajax({
                method: "POST",
                url: serverName + "/api/user/status/" + delId,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                cache: false,
                success: function (result) {
                    //checking email password
                    if (result.status) {
                        //when it does match
                        $("#tabViewStudents").click();
                    } else {
                        //when it does not match
                        alert("There was an error changing the status");
                    }
                },
            });
        } else {
        }
    });


    if($("#listeningSelect").val()=='image'){
				for (let i = 0; i < cols; i++) {
					$("#lGroupInputDiv")
						.find("form")
						.append(
							$("<div>").append(
								$("<div>").append(
									$("<h4>").append(i),
									$("<input>")
										.attr("class", "form-control mt-3 mb-3")
										.attr("type", "text")
										.attr("name", "questionContent")
										.attr("placeholder", "Enter Question")
								),
								$("<div>").append(
									$("<input>")
										.attr(
											"class",
											"form-control-file mt-3 mb-3"
										)
										.attr("type", "file")
										.attr("name", "questionImage")
										.prop("multiple", true)
								),
								$("<div>").append(
									$("<input>")
										.attr(
											"class",
											"form-control-file mt-3 mb-3"
										)
										.attr("type", "file")
										.attr("name", "audioFiles")
										.prop("multiple", true)
								),
								$("<div>").append(
									$("<input>")
										.attr(
											"class",
											"form-control-file mt-3 mb-3"
										)
										.attr("type", "file")
										.attr("name", "option1")
										.attr("style", "width:25%;display:inline")
										.prop("multiple", true),
									$("<input>")
										.attr(
											"class",
											"form-control-file mt-3 mb-3"
										)
										.attr("type", "file")
										.attr("name", "option2")
										.attr("style", "width:25%;display:inline")
										.prop("multiple", true),
									$("<input>")
										.attr(
											"class",
											"form-control-file mt-3 mb-3"
										)
										.attr("type", "file")
										.attr("name", "option3")
										.attr("style", "width:25%;display:inline")
										.prop("multiple", true),
									$("<input>")
										.attr(
											"class",
											"form-control-file mt-3 mb-3"
										)
										.attr("type", "file")
										.attr("name", "option4")
										.attr("style", "width:25%;display:inline")
										.prop("multiple", true),
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
								),
							)
						);
				}
			}else{
				for (let i = 0; i < cols; i++) {
					$("#lGroupInputDiv")
						.find("form")
						.append(
							$("<div>").append(
								$("<div>").append(
									$("<h4>").append(i),
									$("<input>")
										.attr("class", "form-control mt-3 mb-3")
										.attr("type", "text")
										.attr("name", "questionContent")
										.attr("placeholder", "Enter Question")
								),
								$("<div>").append(
									$("<input>")
										.attr(
											"class",
											"form-control-file mt-3 mb-3"
										)
										.attr("type", "file")
										.attr("name", "questionImage")
										.prop("multiple", true)
								),
								$("<div>").append(
									$("<input>")
										.attr(
											"class",
											"form-control-file mt-3 mb-3"
										)
										.attr("type", "file")
										.attr("name", "audioFiles")
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
			}