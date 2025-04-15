// This file handles the loading of quiz data from JSON files and manages local storage for selected quizzes.
// It provides functions to load quiz data, get the selected quiz file path, and manage the number of questions.

// This function fetches JSON data from a given file path and returns the parsed JSON object.
// @params file_path: The path to the JSON file containing quiz data.
// @returns: A promise that resolves to the parsed JSON object.
export async function get_json_data(file_path) {
    const response = await fetch(file_path);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// This function retrieves the selected quiz data from local storage and fetches the JSON data from the stored file path.
// @returns: A promise that resolves to the parsed JSON object of the selected quiz data.
export async function get_selected_quiz_data() {
    return await get_json_data(localStorage.getItem('selectedQuizFile'));
}

// This function loads the quiz file and number of questions into local storage and redirects to the quiz page.
// @params path: The path to the quiz file.
export async function load_file(path, numQuestions) {
    localStorage.setItem('selectedQuizFile', path);
    localStorage.setItem('numQuestions', numQuestions);
    window.location.href = './quizz-page.html';
}

// This function retrieves the quiz file path from local storage.
// @returns: The path to the selected quiz file.
export function get_file_path() {
    return localStorage.getItem('selectedQuizFile');
}

// This function retrieves the number of questions from local storage.
// @returns: The number of questions stored in local storage.
export function get_num_questions() {
    return localStorage.getItem('numQuestions');
}
