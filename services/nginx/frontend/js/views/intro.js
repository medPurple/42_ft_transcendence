
export default () => `
	<div class="image-container">
        <img src="./images/InvitationCard_Front.png" alt="Original Image" class="original-image">
        <img src="./images/InvitationCard_Rev.png" alt="Hover Image" class="hover-image">
    </div>
    <div class="buttons-container">
        <input type="text" placeholder="Enter Code" class="code-input">
        <button onclick="validateCodeAndRedirect()">Start</button>
	</div>
	<div>
		<a href="/home" data-link>LINK TO HOME (TMP)</a>
	</div>
	`;

window.validateCodeAndRedirect = validateCodeAndRedirect;

function validateCodeAndRedirect() {
	const codeInput = document.querySelector('.code-input');

	if (codeInput) {
		const code = codeInput.value;
		if (code === '8650 4006') {
			console.log('Code is correct!');
			window.location.href = '/home';
		} else {
			console.log('Incorrect code!');
			alert("Incorrect code! Please try again");
		}
	}
}