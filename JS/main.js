// This file contains the main logic for the quiz application.
// It handles the quiz initialization, question display, answer checking, and score calculation.
// It also manages the timer and user interactions with the quiz interface.
import * as api from './quiz-data-handler.js';
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


// Script to load the quiz data and initialize the quiz when the page is loaded.
document.addEventListener('DOMContentLoaded', () => {
    api.get_selected_quiz_data()
    .then(data => {
        initializeQuiz(data);
    })
    .catch(error => {
        // Handle the error and redirect to the index page with a toast message
        console.error('Error:', error, '\nSelected file path:', api.get_selected_quiz_path());
        const toast_type = 'error';
        const toast_title = 'Erreur';
        const toast_message = 'Une erreur interne est survenue lors du chargement du quiz';
        const url = new URL(window.location.origin + '/index.html'); // Dynamically construct the URL
        url.searchParams.append('toast', 'true');
        url.searchParams.append('toast-type', toast_type);
        url.searchParams.append('toast-title', toast_title);
        url.searchParams.append('toast-message', toast_message);
        // Redirect to the index page with toast parameters
        window.location.href = url.toString();
        return;
    });
});

// Function to show the question and its options
// It creates the HTML structure for the question and options, shuffles the options, and sets up the timer.
// It also handles the display of the score and question number.
// @params list: The list of questions.
// @params index: The index of the current question.
// @returns: An array containing the duration of the question, the question element, and the question data.
function show_question(list, index) {
    let question = list[index];

    if (!question || (!question.options && question.answerType === "multipleOptions") || !list[index]) {
        console.error('Question or options not found');
        return;
        
    }

    // Create the question element
    const questionElement = document.createElement('div');
    questionElement.classList.add('answer-container');
    
    // Logic to display the question and options for multiple choice type
    if (question.answerType === "multipleOptions") {
        const optionsWithIndex = question.options.map((option, i) => ({ option, index: i })); // Maps options to their indices
        const shuffledOptions = lib.shuffleArray(optionsWithIndex); // Shuffles the options

        // Display the question and options
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
            </div>
            <div class="quiz-score-container">
                <p class="quiz-score-text">Score: <span id="score">0</span></p>
                <p class="quiz-question-text">Question: <span id="question-index">0</span></p>    
            </div>
        `;

        // Set the next question button text to results (resultats in French) if it's the last question
        if (index+1 == NumberOfQuestions) {
            questionElement.querySelector('.quiz-utility-buttons-container').innerHTML = `
                <button class="quiz-utility-button" id="finish-quiz" onclick="nextQuestion(quizData)">
                <p class="quiz-utility-button-text">Résultats <i class="fa-solid fa-arrow-right"></i></p>
                <button class="quiz-utility-button" id="submit-answer" onclick="checkAnswer(globalThis.selectedAnswer, 'answer submitted')">
                <p class="quiz-utility-button-text">Valider</p>
                </button>
                </button>
            `;
        } else {
            questionElement.querySelector('.quiz-utility-buttons-container').innerHTML = `
                <button class="quiz-utility-button" id="next-question" onclick="nextQuestion(quizData)">
                <p class="quiz-utility-button-text">Question Suivante <i class="fa-solid fa-arrow-right"></i></p>
                </button>
                <button class="quiz-utility-button" id="submit-answer" onclick="checkAnswer(globalThis.selectedAnswer, 'answer submitted')">
                <p class="quiz-utility-button-text">Valider</p>
                </button>
            `;
        }

        return [question.time*1000, questionElement, question];
    }

    // Logic to display the question and input for free answer type
    else if (question.answerType === "freeAnswer") {
        questionElement.innerHTML = `
            <h2 class="main-question-text">Question ${index + 1}: ${question.question}</h2>
            <progress class="timer" id="timer" value="0" max="100"></progress>
            <label for="answer-input">Votre réponse :</label>
            <input autocomplete="off" type="text" class="answer-input" id="answer-input" correct-answer="${question.correctAnswer}"></input>
            <p class="correct-answer-text">La bonne réponse est : ${question.correctAnswer}</p>
            <div class="quiz-utility-buttons-container">
            </div>
            <div class="quiz-score-container">
                <p class="quiz-score-text">Score: <span id="score">0</span></p>
                <p class="quiz-question-text">Question: <span id="question-index">0</span></p>    
            </div>
        `;

        // Same logic for the next question button
        if (index+1 == NumberOfQuestions) {
            questionElement.querySelector('.quiz-utility-buttons-container').innerHTML = `
                <button class="quiz-utility-button" id="finish-quiz" onclick="nextQuestion(quizData)">
                <p class="quiz-utility-button-text">Résultats <i class="fa-solid fa-arrow-right"></i></p>
                </button>
                <button class="quiz-utility-button" id="submit-answer" onclick="checkAnswer('', 'answer submitted')">
                <p class="quiz-utility-button-text">Valider</p>
                </button>
            `;
        } else {
            questionElement.querySelector('.quiz-utility-buttons-container').innerHTML = `
                <button class="quiz-utility-button" id="next-question" onclick="nextQuestion(quizData)">
                <p class="quiz-utility-button-text">Question Suivante <i class="fa-solid fa-arrow-right"></i></p>
                </button>
                <button class="quiz-utility-button" id="submit-answer" onclick="checkAnswer('placeholder', 'answer submitted')">
                <p class="quiz-utility-button-text">Valider</p>
                </button>
            `;
        }

        return[question.time*1000, questionElement, question]
    }
}

// Function to initialize the quiz
// It sets up the quiz title, loads the first question, and starts the timer.
// @params data: The quiz data object containing the quiz title and questions.
function initializeQuiz(data) {
    if (!quizContainer) {
        console.error('Element .quiz-main non trouvé');
        return;
    }
    quizContainer.innerHTML = `<h1>${data.quizTitle}</h1>`; // Set the quiz title

    const question_list = lib.pickrandomQuestions(data.questions, NumberOfQuestions); // Pick random questions from the quiz data
    globalThis.question_list = question_list;
    const question_data = show_question(question_list, 0); // Show the first question
    globalThis.question = question_data[2] // Store the question data in a global variable
    quizContainer.appendChild(question_data[1]); // Append the question element to the quiz container
    MathJax.typeset();
    updateScoreandQuestionLabels();
    globalThis.quizData = data; // Store the quiz data in a global variable
    startTimer(question_data[0]); // Start the timer for the question

}

// Test function for skipping the questions (debugging purposes only)
function skipQuestions() {
    for (let i = 0; i < NumberOfQuestions; i++) {
        score += 9.4;
        hasAnswered = true;
        nextQuestion(quizData);
    }
}

// Function to start the timer
// It updates the timer display and checks if the time is up.
// @params duration: The duration of the timer in milliseconds.
function startTimer(duration) {
    globalThis.currentTime // Initialise the current time variable
    const timerElement = document.getElementById('timer');
    const startTime = Date.now();
    const endTime = startTime + duration;

    // Function to update the timer display
    // It calculates the remaining time and updates the progress bar.
    // It also checks if the time is up and calls the checkAnswer function.
    function updateTimer() {
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;
        const progress = Math.max(0, (remainingTime / duration) * 100);
        timerElement.value = progress;

        if (remainingTime > 0) {
            animationFrameId = requestAnimationFrame(updateTimer); // Update the timer display using requestAnimationFrame for smooth animation
        } else {
            // Clear the timer and cancel the animation frame if the time is up
            clearInterval(timerInterval);
            cancelAnimationFrame(animationFrameId);
            timerElement.value = 0;
            checkAnswer((globalThis.question.answerType === "multipleOptions" ? globalThis.selectedAnswer : globalThis.selectedAnswer ?? 'placeholder'), 'timer end'); // Call the checkAnswer function to handle the time up case
        }
    }

    updateTimer(); // Start the timer display update

    // Set up the timer interval to check the remaining time every second
    timerInterval = setInterval(() => {
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;
        if (hasAnswered) {
            clearInterval(timerInterval);
            return;
        }

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            cancelAnimationFrame(animationFrameId);
            timerElement.value = 0;
            canAnswer = false;
            checkAnswer((globalThis.question.answerType === "multipleOptions" ? globalThis.selectedAnswer : globalThis.selectedAnswer ?? 'placeholder'), 'timer end');
        }
    }, 1000);
}

// Function to handle the correct answer
// It updates the score and answer streak (the answer streak is currently unused but you can implement it if you want to).
// It also updates the score display.
function onCorrectAnswer() {
    IsLastAnswerCorrect = true;
    answerStreak++;   
    let timeRemaining = document.getElementById('timer').value/100;
    score += (timeRemaining > 0.75 ? 10 : (timeRemaining+0.25)*10);
    document.getElementById('score').innerHTML = lib.round(score, 1);
}

// Function for checking the answer
// It handles the answer checking logic for both multiple choice and free answer types.
// It updates the score, shows the correct answer, and handles the next question logic.
// @params button: The button clicked by the user.
// @params trigger: The trigger for the answer checking (timer end or answer submitted).
function checkAnswer(button, trigger) {
    // Check if the answer has already been submitted or if no button was clicked and do nothing
    if ((button === null && question.answerType === "multipleOptions" && trigger != 'timer end') || hasAnswered) {
        return;
    }

    // Check if the timer has ended and the answer type is multiple choice
    if (trigger == 'timer end' && button === null && question.answerType === "multipleOptions") {
        show_answer(); // Show the correct answer
        canAnswer = false;
        hasAnswered = true;
        return;
    }
    
    // Check if the answer is submitted or the timer has ended and a button was clicked
    if (trigger == 'answer submitted' || trigger == 'timer end' && button !== null) {
        if (question.answerType === "multipleOptions") {
            if (button.getAttribute('correct-answer') == 'true') {
                onCorrectAnswer(); // Correct answer
                show_answer(); // Show the correct answer
            } else {
                IsLastAnswerCorrect = false;
                show_answer(); // Show the correct answer
            }
        }

        // Logic for free answer type
        else if (question.answerType === "freeAnswer") {
            const answerInput = document.getElementsByClassName('answer-input')[0];
            const submittedAnswer = String(answerInput.value).toLowerCase(); // Get the submitted answer
            const correctAnswer = String(answerInput.getAttribute('correct-answer')).toLowerCase(); // Get the correct answer

            // Do nothing if the answer is empty and the trigger is not 'timer end'
            if (submittedAnswer === '' && trigger != 'timer end') {
                return;
            }

            // Check if the answer is correct
            else if (submittedAnswer === correctAnswer) {
                onCorrectAnswer(); // Correct answer
                answerInput.classList.add('correct'); // Add correct class
            }

            else {
                answerInput.classList.add('incorrect'); // Add incorrect class
                document.getElementsByClassName('correct-answer-text')[0].classList.add('show') // Show the correct answer
            }
        }

    }

    // Cancel the timer animation
    cancelAnimationFrame(animationFrameId);
    canAnswer = false;

    // Highlight the selected answer in red if it's incorrect
    if (question.answerType === "multipleOptions") {
        if (!IsLastAnswerCorrect && button.querySelector('.answer-indicator')) {
            button.style.setProperty('--border-color', 'red');
            button.querySelector('.answer-indicator').classList.add('answered');
            button.querySelector('.answer-indicator').innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
        }
    }

    hasAnswered = true; // Set the hasAnswered flag to true
}

// Function to show the correct answer
// It highlights the correct answer in green and shows the correct answer icon.
function show_answer() {
    Array.from(document.getElementsByClassName('quiz-answer-button')).forEach((current_btn) => { // Loop through all the answer buttons
        if (current_btn.getAttribute('correct-answer') === 'true') {
            current_btn.style.setProperty('--border-color', 'green'); // Set the border color to green if the answer is correct
            current_btn.querySelector('.answer-indicator').classList.add('answered'); // Add the answered class
            current_btn.querySelector('.answer-indicator').innerHTML = '<i class="fa-regular fa-circle-check"></i>'; // Show the correct answer icon
        }});
        
        canAnswer = false; // Set the canAnswer flag to false

}

// Function to handle the next question logic
// It checks if the user has answered the question and updates the current question index.
// It also updates the score and question labels.
// @params data: The quiz data object containing the quiz title and questions.
function nextQuestion(data) {

    // Do nothing if the user has not answered the question
    if (!hasAnswered) {
        return;        
    }

    // Logic to handle the case when the user has answered the question
    hasAnswered = false; // Reset the hasAnswered flag

    // Logic to show the next question if it is not the last question
    if (CurrentQuestion < NumberOfQuestions - 1) {
        CurrentQuestion++;
        const question_data = show_question(question_list, CurrentQuestion);
        const question_element = question_data[1];
        const question = question_data[2]
        globalThis.question = question
        quizContainer.innerHTML = '';
        quizContainer.appendChild(question_element);
        MathJax.typeset();
        canAnswer = true;
        startTimer(question_data[0]);
        updateScoreandQuestionLabels();
        globalThis.selectedAnswer = null;
        selectedAnswer = null;

    // Logic to show the results if it is the last question
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
        lib.animate_score(score, NumberOfQuestions*10, data);
    }
}

// Function to update the score and question labels
function updateScoreandQuestionLabels() {
    document.getElementById('question-index').innerHTML = `${CurrentQuestion+1} / ${NumberOfQuestions}`;
    document.getElementById('score').innerHTML = lib.round(score, 1);
}

// Event listener for the answer buttons
document.addEventListener('click', (event) => {
    const btn = event.target.closest('.quiz-answer-button');
    if (btn && canAnswer) {
        selectedAnswer = btn;
        globalThis.selectedAnswer = selectedAnswer;
        clearInterval(timerInterval);
        document.querySelectorAll('.quiz-answer-button').forEach((button) => {
            button.classList.remove('selected');
        });
        btn.classList.add('selected');
    }
});

// Declaring the checkAnswer and nextQuestion functions in  the global scope to enable calls from html buttons
window.checkAnswer = checkAnswer;
window.nextQuestion = nextQuestion;
