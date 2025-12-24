document.addEventListener("DOMContentLoaded", function () {
    const questions = document.querySelectorAll(".faq-question");

    questions.forEach(question => {
        question.addEventListener("click", function () {
            
            const answer = this.nextElementSibling;

            if (answer.classList.contains("active")) {
                answer.classList.remove("active");
            } else {
                document.querySelectorAll(".faq-answer").forEach(item => item.classList.remove("active"));
                answer.classList.add("active");
            }
        });
    });
});
