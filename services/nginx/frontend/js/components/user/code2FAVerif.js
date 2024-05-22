import Icookies from "../cookie/cookie.js"

export default class code2FA extends HTMLElement {
    constructor(){
    super(); // Always call super first in constructor
    this.innerHTML = `
    <div id="alert-container"></div>
    <div class="mb-4">
        <input type="text" id="otp-input" placeholder="Enter OTP" class="form-control">
    </div>
    <button type="submit" id="submit-btn" class="btn btn-dark">Confirm</button>
    `;
    }

    showAlert(message, type = 'danger') {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>`;
    }

    connectedCallback() {
    const submitBtn = document.getElementById('submit-btn');
    const otpInput = document.getElementById('otp-input');
    const showAlert = this.showAlert.bind(this);

    submitBtn.addEventListener('click', function(event) {
        event.preventDefault();

        const otp = otpInput.value;
        // const csrfToken = '{{ csrf_token }}'; // Ensure you have the CSRF token

        fetch('/api/profiles/login_2FA/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': Icookies.getCookie('csrftoken')
            },
            body: JSON.stringify({ otp: otp })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to the home page
                Icookies.setCookie('token', data.token, 90);
                window.location.href = '/home'; // Change the URL to your home page URL
            } else {
                // Display validation errors or any other error message
                showAlert('Wrong code. Please check the code and try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle API errors
        });
    });
    }
}

customElements.define('code-form', code2FA);
