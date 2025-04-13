import {show_toast} from './utility-lib.js'

addEventListener("DOMContentLoaded", () => {
    const url_params = new URLSearchParams(window.location.search);

    console.log("Url parameters : ", url_params)

    if (url_params.get('toast') === 'true') {
        const toast_title = url_params.get('toast-title');
        const toast_message = url_params.get('toast-message');
        const toast_type = url_params.get('toast-type');

        show_toast(toast_title, toast_message, toast_type);
    }
});