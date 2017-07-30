var QuizEngine = function () {
    var _this = this;

    var optionsMap = {
        A: 0,
        B: 1,
        C: 2,
        D: 3
    };

    var categories = {
        ict: {
            name: "ICT",
            questions: Questions.ICT
        },
        english: {
            name: "English",
            questions: Questions.ENGLISH
        },
        maths: {
            name: "Maths",
            questions: Questions.MATHS
        },
        current_affairs: {
            name: "Current Affairs",
            questions: Questions.CURRENT_AFFAIRS
        }
    };

    function getQuestion(questionsArray, questionNumber) {
        var answer = null;
        for (var i = 0; i < questionsArray.length; i++) {
            var question = questionsArray[i];
            if (question.no == questionNumber) {
                answer = question;
                break;
            }
        }
        return answer;
    }

    return {
        getQuestion: getQuestion,
        optionsMap: optionsMap,
        categories: categories
    }
};

var answer = null;
$(document).ready(function () {
    var quizEngine = new QuizEngine();
    var usedQuestions = [];
    var selectedCategory = null;
    var numberInput = $("#numberInput");

    var ractive = new Ractive({
        el: '#container',
        template: '#question',
        data: {
            question: {}
        }
    });

    var categoryRactive = new Ractive({
        el: '#categories',
        template: '#category',
        data: {
            categories: quizEngine.categories
        }
    });

    numberInput.keyup(function (e) {
        if (e.keyCode == 13) {
            if (selectedCategory == null) {
                alert("Please select a category");
                return;
            }
            var questionNumber = $(this).val().trim();
            // if (usedQuestions.indexOf(questionNumber) < 0) {

            var question = quizEngine.getQuestion(quizEngine.categories[selectedCategory].questions, questionNumber);
            answer = question.answer;
            if (question != null) {
                $(".options")
                    .removeClass("panel-danger panel-success")
                    .addClass("panel panel-default");
                $(".options h2").removeClass("text-danger text-success");
                $(".options h2 span").removeClass("label-danger label-success");
                usedQuestions.push(questionNumber);
                ractive.set('question', question);
            } else {
                alert("Invalid question number.");
            }
            // } else {
            //     alert("That question has been answered.");
            // }
            numberInput.val('');
        }
    });

    var showAnswerBtn = $("#showAnswerBtn");
    showAnswerBtn.click(function () {
        if (selectedCategory != null && answer != null) {
            var answerIndex = quizEngine.optionsMap[answer];

            $(".options").removeClass("panel-default");
            $(".options h2 span").removeClass("label-default");
            for (var i = 0; i < 4; i++) {
                if (i == answerIndex) {
                    $(".options").eq(i).addClass("panel-success");
                    $(".options h2").eq(i).addClass("text-success");
                    $(".options h2 span").eq(i).addClass("label-success");
                } else {
                    $(".options").eq(i).addClass("panel-danger");
                    $(".options h2").eq(i).addClass("text-danger");
                    $(".options h2 span").eq(i).addClass("label-danger");
                }
            }
        }
    });

    $("#categories").on("click", "[data-category]", function () {
        selectedCategory = $(this).data("category");
        $("[data-category]").removeClass("active");
        $(this).addClass("active");
    });

    // Stop Reload
    window.onbeforeunload = function () {
        return "Quiz in progress, you can't leave.";
    }
});