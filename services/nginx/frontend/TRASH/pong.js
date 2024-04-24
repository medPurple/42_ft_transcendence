document.addEventListener('DOMContentLoaded', () => {
	const paddle1 = document.getElementById('paddle1');
	const paddle2 = document.getElementById('paddle2');
	const ball = document.getElementById('ball');
	const gameCanvas = document.querySelector('.gamecanvas');
	const keypressInfo = document.getElementById('keypress-info');

	let ballDirectionX = 1;
	let ballDirectionY = 1;
	ball.style.left = '0px';
	ball.style.top = '0px';

	function moveBall() {
		const ballRect = ball.getBoundingClientRect();
		const gameCanvasRect = gameCanvas.getBoundingClientRect();
		let newLeft = parseFloat(ball.style.left);
		let newTop = parseFloat(ball.style.top);

		if (isNaN(newLeft) || isNaN(newTop)) {
			return;
		}

		newLeft += ballDirectionX * 2;
		newTop += ballDirectionY * 2;

		if (newLeft < 0 || newLeft > gameCanvasRect.width - ballRect.width) {
			ballDirectionX *= -1; // Reverse the ball direction when it hits the left or right wall
		} else {
			ball.style.left = newLeft + 'px'; // Update the ball's left position
		}

		if (newTop < 0 || newTop > gameCanvasRect.height - ballRect.height) {
			ballDirectionY *= -1; // Reverse the ball direction when it hits the top or bottom wall
		} else {
			ball.style.top = newTop + 'px'; // Update the ball's top position
		}
	}

	setInterval(moveBall, 10);

	document.addEventListener('keydown', (event) => {
		let newTop;
		if (event.key === 'ArrowUp') {
			keypressInfo.textContent = 'Up arrow key pressed';
			newTop = paddle1.offsetTop - 10; // Calculate new top position
			if (newTop < 0) { // If new top position is outside the game canvas, adjust it
				newTop = 0;
			}
			paddle1.style.top = newTop + 'px'; // Update top position
		} else if (event.key === 'ArrowDown') {
			keypressInfo.textContent = 'Down arrow key pressed';
			newTop = paddle1.offsetTop + 10; // Calculate new top position
			if (newTop > gameCanvas.offsetHeight - paddle1.offsetHeight) { // If new top position is outside the game canvas, adjust it
				newTop = gameCanvas.offsetHeight - paddle1.offsetHeight;
			}
			paddle1.style.top = newTop + 'px'; // Update top position
		} else if (event.key === 'w') {
			keypressInfo.textContent = 'W key pressed';
			newTop = paddle2.offsetTop - 10;
			if (newTop < 0) {
				newTop = 0;
			}
			paddle2.style.top = newTop + 'px';
		} else if (event.key === 's') {
			keypressInfo.textContent = 'S key pressed';
			newTop = paddle2.offsetTop + 10;
			if (newTop > gameCanvas.offsetHeight - paddle2.offsetHeight) {
				newTop = gameCanvas.offsetHeight - paddle2.offsetHeight;
			}
			paddle2.style.top = newTop + 'px';
		}
	});
});
