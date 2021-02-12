var readingAnswerId = [];
var listeningAnswerId = [];

var studentReadingId = [];
var studentListeningId = [];

$(document).ready(function() {
    
	var loggedInUser = localStorage.getItem("userName");
	var loggedInUserRole = localStorage.getItem("userRole");
    var loggedInUserId = localStorage.getItem("userId");

    $("input[type='file']").val("");

    $("#editGroupDialog").dialog({
		autoOpen: false,
		show: {},
		hide: {},
	}).prev(".ui-dialog-titlebar").css({"background":"blue","color":"white"});

    $("#editLisGroupDialog").dialog({
		autoOpen: false,
		show: {},
		hide: {},
	}).prev(".ui-dialog-titlebar").css({"background":"blue","color":"white"});

    $("#editRedQuesDialog").dialog({
		autoOpen: false,
		show: {},
		hide: {},
	}).prev(".ui-dialog-titlebar").css({"background":"blue","color":"white"});
    
    var uri = decodeURIComponent(window.location.search);

    if (loggedInUserRole == "admin") {
        if(uri){
            var uriComp = uri.split("=");
            var resultId = uriComp[1];
        }else{
            window.location.href = "admin_panel.html";
        }
    }else{
        window.location.href = "login.html";
    }   
    
    var qNo =1;
    

    if(resultId){
        $.ajax({
            method: "GET",
            url: serverName + "/api/view-all-reading-questions/"+resultId,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            cache: false,
            success: function (result) {
                console.log(result)
                if (result.message) {
                    
                    // for reading part 
                    for (var i=0;i<result.readingQuestions.length;i++){
                        // console.log(mainResult.sets.reading_group[i]);

                        $("#adminEditContainer")
                        .append(
                            $("<div class='question-part readingQuestionPart'>")
                            .append($("<h4 class='group-title'>").html(
                                result.readingQuestions[i].group_text
                            )).append($("<button class='editReadingGroupBtn' data="+result.readingQuestions[i].id+">Edit Group Name</button>"))
                        );

                        $.each(result.readingQuestions[i].reading_questions, function(
                            i,
                            questions
                        ) {
                            readingAnswerId.push(questions.reading_answer.reading_options_id);
                            
                            $("#adminEditContainer")
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
                                        class: "theImg",
                                        src:
                                            serverName +
                                            "/cover_img/" +
                                            questions.question_image
                                    }):'<div></div>'	
                                )
                            )
                            .append($("<button data="+questions.id+" class='editRedQuesBtn'>Edit Question "+qNo+"</button>"))

                            // for reading options 
                            for (var i=0;i<questions.reading_options.length;i++){
                                $("#adminEditContainer")
                                .append(
                                    $("<div class='options-part readingOptionsPart'>")
                                    .append($("<span class='option' id=red"+questions.reading_options[i].id+">").html(
                                        (i+1)+". "+ questions.reading_options[i].reading_options_content
                                    ))
                                );
                            }


                            qNo=qNo+1;
                        })
                    }
                    // reading part ends here 

                    // apply border to student answer and right answer 

                    for(i=0;i<readingAnswerId.length;i++){
                        $("#red"+readingAnswerId[i]).css("border","2px solid green")
                    }
                    
                } else {
                    // when it does not match
                    console.log(result);
                }
            },
        });


        // for listening 
        $.ajax({
            method: "GET",
            url: serverName + "/api/view-all-listening-questions/"+resultId,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            cache: false,
            success: function (result) {
                console.log(result)
                if (result.message) {
                     
                    // for listening part 
                    for (var i=0;i<result.listeningQuestions.length;i++){
                        // console.log(mainResult.sets.reading_group[i]);

                        $("#adminEditContainer")
                        .append(
                            $("<div class='question-part readingQuestionPart'>")
                            .append($("<h4 class='group-title'>").html(
                                result.listeningQuestions[i].group_text
                            )).append($("<button class='editListeningGroupBtn' data="+result.listeningQuestions[i].id+">Edit Group Name</button>"))
                            .append(
                                (result.listeningQuestions[i].group_image ? 
                                    $("<img>", {
                                        class: "lisGroupImage",
                                        src:
                                            serverName +
                                            "/cover_img/" +
                                            result.listeningQuestions[i].group_image
                                    }):'<div></div>'	
                                )
                            )
                        );

                        $.each(result.listeningQuestions[i].listening_questions, function(
                            i,
                            questions
                        ) {
                            listeningAnswerId.push(questions.listening_answer.listening_options_id);
                            
                            $("#adminEditContainer")
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
                                        class: "theImg",
                                        src:
                                            serverName +
                                            "/cover_img/" +
                                            questions.image_file
                                    }):'<div></div>'	
                                )
                            )
                            .append(
                                (questions.audio_file ? 
                                    $("<audio controls>").append($("<source>",{
                                        class: "theAudio",
                                        src:
                                            serverName +
                                            "/cover_img/" +
                                            questions.audio_file
                                    })):'<div></div>'
                                )
                            )
                            .append($("<button data="+questions.id+" class='editLisQuesBtn'>Edit Question "+qNo+"</button>"))

                            // for reading options 
                            for (var i=0;i<questions.listening_options.length;i++){
                                $("#adminEditContainer")
                                .append(
                                    $("<div class='options-part listeningOptionsPart'>")
                                    .append("<span>"+(i+1)+". </span><br>")
                                    .append(
                                        // $("<span class='option' id="+questions.listening_options[i].id+">").html(
                                        // "- "+questions.listening_options[i].option_content
                                        ((questions.listening_options[i].option_content==null)?"":(questions.listening_options[i].option_content.split(".").pop())=="png" ? 
                                            $("<img>", {
                                                id: "lis"+questions.listening_options[i].id,
                                                class:"lisImg",
                                                src:
                                                    serverName +
                                                    "/cover_img/" +
                                                    questions.listening_options[i].option_content
                                            }):	(questions.listening_options[i].option_content.split(".").pop())=="jpeg" ? 
                                            $("<img>", {
                                                id: "lis"+questions.listening_options[i].id,
                                                class:"lisImg",
                                                src:
                                                    serverName +
                                                    "/cover_img/" +
                                                    questions.listening_options[i].option_content
                                            }):(questions.listening_options[i].option_content.split(".").pop())=="jpg" ? 
                                            $("<img>", {
                                                id: "lis"+questions.listening_options[i].id,
                                                class:"lisImg",
                                                src:
                                                    serverName +
                                                    "/cover_img/" +
                                                    questions.listening_options[i].option_content
                                            }):"<span class='option' id=lis"+questions.listening_options[i].id+">"+questions.listening_options[i].option_content+"</span>"
                                        ),
                                    ).append("<span id=lisRight"+questions.listening_options[i].id+"></span><br>"))
                                // );
                            }


                            qNo=qNo+1;
                        })
                    }
                    // listening part ends here 



                    // apply border to student answer and right answer

                    for(i=0;i<listeningAnswerId.length;i++){
                        $("#lis"+listeningAnswerId[i]).css("border","2px solid green")
                    }
                    
                } else {
                    // when it does not match
                    console.log(result);
                }
            },
        });


        // on click reading edit button 

        // for group 
        $("#adminEditContainer").on("click",".editReadingGroupBtn",function(){
            $("#editGroupDialog").dialog("open");
            let editGroupId = $(this).attr("data");
            let editGroupOldName = $(this).siblings(".group-title").html(); 

            $("#inputEditGroup").val(editGroupOldName);
            $("#editGroupId").val(editGroupId);
        });

        $("#saveEditGroup").click(function(){
            
            let changedName = $("#inputEditGroup").val();
		    let changeId = $("#editGroupId").val();
            $.ajax({
                method: "POST",
                url: serverName + "/api/edit-question-group/" + changeId,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                data: {
                    group_name: changedName,
                },
                cache: false,
                success: function (result) {
                    //checking email password
                    if (result.status) {
                        //when it does match
                        $("#editGroupDialog").dialog("close");
                        alert("The group name has been edited");
                        location.reload();
                    } else {
                        //when it does not match
                    }
                },
            });
        });

        $("#adminEditContainer").on("click",".editListeningGroupBtn",function(){
            $("#editLisGroupDialog").dialog("open");
            let editGroupId = $(this).attr("data");
            let editGroupOldName = $(this).siblings(".group-title").html(); 

            $("#inputLisEditGroup").val(editGroupOldName);
            $("#editLisGroupId").val(editGroupId);
        });

        $("#saveEditLisGroup").click(function(){

            let formGDatas = new FormData();
            
            let changedName = $("#inputLisEditGroup").val();
		    let changeId = $("#editLisGroupId").val();

            formGDatas.append('group_name',changedName);
		    formGDatas.append('group_image',$("#fileLisEditGroup")[0].files[0]);

            fetch(serverName + "/api/edit-listening-group/" + changeId, {
				method: "POST",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
					Accept: "application/json",
				},
				body: formGDatas,
			})
				.then((response) => response.json())
				.then((json) => {
					$("#editLisGroupDialog").dialog("close");
                    alert("The group name has been edited");
                    location.reload();
				})
				.catch((err) => console.log(err));
        })

        // group ends 

        // reading question starts 
        $("#adminEditContainer").on("click",".editRedQuesBtn",function(){
            let questionNo = $(this).attr("data");

            $.ajax({
                method: "GET",
                url: serverName + "/api/individual-reading-question/"+questionNo,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                cache: false,
                success: function (result) {
                    //checking email password
                    if (result.status) {
                        //when it does match
                        console.log(result);
                        $("#inputRedQues").val(result.question.question_content);
                        $("#inputRedIns").val(result.question.question_instruction);
                        $("#editRedQuesId").val(questionNo);
                        $("#option1").val(result.question.reading_options[0].reading_options_content);
                        $("#rightAnswer-1").addClass("id-"+result.question.reading_options[0].id);

                        $("#option2").val(result.question.reading_options[1].reading_options_content);
                        $("#rightAnswer-2").addClass("id-"+result.question.reading_options[1].id);

                        $("#option3").val(result.question.reading_options[2].reading_options_content);
                        $("#rightAnswer-3").addClass("id-"+result.question.reading_options[2].id);

                        $("#option4").val(result.question.reading_options[3].reading_options_content);
                        $("#rightAnswer-4").addClass("id-"+result.question.reading_options[3].id);

                        $("#rightAnswer-"+result.question.reading_answer.option_number+"").prop("checked",true);
                        $("#editRedQuesAnsId").val(result.question.reading_answer.reading_options_id);

                        $("#editRedQuesDialog").dialog("open");
                    } else {
                        //when it does not match
                        console.log(result)
                    }
                },
            });
        });

        $("#saveEditRedQues").click(function(){
            let formGDatas = new FormData();

            let changeId= $("#editRedQuesId").val();
            formGDatas.append('question_instruction',$("#inputRedIns").val());
            formGDatas.append('question_content',$("#inputRedQues").val());
            formGDatas.append('option1',$("#option1").val());
            formGDatas.append('option2',$("#option2").val());
            formGDatas.append('option3',$("#option3").val());
            formGDatas.append('option4',$("#option4").val());
            formGDatas.append('answers',$('input[type=radio][name=rightAnswerRed]:checked').attr('id').split("-")[1]);
            formGDatas.append('questionfile',$("#inputRedFile")[0].files[0]);
            formGDatas.append('option_id',$('input[type=radio][name=rightAnswerRed]:checked').attr('class').split("-")[1]);

            fetch(serverName + "/api/individual-reading-question-edit/" + changeId, {
				method: "POST",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
					Accept: "application/json",
				},
				body: formGDatas,
			})
				.then((response) => response.json())
				.then((json) => {
					$("#editRedQuesDialog").dialog("close");
                    alert("The question has been edited");
                    location.reload();
				})
				.catch((err) => console.log(err));
        })


        // reading question ends 


        // reading question begins 

        $("#adminEditContainer").on("click",".editLisQuesBtn",function(){
            console.log($(this).attr("data"));
            let questionNo = $(this).attr("data");

            $.ajax({
                method: "GET",
                url: serverName + "/api/view-individual-listening-question/"+questionNo,
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                cache: false,
                success: function (result) {
                    //checking email password
                    if (result.status) {
                        //when it does match
                        console.log(result);
                        // $("#inputRedQues").val(result.question.question_content);
                        // $("#inputRedIns").val(result.question.question_instruction);
                        // $("#editRedQuesId").val(questionNo);
                        // $("#option1").val(result.question.reading_options[0].reading_options_content);
                        // $("#rightAnswer-1").addClass("id-"+result.question.reading_options[0].id);

                        // $("#option2").val(result.question.reading_options[1].reading_options_content);
                        // $("#rightAnswer-2").addClass("id-"+result.question.reading_options[1].id);

                        // $("#option3").val(result.question.reading_options[2].reading_options_content);
                        // $("#rightAnswer-3").addClass("id-"+result.question.reading_options[2].id);

                        // $("#option4").val(result.question.reading_options[3].reading_options_content);
                        // $("#rightAnswer-4").addClass("id-"+result.question.reading_options[3].id);

                        // $("#rightAnswer-"+result.question.reading_answer.option_number+"").prop("checked",true);
                        // $("#editRedQuesAnsId").val(result.question.reading_answer.reading_options_id);

                        // $("#editRedQuesDialog").dialog("open");
                    } else {
                        //when it does not match
                        console.log(result)
                    }
                },
            });
        });


        // listening question ends 



        // editLisGroupDialog
        

    }

})