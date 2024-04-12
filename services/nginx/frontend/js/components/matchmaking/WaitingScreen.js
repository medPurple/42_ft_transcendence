

export class WaitingScreen{

    constructor(game_name){
        this.displayWaitingScreen(game_name);
    }

    addWaitingText(game_name, waitingscreen){
        const queueText = document.createElement('p');
        let queueName = "";
        if (game_name == 'pong_multiplayer'){
            queueName = "Pong - Versus";}
        if (game_name == 'pong_tournament'){
            queueName = "Pong - Tournament";}
        if (game_name == 'pkm_multiplayer'){
            queueName = "Pokemon - Versus";}
        queueText.textContent = `You are now in queue for ${queueName}`;
        waitingscreen.appendChild(queueText);

    }
    displayWaitingScreen(game_name){
        const waitingscreen = document.createElement('div');
		waitingscreen.classList.add('matchmaking-screen')
        this.addWaitingText(game_name, waitingscreen);
        document.body.appendChild(waitingscreen);
    }

}