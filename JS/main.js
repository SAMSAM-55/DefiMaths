// Import external componenets for file loading system and some utitlity functions
import * as api from './load-api.js';
import * as lib from './utility-lib.js';

// Variables definiftions
const quizContainer = document.querySelector('.quiz-main');
let timerInterval;
let animationFrameId;
let NumberOfQuestions = api.get_num_questions();
let IsLastAnswerCorrect = false;
let canAnswer = true;
let CurrentQuestion = 0;
let answerStreak = 0;
let score = 0;
let selectedAnswer = null;
globalThis.selectedAnswer = selectedAnswer;
let hasAnswered = false;



document.addEventListener('DOMContentLoaded', () => {
    api.get_selected_quiz_data()
    .then(data => {
        initializeQuiz(data);
    })
    .catch(error => {
        console.log("File path : ", api.get_file_path())
        console.error('Error:', error);
    });
});

function show_question(list, index) {
    const question = list[index];

    if (!question || !question.options || !list[index]) {
        console.error('Question or options not found');
        return;
        
    }


    const questionElement = document.createElement('div');
    questionElement.classList.add('answer-container');

    const optionsWithIndex = question.options.map((option, i) => ({ option, index: i }));
    const shuffledOptions = lib.shuffleArray(optionsWithIndex);
    if (question.answerType === "multipleOptions") {
        questionElement.innerHTML = `
            <h2 class="main-question-text">Question ${index + 1}: ${question.question}</h2>
            <progress class="timer" id="timer" value="0" max="100"></progress>
            <ul class="quiz-answer-list" correct-answer="${question.correctAnswer-1}">
                ${shuffledOptions.map(({ option, index }) => `
                        <button class="quiz-answer-button" style="--border-color:black;" correct-answer=${index == question.correctAnswer - 1}>
                            <a class="answer-button-text" answer-index=${index}>${option}</a>
                            <span class="answer-indicator"><i class="fa-regular fa-circle-xmark"></i></span>
                        </button>
                `).join('')}
            </ul>
            <div class="quiz-utility-buttons-container">
                <button class="quiz-utility-button" id="next-question" onclick="nextQuestion(quizData)"><p class="quiz-utility-button-text">Quest Suivante <i class="fa-solid fa-arrow-right"></i></p></button>
                <button class="quiz-utility-button" id="submitt-answer" onclick="checkAnswer(globalThis.selectedAnswer, 'answer submitted')"><p class="quiz-utility-button-text">Valider Réponse</p></button>
            </div>
            <div class="quiz-score-container">
                <p class="quiz-score-text">Score: <span id="score">0</span></p>
                <p class="quiz-question-text">Question: <span id="question-index">0</span></p>    
            </div>
        `;
        return [question.time*1000, questionElement];
    }
}

// Fonction pour initialiser le quiz avec les données
function initializeQuiz(data) {
    if (!quizContainer) {
        console.error('Element .quiz-main non trouvé');
        return;
    }
    quizContainer.innerHTML = `<h1>${data.quizTitle}</h1>`;
    // Add the first question

    const question_list = lib.pickrandomQuestions(data.questions, NumberOfQuestions);
    globalThis.question_list = question_list;
    const question_data = show_question(question_list, 0);
    quizContainer.appendChild(question_data[1]);
    MathJax.typeset();
    updateScoreandQuestionLabels();
    globalThis.quizData = data;
    startTimer(question_data[0]);

    skipQuestions();
}

// Test function for skipping the questions (debugging purposes only)

function skipQuestions() {
    for (let i = 0; i < NumberOfQuestions; i++) {
        score += 1.5;
        hasAnswered = true;
        nextQuestion(quizData);
    }
}

