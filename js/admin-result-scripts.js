var readingAnswerId = [];
var listeningAnswerId = [];

var studentReadingId = [];
var studentListeningId = [];

$(document).ready(function() {
    
	var loggedInUser = localStorage.getItem("userName");
	var loggedInUserRole = localStorage.getItem("userRole");
    var loggedInUserId = localStorage.getItem("userId");

    
    var uri = decodeURIComponent(window.location.search);

    console.log(uri)

    if (loggedInUserRole == "admin") {
        if(uri){
            var uriComp = uri.split("&");
            var resultId = uriComp[0].split("=")[1];
            var studentName = uriComp[1].split("=")[1];
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
            url: serverName + "/api/individual-result/"+resultId,
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            cache: false,
            success: function (result) {
                //checking email password
                if (result.status) {
                    //when it does match

                    var mainResult = result.result[0];
                    let setDate = mainResult.created_at;
                    let setName = mainResult.sets.name;

                    // for reading part 
                    for (var i=0;i<mainResult.sets.reading_group.length;i++){
                        // console.log(mainResult.sets.reading_group[i]);

                        $("#adminResultContainer")
                        .append(
                            $("<div class='question-part readingQuestionPart'>")
                            .append($("<h4 class='group-title'>").html(
                                mainResult.sets.reading_group[i].group_text
                            ))
                        );

                        $.each(mainResult.sets.reading_group[i].reading_questions, function(
                            i,
                            questions
                        ) {
                            readingAnswerId.push(questions.reading_answer.reading_options_id);
                            
                            $("#adminResultContainer")
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

                            // for reading options 
                            for (var i=0;i<questions.reading_options.length;i++){
                                $("#adminResultContainer")
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

                    // for listening part 
                    for (var i=0;i<mainResult.sets.listening_group.length;i++){
                        // console.log(mainResult.sets.reading_group[i]);

                        $("#adminResultContainer")
                        .append(
                            $("<div class='question-part readingQuestionPart'>")
                            .append($("<h4 class='group-title'>").html(
                                mainResult.sets.listening_group[i].group_text
                            ))
                            .append(
                                (mainResult.sets.listening_group[i].group_image ? 
                                    $("<img>", {
                                        class: "lisGroupImage",
                                        src:
                                            serverName +
                                            "/cover_img/" +
                                            mainResult.sets.listening_group[i].group_image
                                    }):'<div></div>'	
                                )
                            )
                        );

                        $.each(mainResult.sets.listening_group[i].listening_questions, function(
                            i,
                            questions
                        ) {
                            listeningAnswerId.push(questions.listening_answer.listening_options_id);
                            
                            $("#adminResultContainer")
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

                            // for reading options 
                            for (var i=0;i<questions.listening_options.length;i++){
                                $("#adminResultContainer")
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

                    // calculating right answers 

                    for(i=0;i<result.result[0].reading_answers.length;i++){
                        studentReadingId.push(result.result[0].reading_answers[i].reading_answer_id);
                    }

                    for(i=0;i<result.result[0].listening_answers.length;i++){
                        studentListeningId.push(result.result[0].listening_answers[i].listening_answer_id);
                    }

                    // console.log(readingAnswerId,studentReadingId,listeningAnswerId,studentListeningId);

                    // apply border to student answer and right answer 

                    for(i=0;i<readingAnswerId.length;i++){
                        $("#red"+readingAnswerId[i]).css("border","2px solid green")
                    }

                    for(i=0;i<studentReadingId.length;i++){
                        $("#red"+studentReadingId[i]).append(' &#10004;');
                    }

                    for(i=0;i<listeningAnswerId.length;i++){
                        $("#lis"+listeningAnswerId[i]).css("border","2px solid green")
                    }

                    for(i=0;i<studentListeningId.length;i++){
                        $("#lisRight"+studentListeningId[i]).html(' &#10004;');
                    }

                    $("#setName").html("Set Name:- "+setName);
                    $("#setDate").html("Date:- "+setDate);
                    $("#studentName").html("Student Name:- "+studentName);
                    
                } else {
                    // when it does not match
                    console.log(result);
                }
            },
        });
    }

})