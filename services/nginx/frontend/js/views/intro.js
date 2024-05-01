
export default () => `
	<div class="image-container">
        <img src="./images/Site/InvitationCard_Front.png" alt="Original Image" class="original-image">
        <img src="./images/Site/InvitationCard_Rev.png" alt="Hover Image" class="hover-image">
    </div>
    <div class="buttons-container">
        <input type="text" placeholder="Enter Code" class="code-input">
        <button onclick="validateCodeAndRedirect()">Start</button>
	</div>
	`;

window.validateCodeAndRedirect = validateCodeAndRedirect;

function validateCodeAndRedirect() {
	const codeInput = document.querySelector('.code-input');
	const startButton = document.querySelector('.buttons-container button');

	if (codeInput) {
		const code = codeInput.value;
		if (code === '8650 4006') {
			console.log('Code is correct!');
			startButton.classList.add('code-validated');
			window.location.href = '/home';
		} else {
			console.log('Incorrect code!');
			alert("Incorrect code! Please try again");
		}
	}
}
