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
        return Number(score_string[score_string.length - position - (displayed_score == score ? 0 :  1)])
    } else {
        return Number(score_string[score_string.length - 1])
    }
}

function play_animation(score) {
    setTimeout(() => {
        const texts = document.querySelectorAll('.score-text');
        texts.forEach((current_text) => {
        let digit_position = current_text.getAttribute('score-position');
        let number = get_digit_at_position(score, digit_position);
        let score_digits = current_text.querySelectorAll('.score-digit');
        score_digits.forEach((digit) => {
            digit.style.transform = `translateY(calc(-24px*${number}))`;
        });
    });
}, 100);
}

export function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

export function pickrandomQuestions(allQuestions, numQuestions) {
    const selectedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        selectedQuestions.push(allQuestions[randomIndex]);
        allQuestions.splice(randomIndex, 1);
    }
    return selectedQuestions;
    
}

// Shuffling function (Fisher-Yates algorithm)
export function shuffleArray(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap

    }
    return array;
}

export function animate_score(score, maxScore) {
    const score_digit_component = document.getElementsByClassName('score-decimal-digit')[0];
    const score_integer_container = document.getElementsByClassName('score-integer-container')[0];
    score_digit_component.innerHTML = '';
    score_integer_container.innerHTML = '';

    for (let i = 0 ; i < get_score_digits_number(score) ; i++) {
        score_integer_container.innerHTML += `<span class="score-interger-digit score-text" score-position=${get_score_digits_number(score) - i}>
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

    score_digit_component.innerHTML = `<span class="score-interger-digit score-text" score-position=0>
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

export function show_available_quiz() {
    const quiz_paths = ['/IdentitesRemarquables/Quizz-2.json']

    const quizz_selector_list = document.querySelector('.quizz-selection-main-container')

    for (let path of quiz_paths) {
        let final_path = `Assets/Quizz${path}`
        let selector = document.createElement('button');
        selector.onclick = () => load_file(final_path);
        api.get_json_data(final_path).then(data => {
            selector.innerHTML = data.quizTitle;
        });
        quizz_selector_list.appendChild(selector);
    }

}
