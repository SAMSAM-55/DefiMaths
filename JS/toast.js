// This file is part of the "Toast" feature for displaying notifications.
// It handles the display of toast notifications based on URL parameters.
import {show_toast} from './utility-lib.js'

// This script listens for the DOMContentLoaded event and checks for URL parameters to display a toast notification.
// If the 'toast' parameter is set to 'true', it retrieves the toast title, message, and type from the URL parameters and displays the toast notification.
addEventListener("DOMContentLoaded", () => {
    const url_params = new URLSearchParams(window.location.search);

    if (url_params.get('toast') === 'true') {
        const toast_title = url_params.get('toast-title');
        const toast_message = url_params.get('toast-message');
        const toast_type = url_params.get('toast-type');

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        show_toast(toast_title, toast_message, toast_type);
    }
});