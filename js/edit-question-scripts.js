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

    $("#editLisQuesTextDialog").dialog({
		autoOpen: false,
		show: {},
		hide: {},
	}).prev(".ui-dialog-titlebar").css({"background":"blue","color":"white"});

    $("#editLisQuesImgDialog").dialog({
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
                    // console.log(result);
                    alert("error");
                    location.reload();
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
                                    .append("<span id=lis"+questions.listening_options[i].id+">"+(i+1)+". </span>")
                                    .append(
                                        // $("<span class='option' id="+questions.listening_options[i].id+">").html(
                                        // "- "+questions.listening_options[i].option_content
                                        ((questions.listening_options[i].option_content==null)?"":(questions.listening_options[i].option_content.split(".").pop())=="png" ? 
                                            $("<img>", {
                                                class:"lisImg",
                                                src:
                                                    serverName +
                                                    "/cover_img/" +
                                                    questions.listening_options[i].option_content
                                            }):	(questions.listening_options[i].option_content.split(".").pop())=="jpeg" ? 
                                            $("<img>", {
                                                class:"lisImg",
                                                src:
                                                    serverName +
                                                    "/cover_img/" +
                                                    questions.listening_options[i].option_content
                                            }):(questions.listening_options[i].option_content.split(".").pop())=="jpg" ? 
                                            $("<img>", {
                                                class:"lisImg",
                                                src:
                                                    serverName +
                                                    "/cover_img/" +
                                                    questions.listening_options[i].option_content
                                            }):"<span class='option'>"+questions.listening_options[i].option_content+"</span>"
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


        // listening question begins 

        $("#adminEditContainer").on("click",".editLisQuesBtn",function(){
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
                        if(result.question.listening_options[0].option_content==null||result.question.listening_options[1].option_content==null||result.question.listening_options[2].option_content==null||result.question.listening_options[3].option_content==null){
                            $("#lisTextQues").val(result.question.question_content);
                        
                            $("#lisTextId").val(questionNo);

                            $("#lisTextOption1").val(result.question.listening_options[0].option_content);
                            $("#lisTextrightAnswer-1").addClass("id-"+result.question.listening_options[0].id);

                            $("#lisTextOption2").val(result.question.listening_options[1].option_content);
                            $("#lisTextrightAnswer-2").addClass("id-"+result.question.listening_options[1].id);

                            $("#lisTextOption3").val(result.question.listening_options[2].option_content);
                            $("#lisTextrightAnswer-3").addClass("id-"+result.question.listening_options[2].id);

                            $("#lisTextOption4").val(result.question.listening_options[3].option_content);
                            $("#lisTextrightAnswer-4").addClass("id-"+result.question.listening_options[3].id);

                            $("#lisTextrightAnswer-"+result.question.listening_answer.option_number+"").prop("checked",true);
                            $("#lisTextAnsId").val(result.question.listening_answer.reading_options_id);

                            $("#editLisQuesTextDialog").dialog("open");
                        }
                        else if(result.question.listening_options[0].option_content.split(".").pop()=="png"||result.question.listening_options[0].option_content.split(".").pop()=="jpeg"||result.question.listening_options[0].option_content.split(".").pop()=="jpg"){

                            $("#lisImgQues").val(result.question.question_content);
                        
                            $("#lisImgId").val(questionNo);

                            $("#lisImgrightAnswer-1").addClass("id-"+result.question.listening_options[0].id);

                            $("#lisImgrightAnswer-2").addClass("id-"+result.question.listening_options[1].id);

                            $("#lisImgrightAnswer-3").addClass("id-"+result.question.listening_options[2].id);

                            $("#lisImgrightAnswer-4").addClass("id-"+result.question.listening_options[3].id);

                            $("#lisImgrightAnswer-"+result.question.listening_answer.option_number+"").prop("checked",true);
                            $("#lisImgAnsId").val(result.question.listening_answer.reading_options_id);

                            $("#editLisQuesImgDialog").dialog("open");

                        }else{

                            $("#lisTextQues").val(result.question.question_content);
                        
                            $("#lisTextId").val(questionNo);

                            $("#lisTextOption1").val(result.question.listening_options[0].option_content);
                            $("#lisTextrightAnswer-1").addClass("id-"+result.question.listening_options[0].id);

                            $("#lisTextOption2").val(result.question.listening_options[1].option_content);
                            $("#lisTextrightAnswer-2").addClass("id-"+result.question.listening_options[1].id);

                            $("#lisTextOption3").val(result.question.listening_options[2].option_content);
                            $("#lisTextrightAnswer-3").addClass("id-"+result.question.listening_options[2].id);

                            $("#lisTextOption4").val(result.question.listening_options[3].option_content);
                            $("#lisTextrightAnswer-4").addClass("id-"+result.question.listening_options[3].id);

                            $("#lisTextrightAnswer-"+result.question.listening_answer.option_number+"").prop("checked",true);
                            $("#lisTextAnsId").val(result.question.listening_answer.reading_options_id);

                            $("#editLisQuesTextDialog").dialog("open");

                        }
                    } else {
                        //when it does not match
                        console.log(result)
                    }
                },
            });
        });

        $("#saveEditLisText").click(function(){
            let formGDatas = new FormData();

            let changeId= $("#lisTextId").val();
            formGDatas.append('question_content',$("#lisTextQues").val());
            formGDatas.append('option1',$("#lisTextOption1").val());
            formGDatas.append('option2',$("#lisTextOption2").val());
            formGDatas.append('option3',$("#lisTextOption3").val());
            formGDatas.append('option4',$("#lisTextOption4").val());
            formGDatas.append('answers',$('input[type=radio][name=rightAnswerLisText]:checked').attr('id').split("-")[1]);
            formGDatas.append('questionImage',$("#lisTextFile")[0].files[0]);
            formGDatas.append('audioFile',$("#lisTextAudio")[0].files[0]);
            formGDatas.append('option_id',$('input[type=radio][name=rightAnswerLisText]:checked').attr('class').split("-")[1]);

            fetch(serverName + "/api/individual-listening-question-edit/" + changeId, {
				method: "POST",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
					Accept: "application/json",
				},
				body: formGDatas,
			})
				.then((response) => response.json())
				.then((json) => {
                    console.log(json)
					$("#editLisQuesTextDialog").dialog("close");
                    alert("The question has been edited");
                    location.reload();
				})
				.catch((err) => console.log(err));
        });

        $("#saveEditLisImg").click(function(){
            let formGDatas = new FormData();

            let changeId= $("#lisImgId").val();
            formGDatas.append('question_content',$("#lisImgQues").val());
            formGDatas.append('option1',$("#lisImgOption1")[0].files[0]);
            formGDatas.append('option2',$("#lisImgOption2")[0].files[0]);
            formGDatas.append('option3',$("#lisImgOption3")[0].files[0]);
            formGDatas.append('option4',$("#lisImgOption4")[0].files[0]);
            formGDatas.append('answers',$('input[type=radio][name=rightAnswerLisImg]:checked').attr('id').split("-")[1]);
            formGDatas.append('questionImage',$("#lisImgFile")[0].files[0]);
            formGDatas.append('audioFile',$("#lisImgAudio")[0].files[0]);
            formGDatas.append('option_id',$('input[type=radio][name=rightAnswerLisImg]:checked').attr('class').split("-")[1]);

            console.log($("#lisImgOption1")[0].files[0])

            fetch(serverName + "/api/individual-listening-question-edit/" + changeId, {
				method: "POST",
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
					Accept: "application/json",
				},
				body: formGDatas,
			})
				.then((response) => response.json())
				.then((json) => {
                    console.log(json)
					$("#editLisQuesTextDialog").dialog("close");
                    alert("The question has been edited");
                    location.reload();
				})
				.catch((err) => console.log(err));
        })

        // listening question ends 



        // editLisGroupDialog
        

    }

})