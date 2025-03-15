export async function get_json_data(file_path) {
    const response = await fetch(file_path);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export async function get_selected_quiz_data() {
    return await get_json_data(localStorage.getItem('selectedQuizFile'));
}

export async function load_file(path, numQuestions) {
    localStorage.setItem('selectedQuizFile', path);
    localStorage.setItem('numQuestions', numQuestions);
    window.location.href = './quizz-page.html';
}

export function get_file_path() {
    return localStorage.getItem('selectedQuizFile');
}

export function get_num_questions() {
    return localStorage.getItem('numQuestions');
}
