export class WaitingScreen{

    constructor(game_name){
        this.displayWaitingScreen(game_name);
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

    getUserinfo(){
        const queueinfo = document.createElement('div');
        userinfo.classList.add('queueinfo');
        
        const socket = new WebSocket('/api/token/');
        socket.addEventListener('error', function (event) {
            console.log('Error establishing websocket connection with the matchmaking server');
        });
        socket.addEventListener('open', function (event) {
            socket.send('Websocket connection established with the matchmaking server'); 
        });

        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
            userinfo.innerText = event.data;
        });
        
        return userinfo;
    }

    displayWaitingScreen(game_name){
        const waitingscreen = document.createElement('div');
		waitingscreen.classList.add('matchmaking-screen')
        waitingscreen.appendChild(this.addWaitingText(game_name, waitingscreen));
        document.body.appendChild(waitingscreen);
        
    }

}