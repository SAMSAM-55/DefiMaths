// This file contains utility functions used in the quiz application, such as score animation, question selection, and progress tracking.

import * as api from './quiz-data-handler.js';
import * as user from './user-information.js';

// Function to get the number of digits in the score
// @param score : The score to get the number of digits from
// @returns : The number of digits in the score
// @example : get_score_digits_number(1234) => 4
function get_score_digits_number(score) {
    const number = score - (score%1);
    return number.toString().length;
}

// Function to get the digit at a specific position in the score
// @param score : The score to get the digit from
// @param position : The position of the digit to get (0 for the first digit, 1 for the second digit, etc.)
// @returns : The digit at the specified position in the score
// @example : get_digit_at_position(1234, 2) => 3
function get_digit_at_position(score, position) {
    let displayed_score = round(score, 1)
    let score_string = displayed_score.toString().replaceAll('.', '')

    if (!position) {
        return score_string[0]
    }

    if (position > 0) {
        return Number(score_string[score_string.length - position - (displayed_score === score ? 0 : 1)])
    } else {
        return Number(score_string[score_string.length - 1])
    }
}

// Function for playing the animation at the end of the quiz
// @param score : The score to animate
function play_animation(score) {
    setTimeout(() => {
        const texts = document.querySelectorAll('.score-text'); // Select all elements with the class 'score-text'
        texts.forEach((current_text) => { // Animating each element
        let digit_position = current_text.getAttribute('score-position'); // Get the position of the digit to animate
        let number = get_digit_at_position(score, digit_position); // Get the corresponding digit in the score
        let score_digits = current_text.querySelectorAll('.score-digit'); // Select all elements with the class 'score-digit' inside the current element
        score_digits.forEach((digit) => {
            let digit_height = digit.getBoundingClientRect().height; // Get the height of the digit element
            digit.style.transform = `translateY(calc(-1px*${number}*(${digit_height})))`; // Animate the digit to its final position
        });
    });
}, 100); // The delay before the animation starts
}

// Function to update the user progress in the database
// @param score : The score to update the progress for
// @param data : The data object containing the quiz information
async function update_progress(score, data) {
    const progress = round(score*1.1 / (data.maxQuestions / 10), 1); // Calculates the progress based on the score and the quiz maximum score (the number that we multiply the score by determines the max progress, here 1.1 gives a maximum of 110%)
    const current_progress = await user.get_user_progress(data.quizID)/10; // Retrieves the current progress from the database

    // If the new progress is greater than the current progress, update the progress in the database
    if (progress > current_progress) {
        user.update_user_progress(data.quizID, progress*10).then((response) => {
            console.log("Server response:", response);
            if (response) {
                const toast_infos = response;
                console.log("Toast infos : ", toast_infos);
                show_toast(toast_infos.title, toast_infos.message, toast_infos.type);
            } else {
                console.error("Failed to update progress.");
                show_toast("Erreur", "Une erreur est survenue lors de la mise à jour de la progression.", "error");
            }
        })
        .catch((error) => {
            console.error("Error updating progress:", error);
            show_toast("Erreur", "Une erreur est survenue lors de la mise à jour de la progression.", "error");
        });
    }
}

// Function used to round the score to a specific number of digits
// @param value : The score to round
// @param precision : The number of digits to round to
// @returns : The rounded score
// @example : round(1234.5678, 2) => 1234.57
export function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

// Function for picking random questions among the declared ones in the json file
// @param allQuestions : The array of questions to pick from
// @param numQuestions : The number of questions to pick
export function pickrandomQuestions(allQuestions, numQuestions) {
    let questions_copy = [...allQuestions]; // Create a copy of the array to avoid modifying the original array
    if (numQuestions > questions_copy.length) {
        console.error("Not enough questions available to select from.");
        return null;
    }
    const selectedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
        const randomIndex = Math.floor(Math.random() * questions_copy.length);
        selectedQuestions.push(questions_copy[randomIndex]);
        questions_copy.splice(randomIndex, 1);
    }
    return selectedQuestions;
    
}

// Function for shuffling arrays used to automatically display possible anwsers in a random order using the Fisher-Yates algorithm
// @param array : The array to shuffle
// @returns : The shuffled array
// @example : shuffleArray([1, 2, 3, 4, 5]) => [3, 1, 4, 5, 2] 
export function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];

    }
    return array;
}

