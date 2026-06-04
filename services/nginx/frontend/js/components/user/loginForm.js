import Icookies from "../cookie/cookie.js"
import { API_BASE } from "../../config.js"

export default class LoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `

		<link rel="stylesheet" href="css/style.css" />
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css">
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"defer></script>
		<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous" defer></script>

		<div id="app-general-container">
			<div id="alert-container"></div>
			<div style="background:rgba(255,255,255,0.75);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.4);border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.12);padding:2rem 2rem;max-width:360px;margin:0 auto;">
			<h5 style="font-family:'Courier New',monospace;letter-spacing:0.1em;margin-bottom:1.5rem;">Sign In</h5>
				<form id="login-form" method="post" action="" class="container" style="padding: 0;">
					<div class="mb-4">
						<input type="text" class="form-control" name="username" placeholder="Username" autocomplete="username" required>
					</div>
					<div class="mb-4">
						<input type="password" class="form-control" name="password" placeholder="Password" autocomplete="password" required>
						<input type="hidden" name="csrfmiddlewaretoken" value="{{ csrf_token }}">
					</div>
					<div class="mb-4">
						<button type="submit" class="btn btn-dark">Log in</button>
					</div>
				</form>
			</div>
		</div>
		`;
  }

  showAlert(message, type = 'danger') {
    const alertContainer = this.shadowRoot.getElementById('alert-container');
    alertContainer.innerHTML = `
			<div class="alert alert-${type} alert-dismissible fade show" role="alert">
				${message}
			</div>`;

  }

  connectedCallback() {
    const signupForm = this.shadowRoot.getElementById('login-form');
    const showAlert = this.showAlert.bind(this);
    signupForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = new FormData(signupForm);

      fetch(API_BASE + '/api/profiles/login/', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRFToken': formData.get('csrfmiddlewaretoken')
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.two_fa) {
            window.location.href = '/code2FA';
          }
          else if (data.success) {
            Icookies.setCookie('token', data.token, 7);
            window.location.href = '/home';

          } else {
            showAlert('Login failed. Please check the form and try again.')
          }
        })
        .catch(error => {
          showAlert(error);
        });
    });
  }
}

customElements.define('login-form', LoginForm);




