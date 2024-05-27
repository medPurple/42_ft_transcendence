import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";


export class pokeMap {

    constructor() {
        this.userID = null;
        this.map = 0;
        this.ctxMAP = null;
        this.ctxAllCharacters = null;
        this.lastX = 0;
        this.lastY = 0;
    }

    divmapCreation() {

        // MAP DIV
        const divmap = document.createElement('div');
        divmap.style.textAlign = 'center';
        divmap.style.position = 'relative';
        divmap.style.width = '600px';
        divmap.style.height = '500px';
        divmap.style.marginLeft = '28%';
        divmap.style.marginTop = '5%';
        // divmap.style.marginRight = 'auto';


        // MAP CANVAS

        
        const pokecanva = document.createElement('canvas');
        pokecanva.width = 600;
        pokecanva.height = 500;
        pokecanva.style.zIndex = '1';
        pokecanva.style.position = 'absolute';
        pokecanva.style.top = '0';
        pokecanva.style.left = '0';
        this.ctxMAP = pokecanva.getContext('2d');
        divmap.appendChild(pokecanva);

        // CHARACTER CANVAS
        const multicharacterCanvas = document.createElement('canvas');
        multicharacterCanvas.width = 600;
        multicharacterCanvas.height = 500;
        multicharacterCanvas.style.zIndex = '2';
        multicharacterCanvas.style.position = 'absolute';
        multicharacterCanvas.style.top = '0';
        multicharacterCanvas.style.left = '0';

        this.ctxAllCharacters = multicharacterCanvas.getContext('2d');
        divmap.appendChild(multicharacterCanvas);

        // LOAD IMAGE

        document.body.appendChild(divmap);
        return divmap;
    }

    drawmap(data){
        let player = data.find(player => player.userID == this.userID);
        if (player.player_status === 1)
            console.warn("combat");
        if (player.player_status === 2)
            console.warn("talk");
        if (player.player_map != 0)
            console.warn("map");
        const mapimage = new Image(600 , 500);
        mapimage.src = './images/Maps/ext_grid.png';
        const img = new Image();
        img.src = this.asset_selection(player.orientation, player.player_skin);
        mapimage.onload = () => {
            let mainx = (player.posX - (19/2)) * 16;
            let mainy = (player.posY - (19/2)) * 16;
            let pmainx = player.posX * 16;
            let pmainy = player.posY * 16;
            this.ctxMAP.drawImage(mapimage, mainx, mainy, 19 * 16, 19 * 16, 0, 0, 500, 500);
            data.forEach(player => {
                if (player.userID != this.userID && player.active && player.player_map == this.map) {

                        const otherimg = new Image();
                        otherimg.src = this.asset_selection(player.orientation, player.player_skin);
                        console.warn(playerX, playerY, mainx, mainy, otherimg.src);
                        otherimg.onload = () => {
                            this.ctxMAP.drawImage(otherimg, playerX, playerY, 16, 32);
                        }
                    }
            });
            this.ctxMAP.drawImage(img, 500/2 - 16/2 + 12, 500/2 - 32/2, 25, 40);
        }
        this.map = player.player_map;
    }

    asset_selection(orientation, skin) {
        switch (skin) {
            case 1:
                switch (orientation) {
                    case "N":
                        return './images/Persos/Guards-Tileset/Guards-Planche_03.png';
                    case "S":
                        return './images/Persos/Guards-Tileset/Guards-Planche_05.png';
                    case "E":
                        return './images/Persos/Guards-Tileset/Guards-Planche_09.png';
                    case "W":
                        return './images/Persos/Guards-Tileset/Guards-Planche_07.png';
                }
            case 0:
                switch (orientation) {
                    case "N":
                        return "./images/player_n.png";
                        // return './images/Persos/James-Tileset/James-Planche_00.png';
                    case "S":
                        return "./images/player_s.png";
                        // return './images/Persos/James-Tileset/James-Planche_03.png';
                    case "E":
                        return "./images/player_e.png";
                        // return './images/Persos/James-Tileset/James-Planche_09.png';
                    case "W":
                        return "./images/player_w.png";
                        // return './images/Persos/James-Tileset/James-Planche_06.png';
                }
            case 1:
                switch (orientation) {
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

    draw_all_players(data) {
        data.forEach(player => {
            this.ctxAllCharacters.clearRect(0, 0, this.ctxAllCharacters.canvas.width, this.ctxAllCharacters.canvas.height);
            if (player.userID != this.userID && player.active && player.player_map == this.map) {
                const img = new Image();
                img.src = this.asset_selection(player.orientation, player.player_skin);
                img.onload = () => {
                    this.ctxAllCharacters.drawImage(img, player.posX * 16, (player.posY * 16) - 16, 16, 32);
                }
            }
        });
    }

    startingPokeverse() {
        const pokemondiv = document.createElement('div');
        pokemondiv.appendChild(this.divmapCreation());
        this.connection();
        return pokemondiv;
    }

    async connection() {
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


        socket.onclose = function (event) {
            console.log("Websocket connection closed.");

        }

        socket.onmessage = (e) => {
            let parsed_data = JSON.parse(e.data);
            this.drawmap(parsed_data);
            // this.draw_all_players(parsed_data);
            socket.send(JSON.stringify({
                action: "get_players"
            }));
        }

        document.onkeydown = (event) => {
            event.preventDefault();
            if (event.key == 'ArrowUp') {
                socket.send(JSON.stringify({
                    action: "move",
                    new: "y-",
                    userID: id,
                }));

            }
            if (event.key == 'ArrowDown') {
                socket.send(JSON.stringify({
                    action: "move",
                    new: "y+",
                    userID: id,
                }));
            }
            if (event.key == 'ArrowRight') {
                socket.send(JSON.stringify({
                    action: "move",
                    new: "x+",
                    userID: id,
                }));
            }
            if (event.key == 'ArrowLeft') {
                socket.send(JSON.stringify({
                    action: "move",
                    new: "x-",
                    userID: id,
                }));
            }
        };
    }

}