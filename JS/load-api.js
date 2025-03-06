async function get_json_data(file_path) {
    const response = await fetch(file_path);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export async function get_selected_quizz_data() {
    return await get_json_data(localStorage.getItem('selectedQuizzFile'));
}

export async function load_file(path) {
    localStorage.setItem('selectedQuizzFile', path);
    window.location.href = './quizz-page.html';
}

export function get_file_path() {
    return localStorage.getItem('selectedQuizzFile');
}