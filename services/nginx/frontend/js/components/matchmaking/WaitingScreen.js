import Icookies from "../cookie/cookie.js"

export class WaitingScreen{

    constructor(game_name){
        this.displayWaitingScreen(game_name);
    }

    async getID() {
		let jwtToken = Icookies.getCookie('token');
		let csrfToken = Icookies.getCookie('csrftoken');

		console.log("TOKEN BEFORE : " + jwtToken);

		try {
			const response = await fetch('/api/token/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
					'Authorization': jwtToken
				}
			});

			if (!response.ok) {
				throw new Error('identification failed');
			}

			const data = await response.json();
			console.log(data.user_id);
			return data.user_id;
		} catch (error) {
			console.error('Error:', error);
			// Handle API errors
		}
	}

    addWaitingText(game_name, waitingscreen){
        const queueText = document.createElement('div');
        let queueName = "";
        if (game_name == 'pong_multiplayer'){
            queueName = "Pong - Versus";}
        if (game_name == 'pong_tournament'){
            queueName = "Pong - Tournament";}
        if (game_name == 'pkm_multiplayer'){
            queueName = "Pokemon - Versus";}
        queueText.innerText = `You are now in queue for ${queueName}`;
        return queueText;

    }

    async getUserinfo(){
        const queueinfo = document.createElement('div');
        queueinfo.classList.add('queueinfo');
        
        let id = await this.getID();
        const socket = new WebSocket(`ws://127.0.0.1:8080/api/wsqueue/?userID=${id}/`);        
        socket.addEventListener('error', function (event) {
            console.log('Error establishing websocket connection with the matchmaking server');
            console.log(event);
        });

        socket.addEventListener('open', function (event) {
            socket.send('Websocket connection established with the matchmaking server'); 
        });

        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
            queueinfo.innerText = event.data;
        });

        socket.addEventListener('close', function (event) {
            console.log('WebSocket connection closed by the server');
        });
        
        return queueinfo;
    }

    async displayWaitingScreen(game_name){
        const waitingscreen = document.createElement('div');
		waitingscreen.classList.add('matchmaking-screen')
        waitingscreen.appendChild(this.addWaitingText(game_name, waitingscreen));
        const userinfodiv = await this.getUserinfo();
        waitingscreen.appendChild(userinfodiv);
        document.body.appendChild(waitingscreen);
        
    }

}