import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";

export class WaitingScreen{

    constructor(game_name){
        this.displayWaitingScreen(game_name);
        this.userdata = document.createElement('div');
		this.userdata.classList.add('user-info');
    }

    displayUserInfo(){
        this.gameData = document.createElement('p')
		this.gameData.innerText = 'You are now in queue for a game';
        this.userdata.appendChild(this.gameData);

        this.positionData = document.createElement('p')
		this.positionData.innerText = 'Position : X | Y Players in queue';
        this.userdata.appendChild(this.positionData);

        this.timeData = document.createElement('p')
		this.timeData.innerText = 'Elapsed time : xx secondes';
        this.userdata.appendChild(this.timeData);
    }

    updateUserInfo(data){
        var parsed_data = JSON.parse(data)
        let time = new Date(parsed_data.waitingTime);
        let now = new Date(); // Date actuelle
        let elapsedTimeMillis = now - time; // Temps écoulé en millisecondes
        let elapsedTime = Math.floor(elapsedTimeMillis / 1000);
        if (elapsedTime >= 60) {
            let minutes = Math.floor(elapsedTime / 60);
            let seconds = elapsedTime % 60;
            this.timeData.innerText = `Elapsed time : ${minutes}:${seconds}`;
        } else {
            this.timeData.innerText = `Elapsed time : ${elapsedTime}`;
            
        }
        this.gameData.innerText = `You are now in queue for ${parsed_data.game}`;
        this.positionData.innerText = `Position : ${parsed_data.position} | Y Players in queue`;
    }

    async getUserinfo(game_name){
        const queueinfo = document.createElement('div');
        queueinfo.classList.add('queueinfo');
        
        let id = await Iuser.getID();
        const socket = new WebSocket(
            'ws://'
            + window.location.host
            + '/api/wsqueue/'
            );
            //const socket = new WebSocket(`ws://localhost:8080/api/wsqueue/?userID=${id}`);
            
            socket.addEventListener('error', function (event) {
                console.log('Error establishing websocket connection with the matchmaking server');
            });
            
            socket.onopen = (e) => {
                console.log('Connected to websocket server')
                this.displayUserInfo();
                queueinfo.appendChild(this.userdata);
                socket.send(JSON.stringify({
                    id: `${id}`,
                    game: `${game_name}`,
                }));
            };
            
            socket.onmessage = (e) => {
                //console.log('Message from server :', e.data);
                this.updateUserInfo(e.data);
                socket.send(JSON.stringify({
                    id: `${id}`,
                    game: `${game_name}`,
                }));
        };

        socket.addEventListener('close', function (event) {
            console.log('WebSocket connection closed by the server');
        });
        
        return queueinfo;
    }

    async displayWaitingScreen(game_name){
        const waitingscreen = document.createElement('div');
		waitingscreen.classList.add('matchmaking-screen')
        const userinfodiv = await this.getUserinfo(game_name);
        waitingscreen.appendChild(userinfodiv);
        document.body.appendChild(waitingscreen);
        
    }

}