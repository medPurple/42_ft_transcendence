import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";

export class WaitingScreen{

    constructor(game_name){
        this.displayWaitingScreen(game_name);
        this.userdata = document.createElement('div');
		this.userdata.classList.add('user-info');
        this.userdata.addEventListener('beforeunload', function (event) {
            leaveQueueRequest();
        });
    }

    async leaveQueueRequest(){
		let id = await Iuser.getID();
		console.log("id is : " + id);
        try{
            const response = await fetch(`api/queue/?userID=${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': Icookies.getCookie('csrftoken'),
                    'Authorization': Icookies.getCookie('token'),
                    'Content-Type': 'application/json'
                },
            })
            const data = await response.json();
            if (response.status == 204){
                console.log("User left the queue");
                return response.status;
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
        let time = new Date(data.waitingTime);
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
        this.gameData.innerText = `You are now in queue for ${data.game}`;
        this.positionData.innerText = `Position : ${data.position} | Y Players in queue`;
    }

    leaveButton(socket){
        const leaveButton = document.createElement('button');
        leaveButton.classList.add('leave-button');
        leaveButton.innerText = 'Leave queue';
        leaveButton.addEventListener('click', async () => {
            let test = await this.leaveQueueRequest();
            socket.close();
            window.location.href = '/';
        });
        return leaveButton;
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

            socket.addEventListener('error', function (event) {
                console.log('Error establishing websocket connection with the matchmaking server');
            });
            
            socket.onopen = (e) => {
                console.log('Connected to websocket server')
                this.displayUserInfo();
                queueinfo.appendChild(this.userdata);
                queueinfo.appendChild(this.leaveButton(socket));
                socket.send(JSON.stringify({
                    id: `${id}`,
                    game: `${game_name}`,
                }));
            };
            
            socket.onmessage = (e) => {
                var parsed_data = JSON.parse(e.data)
                if (parsed_data.message == "match_ready"){
                    socket.close();
                    // if (data.sender == true)
                } else {
                    this.updateUserInfo(parsed_data);
                    socket.send(JSON.stringify({
                        id: `${id}`,
                        game: `${game_name}`,
                    }));
                }
                //console.log('Message from server :', e.data);
        };

        socket.addEventListener('close', (event) => {
            let test = this.leaveQueueRequest();
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