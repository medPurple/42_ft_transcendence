import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";


export class pokeMap{
    
    constructor(){
        this.userID = null;
        this.map = 0;
        this.ctxMAP = null;
        this.ctxCharacter = null;
        this.ctxAllCharacters = null;
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
        const multicharacterCanvas = document.createElement('canvas');
        multicharacterCanvas.width = 800;
        multicharacterCanvas.height = 400;
        multicharacterCanvas.style.zIndex = '2';
        multicharacterCanvas.style.position = 'absolute';
        multicharacterCanvas.style.top = '0';
        multicharacterCanvas.style.left = '0';

        this.ctxAllCharacters = multicharacterCanvas.getContext('2d');
        divmap.appendChild(multicharacterCanvas);

        const characterCanvas = document.createElement('canvas');
        characterCanvas.width = 800;
        characterCanvas.height = 400;
        characterCanvas.style.zIndex = '3';
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

    asset_selection(orientation, skin){
        switch(skin){
            case 0:
                switch(orientation){
                    case "N":
                        return './images/Persos/Guards-Tileset/Guards-Planche_03.png';
                    case "S":
                        return './images/Persos/Guards-Tileset/Guards-Planche_05.png';
                    case "E":
                        return './images/Persos/Guards-Tileset/Guards-Planche_09.png';
                    case "W":
                        return './images/Persos/Guards-Tileset/Guards-Planche_07.png';
                }
            case 2:
                switch(orientation){
                    case "N":
                        return './images/Persos/James-Tileset/James-Planche_00.png.png';
                    case "S":
                        return './images/Persos/James-Tileset/James-Planche_03.png';
                    case "E":
                        return './images/Persos/James-Tileset/James-Planche_09.png';
                    case "W":
                        return './images/Persos/James-Tileset/James-Planche_06.png';
                }
            case 1:
                switch(orientation){
                    case "N":
                        return './images/Persos/Jessie-Tileset/Jessie-Planche_03.png';
                    case "S":
                        return './images/Persos/Jessie-Tileset/Jessie-Planche_05.png';
                    case "E":
                        return './images/Persos/Jessie-Tileset/Jessie-Planche_09.png';
                    case "W":
                        return './images/Persos/Jessie-Tileset/Jessie-Planche_07.png';
                }
            }
    }

    draw_all_players(data){
        data.forEach(player => {
            this.ctxAllCharacters.clearRect(0, 0, this.ctxAllCharacters.canvas.width, this.ctxAllCharacters.canvas.height);
            if (player.userID != this.userID && player.active && player.player_map == this.map){
                const img = new Image();
                    img.src = this.asset_selection(player.orientation, player.player_skin);
                    img.onload = () => {
                        this.ctxAllCharacters.drawImage(img, player.posX * 16, (player.posY * 16) - 16,  16, 32);
                    }
                }
        });
    }


    drawplayer(data){
        let player = data.find(player => player.userID == this.userID);
        console.log(player);
        if (player.player_status === 1)
            console.warn("combat");
        if (player.player_status === 2)
            console.warn("talk");
        if (player.player_map != 0)
            console.warn("map");
        const img = new Image();
        img.src = this.asset_selection(player.orientation, player.player_skin);
        img.onload = () => {
            this.ctxCharacter.clearRect(this.lastX * 16, (this.lastY * 16) - 16, 16, 32);
            this.ctxCharacter.drawImage(img, player.posX * 16, (player.posY * 16) - 16,  16, 32);
            this.lastX = player.posX;
            this.lastY = player.posY;
            this.map = player.player_map;
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
        const socket = new WebSocket("wss://" + window.location.host + "/ws/pokemap/");
        this.userID = id;
        
        socket.onopen = async (e) => {
            console.log("WebSocket connection opened.");
            socket.send(JSON.stringify({
                action: "connect",
                userID: id,
            }));
            
        }


        socket.onclose = function(event){
            console.log("Websocket connection closed.");
            
        }

        socket.onmessage = (e) => {
            let parsed_data = JSON.parse(e.data);
            this.draw_all_players(parsed_data);
            this.drawplayer(parsed_data)
            socket.send(JSON.stringify({
                action: "get_players"}));
        }

        document.onkeydown = (event) => {
            event.preventDefault();
            if (event.key == 'ArrowUp')
            {
                socket.send(JSON.stringify({
                    action: "move",
                    new: "y-",
                    userID: id,
                }));
                
            }
            if (event.key == 'ArrowDown'){
                socket.send(JSON.stringify({
                    action: "move",
                    new: "y+",
                    userID: id,
                }));
            }
            if (event.key == 'ArrowRight'){
                socket.send(JSON.stringify({
                    action: "move",
                    new: "x+",
                    userID: id,
                }));
            }
            if (event.key == 'ArrowLeft'){
                socket.send(JSON.stringify({
                    action: "move",
                    new: "x-",
                    userID: id,
                }));
            }
        };
    }

}