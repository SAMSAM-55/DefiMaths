import * as api from './load-api.js';

function get_score_digits_number(score) {
    const number = score - (score%1);
    return number.toString().length;
}

function get_digit_at_position(score, position) {
    let displayed_score = round(score, 1)
    let score_string = displayed_score.toString().replaceAll('.', '')

    if (!position) {
        return score_string[0]
    }

    if (position > 0) {
        return Number(score_string[score_string.length - position - (displayed_score == score ? 0 : 1)])
    } else {
        return Number(score_string[score_string.length - 1])
    }
}

// Function for playing the animation at the end of the quiz
function play_animation(score) {
    setTimeout(() => {
        const texts = document.querySelectorAll('.score-text');
        texts.forEach((current_text) => {
        let digit_position = current_text.getAttribute('score-position');
        let number = get_digit_at_position(score, digit_position);
        let score_digits = current_text.querySelectorAll('.score-digit');
        score_digits.forEach((digit) => {
            let digit_height = digit.clientHeight;
            console.log(digit_height);
            digit.style.transform = `translateY(calc(-1px*${number}*(${digit_height})))`; // number at the end is the ratio between the font size and the height of the digit
        });
    });
}, 100);
}

// Function used to round the score to one digit
export function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

// Function for picking random questions among the declared ones in the json file
export function pickrandomQuestions(allQuestions, numQuestions) {
    const selectedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        selectedQuestions.push(allQuestions[randomIndex]);
        allQuestions.splice(randomIndex, 1);
    }
    return selectedQuestions;
    
}

// Function for shuffling arrays used to automaticly display possible anwsers in a random order 
export function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];

    }
    return array;
}

// Function for animating the score at the end of the quiz
export function animate_score(score, maxScore) {
    console.log("Animated score : ", score);

    const score_digit_component = document.getElementsByClassName('score-decimal-digit')[0];
    const score_integer_container = document.getElementsByClassName('score-integer-container')[0];
    score_digit_component.innerHTML = '';
    score_integer_container.innerHTML = '';

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

    play_animation(score);
    
    if (score >= maxScore*0.9) {
        confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
}

function add_slection_settings(container, data, path) {
    let info_container = document.createElement('div');
    info_container.classList.add('quiz-selection-info-container');
    container.appendChild(info_container);

    let settings_container = document.createElement('div');
    settings_container.classList.add('quiz-selection-settings-container');
    info_container.appendChild(settings_container);

    let slider = document.createElement('input');
            slider.type = 'range';
            slider.min = data.minQuestions;
            slider.max = data.maxQuestions;
            slider.value = '10';
            slider.step = '1';
            slider.classList.add('slider');
            slider.id = 'question-number-slider';
            settings_container.appendChild(slider);
    
    let slider_label = document.createElement('label');
            var slider_value = slider.value;
            slider.oninput = () => {
                slider_value = slider.value;
                slider_label.innerHTML = `Nombre de questions : ${slider_value}`;
            }
            slider_label.htmlFor = 'question-number-slider';
            slider_label.innerHTML = `Nombre de questions : ${slider_value}`;
            settings_container.appendChild(slider_label);

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
    const quiz_paths = ['/IdentitesRemarquables/Quiz-2.json', '/IdentitesRemarquables/Quiz-2.json', '/IdentitesRemarquables/Quiz-2.json']

    const quiz_selector_list = document.querySelector('.quiz-selection-main-container')

    for (let path of quiz_paths) {
        let final_path = `Assets/Quiz${path}`
        let selector_container = document.createElement('div');
        selector_container.classList.add('quiz-selection-container');
        let selector = document.createElement('button');
        selector.onclick = () => {
            let selected = Array.from(document.getElementsByClassName('selected'));
            selected = selected.filter((element) => element !== selector && element !== selector_container);
            console.log(selected);
            if (selected != []) {
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
            add_slection_settings(selector_container, data, final_path);
        });
        quiz_selector_list.appendChild(selector_container);
    }

}