// Function for animating the score at the end of the quiz
// @param score : The score to animate
// @param maxScore : The maximum score of the quiz
export async function animate_score(score, maxScore, data) {
    // Get the score component and the score integer container
    const score_digit_component = document.getElementsByClassName('score-decimal-digit')[0];
    const score_integer_container = document.getElementsByClassName('score-integer-container')[0];
    score_digit_component.innerHTML = '';
    score_integer_container.innerHTML = '';

    // Iterate throught the digits of the score and create the corresponding HTML elements
    for (let i = 0 ; i < get_score_digits_number(score) ; i++) {
        score_integer_container.innerHTML += `<span class="score-integer-digit score-text" score-position=${get_score_digits_number(score) - i}>
        <p class="score-digit" index=0>0</p>
        <p class="score-digit" index=1>1</p>
        <p class="score-digit" index=2>2</p>
        <p class="score-digit" index=3>3</p>
        <p class="score-digit" index=4>4</p>
        <p class="score-digit" index=5>5</p>
        <p class="score-digit" index=6>6</p>
        <p class="score-digit" index=7>7</p>
        <p class="score-digit" index=8>8</p>
        <p class="score-digit" index=9>9</p>
        </span>`;
    }

    score_digit_component.innerHTML = `<span class="score-integer-digit score-text" score-position=0>
    <p class="score-digit" index=0>0</p>
    <p class="score-digit" index=1>1</p>
    <p class="score-digit" index=2>2</p>
    <p class="score-digit" index=3>3</p>
    <p class="score-digit" index=4>4</p>
    <p class="score-digit" index=5>5</p>
    <p class="score-digit" index=6>6</p>
    <p class="score-digit" index=7>7</p>
    <p class="score-digit" index=8>8</p>
    <p class="score-digit" index=9>9</p>
    </span>
    `;

    play_animation(score); // Play the animation for the score
    
    // Add confetti if the score is greater than 90% of the maximum score
    if (score >= maxScore*0.9) {
        confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    await update_progress(score, data); // Update the progress in the database
}

// Function to add the settings for the quiz selection
// @param container : The container to add the settings to
// @param data : The data object containing the quiz information
// @param path : The path to the quiz file
async function add_selection_settings(container, data, path) {
    // Add the info container that holds the description, the progress and the settings for the quiz
    // The setting is the number of questions to display
    let info_container = document.createElement('div');
        info_container.classList.add('quiz-selection-info-container');
        container.appendChild(info_container);

    // Add the quiz description
    let quiz_description = document.createElement('p');
        quiz_description.innerHTML = data.description;
        quiz_description.classList.add('quiz-selection-description');
        info_container.appendChild(quiz_description);

    // Add the quiz settings container that holds the slider and the progress
    // The slider is used to select the number of questions to display
    let settings_container = document.createElement('div');
        settings_container.classList.add('quiz-selection-settings-container');
        info_container.appendChild(settings_container);

    // Add the slider that allows the user to select the number of questions to display
    // The slider is a range input that goes from the minimum number of questions to the maximum number of questions
    let slider = document.createElement('input');
            slider.type = 'range';
            slider.min = data.minQuestions;
            slider.max = data.maxQuestions;
            slider.value = '10';
            slider.step = '1';
            slider.classList.add('slider');
            slider.id = 'question-number-slider';
    
    // Add the label for the slider that displays the number of questions to display
    // The label is updated when the slider value changes
    let slider_label = document.createElement('label');
            var slider_value = slider.value;
            slider.oninput = () => {
                slider_value = slider.value;
                slider_label.innerHTML = `Nombre de questions : ${slider_value}`;
            }
            slider_label.htmlFor = 'question-number-slider';
            slider_label.innerHTML = `Nombre de questions : ${slider_value}`;
            settings_container.appendChild(slider_label);
            settings_container.appendChild(slider);
    
    // Add the progress container that holds the progress of the quiz
    // The progress is displayed as a percentage
    let quiz_progress = document.createElement('p');
            const logged_in = await user.get_is_logged_in();
            const progress = await user.get_user_progress(data.quizID)/10;
            let shown_progress = `Progression : ${progress}%`;

            if (!logged_in) {
                shown_progress = "Veuillez vous connecter pour voir votre progression";
            }
            
            if (progress != null) {
                quiz_progress.innerHTML = shown_progress;
            } else {
                quiz_progress.innerHTML = `Progression : 0%`;
            }
            quiz_progress.classList.add('quiz-selection-progress');
            info_container.appendChild(quiz_progress);
        
    // Add the start button that starts the quiz when clicked
    let start_button = document.createElement('button');
            start_button.innerHTML = `Commencer<i class="fa-solid fa-arrow-right"></i>`;
            start_button.classList.add('quiz-selection-start-button');
            start_button.onclick = () => {
                api.load_file(path, slider_value);
            };
            info_container.appendChild(start_button);

}

// Function to show the available quizzes from the Assets/Quiz folder, the relatives paths from this folder are the strings in the quiz_paths variable
export function show_available_quiz() {
    const quiz_paths = ['IdentitesRemarquables/Quiz-1.json', 'IdentitesRemarquables/Quiz-2.json', 'CalculMental/Quiz-1.json']

    const quiz_selector_list = document.querySelector('.quiz-selection-main-container')

    // Display all the quizzes available in the Assets/Quiz folder and add the settings for each quiz
    for (let path of quiz_paths) {
        let final_path = `Assets/Quiz/${path}`
        let selector_container = document.createElement('div');
        selector_container.classList.add('quiz-selection-container');
        let selector = document.createElement('button');
        selector.onclick = () => {
            let selected = Array.from(document.getElementsByClassName('selected'));
            selected = selected.filter((element) => element !== selector && element !== selector_container);
            if (selected.length > 0) {
                selected.forEach((element) => {
                    element.classList.remove('selected');
                });
            }

            if (selector.classList.contains('selected')) {
                selector.classList.remove('selected');
                selector_container.classList.remove('selected');
            } else {
                selector.classList.add('selected');
                selector_container.classList.add('selected');
            }};
        
        selector.classList.add('quiz-selection-button');
        api.get_json_data(final_path).then(data => {
            selector.innerHTML = data.quizTitle;
            const selector_arrow = document.createElement('i');
            selector_arrow.classList.add('fa-solid', 'fa-chevron-down');
            selector_container.appendChild(selector); 
            selector.appendChild(selector_arrow);
            add_selection_settings(selector_container, data, final_path);
        });
        quiz_selector_list.appendChild(selector_container);
    }

}

// Function to add the toast message to the screen
// @param title : The title of the toast message
// @param message : The message of the toast
// @param type : The type of the toast message (success, error, warning, info)
function add_toast(toast_element, title, message, type, duration, is_new) {
    toast_element.className = `feedback-container ${type}`;
    toast_element.querySelector('.toast-image').getElementsByClassName('fas')[0].className =
        `fas ${type === 'success' ? 'fa-circle-check' :
            type === 'error' ? 'fa-circle-xmark' :
                type === 'warning' ? 'fa-circle-exclamation' : 'fa-circle-info'}`
    toast_element.querySelector('.toast-content').innerHTML = `
    <p class="toast-title">${title}</p>
    <p class="feedback-message">${message}</p>
    `;

    // Show the toast
    toast_element.style.display = 'flex';

    if (is_new) {
        setTimeout(() => {
            toast_element.classList.add('new');
            toast_element.classList.add('show');
        }, 10); // Small delay to allow the browser to render the element
    } else {
        setTimeout(() => {
            toast_element.classList.add('old');
        }, 10); // Small delay to allow the browser to render the element
    }

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast_element.classList.remove('show');
        toast_element.classList.add('hide');

        // Remove the toast from view after the fade-out transition
        setTimeout(() => {
            toast_element.style.display = 'none';
            toast_element.classList.remove('hide');
        }, 750);// Match the CSS transition duration

        sessionStorage.removeItem('toast');
        sessionStorage.removeItem('toast-type');
        sessionStorage.removeItem('toast-title');
        sessionStorage.removeItem('toast-message');
        sessionStorage.removeItem('toast-expires');
    }, duration);

    sessionStorage.setItem('toast', 'true');
    sessionStorage.setItem('toast-type', type);
    sessionStorage.setItem('toast-title', title)
    sessionStorage.setItem('toast-message', message);
    sessionStorage.setItem('toast-expires', (Date.now() + duration).toString());
    console.log("Test", duration);
}

// Function to show a toast message
// @param title : The title of the toast message
// @param message : The message of the toast
// @param type : The type of the toast message (success, error, warning, info)
export function show_toast(title, message, type = 'warning', duration = 3500, is_new = true) {
    const toast = document.getElementById('toast');

    if (toast.classList.contains('show')) {
        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            toast.style.display = 'none';
            toast.classList.remove('hide');
            add_toast(toast, title, message, type, duration, is_new);
        }, 750);
    } else {
        add_toast(toast, title, message, type, duration, is_new);
    }


}
