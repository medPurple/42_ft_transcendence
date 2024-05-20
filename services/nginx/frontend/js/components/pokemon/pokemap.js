import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";


export class pokeMap{
    
    constructor(){
        this.ctxMAP = null;
        this.ctxCharacter = null;
        this.lastX = 0;
        this.lastY = 0;
    }
    divmapCreation(){

        // MAP DIV
        const divmap = document.createElement('div');
        divmap.style.textAlign = 'center';
        divmap.style.position = 'relative';
        divmap.style.width = '800px';
        divmap.style.height = '400px';
        divmap.style.marginLeft = '28%';
        divmap.style.marginTop = '5%';
        // divmap.style.marginRight = 'auto';
        
        
        // MAP CANVAS
        
        const pokecanva = document.createElement('canvas');
        pokecanva.width = 800;
        pokecanva.height = 400;
        pokecanva.style.zIndex = '1';
        pokecanva.style.position = 'absolute';
        pokecanva.style.top = '0';
        pokecanva.style.left = '0';
        this.ctxMAP = pokecanva.getContext('2d');
        divmap.appendChild(pokecanva);
        
        // CHARACTER CANVAS
        
        const characterCanvas = document.createElement('canvas');
        characterCanvas.width = 800;
        characterCanvas.height = 400;
        characterCanvas.style.zIndex = '2';
        characterCanvas.style.position = 'absolute';
        characterCanvas.style.top = '0';
        characterCanvas.style.left = '0';

        this.ctxCharacter = characterCanvas.getContext('2d');
        divmap.appendChild(characterCanvas);

        // LOAD IMAGE
        const mapimage = new Image(800, 400);
        mapimage.src = './images/image_with_grid.png';
        mapimage.onload = () => {
            this.ctxMAP.drawImage(mapimage, 0 , 0);
        }


        document.body.appendChild(divmap);
        return divmap;
    }

    // function updateCharacterPosition() {
    //     const divmapRect = divmap.getBoundingClientRect();        
    //     // Calculate the responsive position of the characterCanvas
    //     characterCanvas.style.top = (divmapRect.top + divmapRect.height / 2 - characterCanvas.height / 2) + 'px';
    //     characterCanvas.style.left = (divmapRect.left + divmapRect.width / 2 - characterCanvas.width / 2) + 'px';
    // }

    // updateCharacterPosition();
    // window.addEventListener('resize', updateCharacterPosition);
    drawplayer(x, y, orientation){
        const img = new Image();
        switch(orientation){
            case "N":
                img.src = './images/player_n.png';
                break;
            case "S":
                img.src = './images/player_s.png';
                break;
            case "E":
                img.src = './images/player_e.png';
                break;
            case "W":
                img.src = './images/player_w.png';
                break;
        }
        img.onload = () => {
            this.ctxCharacter.clearRect(this.lastX * 16, (this.lastY * 16) - 16, 16, 32);
            this.ctxCharacter.drawImage(img, x * 16, (y * 16) - 16,  16, 32);
            this.lastX = x;
            this.lastY = y;
        }
    }
    
    startingPokeverse(){
        const pokemondiv = document.createElement('div'); 
        pokemondiv.appendChild(this.divmapCreation());
        this.connection();
        return pokemondiv;
    }
    
    async connection(){
        let id = await Iuser.getID();
        const socket = new WebSocket("wss://localhost:4430/ws/pokemap/");

        
        socket.onopen = async (e) => {
            console.log("WebSocket connection opened.");
            try{
                const response = await fetch(`/api/pokemap/?userID=${id}`, {
                    method: 'GET',
                    headers: {
                        'X-CSRFToken': Icookies.getCookie('csrftoken'),
                        'Authorization': Icookies.getCookie('token'),
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(data => {
                        console.log("Data: ", data);
                        this.lastX = data.posX;
                        this.lastY = data.posY;
                        this.drawplayer(data.posX, data.posY, data.orientation);
                        return;
                    })
                } catch (error){
                    console.error('Error:', error);
                };
        }


        socket.onclose = function(event){
            console.log("Websocket connection closed.");
            
        }

        socket.onmessage = (e) => {
            var parsed_data = JSON.parse(e.data)
            this.drawplayer(parsed_data.posX, parsed_data.posY, parsed_data.orientation);
            if (parsed_data.event === "combat"){
                console.log("combat against: ", parsed_data.target);}
            if (parsed_data.event === "interaction"){
                console.log("interaction with: ", parsed_data.target);}
            console.log(parsed_data);
        }

        document.onkeydown = (event) => {
            event.preventDefault();
            if (event.key == 'ArrowUp')
            {
                console.log("up");
                socket.send(JSON.stringify({
                    new: "y-",
                    userID: id,
                }));
                
            }
            if (event.key == 'ArrowDown'){
                console.log("down");
                socket.send(JSON.stringify({
                    new: "y+",
                    userID: id,
                }));
            }
            if (event.key == 'ArrowRight'){
                console.log("right");
                socket.send(JSON.stringify({
                    new: "x+",
                    userID: id,
                }));
            }
            if (event.key == 'ArrowLeft'){
                console.log("left");
                socket.send(JSON.stringify({
                    new: "x-",
                    userID: id,
                }));
            }
        };
    }

}