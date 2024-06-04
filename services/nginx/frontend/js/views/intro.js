
export default () => `

	<div id="app-general-container">
		<div class="image-container">
			<img src="../images/Site/InvitationCard_Front.png" alt="Original Image" class="original-image">
			<img src="../images/Site/InvitationCard_Rev.png" alt="Hover Image" class="hover-image">
		</div>
		<form class="buttons-container" onsubmit="validateCodeAndRedirect(); return false;">	
			<div class="mb-4">
				<input type="text" class="form-control" placeholder="Enter Code">
			</div>
			<div class="mb-4">
				<button type="submit" class="btn btn-dark">Start</button>
			</div>
		</form>
	</div>
	`;

window.validateCodeAndRedirect = validateCodeAndRedirect;

function validateCodeAndRedirect() {

	const codeInput = document.querySelector('.form-control');

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