// Function for starting timer
function startTimer(duration) {
    globalThis.currentTime
    const timerElement = document.getElementById('timer');
    const startTime = Date.now();
    const endTime = startTime + duration;

    function updateTimer() {
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;
        const progress = Math.max(0, (remainingTime / duration) * 100);
        timerElement.value = progress;

        if (remainingTime > 0) {
            animationFrameId = requestAnimationFrame(updateTimer);
        } else {
            clearInterval(timerInterval);
            cancelAnimationFrame(animationFrameId);
            timerElement.value = 0;
            checkAnswer(selectedAnswer, 'timer end');
        }
    }

    updateTimer();

    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            cancelAnimationFrame(animationFrameId);
            timerElement.value = 0;
            canAnswer = false;
            checkAnswer(selectedAnswer, 'timer end');
        }
    }, 1000);
}

// Function for checking the answer
function checkAnswer(button, trigger) {
    if (!button || hasAnswered) {
        show_answer();
        hasAnswered = true
        return;
    }

    if (trigger == 'timer end') {
        show_answer();
    }
    
    else if (trigger == 'answer submitted') {
        if (button.getAttribute('correct-answer') == 'true') {
            IsLastAnswerCorrect = true;
            answerStreak++;
            let timeRemaining = document.getElementById('timer').value/100;
            score += (timeRemaining > 0.75 ? 10 : timeRemaining*10.25);
            updateScoreandQuestionLabels();
            show_answer();
        } else {
            IsLastAnswerCorrect = false;
            show_answer();
        }
    }

    cancelAnimationFrame(animationFrameId);
    canAnswer = false;

    if (!IsLastAnswerCorrect && button.querySelector('.answer-indicator')) {
        button.style.setProperty('--border-color', 'red');
        button.querySelector('.answer-indicator').classList.add('answered');
        button.querySelector('.answer-indicator').innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
    }

    hasAnswered = true;
}

function show_answer() {
    Array.from(document.getElementsByClassName('quiz-answer-button')).forEach((current_btn) => {
        if (current_btn.getAttribute('correct-answer') === 'true') {
            current_btn.style.setProperty('--border-color', 'green');
            current_btn.querySelector('.answer-indicator').classList.add('answered');
            current_btn.querySelector('.answer-indicator').innerHTML = '<i class="fa-regular fa-circle-check"></i>';
        }});
        
        canAnswer = false;

}

// Function for going to the next question
function nextQuestion(data) {

    if (!hasAnswered) {
        return;        
    }

    hasAnswered = false;
    if (CurrentQuestion < NumberOfQuestions - 1) {
        CurrentQuestion++;
        const question_data = show_question(question_list, CurrentQuestion);
        const question = question_data[1];
        quizContainer.innerHTML = '';
        quizContainer.appendChild(question);
        MathJax.typeset();
        canAnswer = true;
        startTimer(question_data[0]);
        updateScoreandQuestionLabels();

    } else {
        quizContainer.innerHTML = `<h2>Fin du quiz!</h2>
        <span class=end-score-text> Votre score : 
            <span class="main-score-container">
                <span class="score-integer-container"></span>
                <span class="score-text">.</span>
                <span class="score-decimal-digit" value=0></span>
                <p class="max-score-text"> / ${NumberOfQuestions*10} </p>
            </span>
        </span>`;
        lib.animate_score(score, NumberOfQuestions*10);
    }
}

function updateScoreandQuestionLabels() {
    document.getElementById('question-index').innerHTML = `${CurrentQuestion+1} / ${NumberOfQuestions}`;
    document.getElementById('score').innerHTML = lib.round(score, 1);
}

document.addEventListener('click', (event) => {
    if ((event.target.classList.contains('quiz-answer-button') || event.target.classList.contains('answer-button-text')) && canAnswer) {
        selectedAnswer = event.target;
        globalThis.selectedAnswer = selectedAnswer
        clearInterval(timerInterval);

        const btn = event.target.classList.contains('quiz-answer-button')
          ? event.target
          : event.target.closest('.quiz-answer-button');

        document.querySelectorAll('.quiz-answer-button').forEach((button) => {
            button.classList.remove('selected');
        });
        btn.classList.add('selected');

    } else if ((event.target.classList.contains('quiz-answer-button') || event.target.classList.contains('answer-button-text')) && !canAnswer) {
    }
});

// Declaring the checkAnswer and nextQuestion functions in  the global scope to enable calls from html buttons
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
