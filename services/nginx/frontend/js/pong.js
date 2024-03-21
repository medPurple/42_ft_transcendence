
document.addEventListener('DOMContentLoaded', () => {
    const paddle1 = document.getElementById('paddle1');
    const keypressInfo = document.getElementById('keypress-info'); // Get reference to the new element

    // Add event listener for user input (e.g., arrow keys)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
            keypressInfo.textContent = 'Up arrow key pressed'; // Update the text content
            // sendPaddlePosition('paddle1', paddle1.offsetTop - 10);
        } else if (event.key === 'ArrowDown') {
			keypressInfo.textContent = 'Down arrow key pressed'; // Update text content
			// sendPaddlePosition('paddle1', paddle1.offsetTop + 10);
        }
    });

    // function sendPaddlePosition(paddleId, positionY) {
    //     // Send paddle position to backend via HTTP POST request
    //     fetch('/update_paddle_position/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'X-CSRFToken': csrfToken,
    //         },
    //         body: JSON.stringify({
    //             paddleId: paddleId,
    //             positionY: positionY,
    //         }),
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         // Handle response from backend (if needed)
    //         // For simplicity, we'll just log the received data
    //         console.log('Received data:', data);
    //     })
    //     .catch(error => {
    //         // Handle error (if any)
    //         console.error('Error:', error);
    //     });
    // }
});
