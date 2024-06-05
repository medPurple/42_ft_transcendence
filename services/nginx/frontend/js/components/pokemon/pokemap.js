import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";


export class pokeMap {

	constructor() {
		this.userID = null;
		this.map = 0;
		this.ctxMAP = null;
		this.ctxAllCharacters = null;
	}

	divmapCreation() {

		// MAP DIV
		const divmap = document.createElement('div');
		divmap.classList.add('PokeGB');

		// IMG
		const img = document.createElement('img');
		img.classList.add('game-boy-background');
		img.src = '../images/Site/BG-GameBoy-win964x880.png';

		// CANVAS
		const canvas = document.createElement('canvas');
		canvas.classList.add('pokecanva');
		canvas.width = 500;
		canvas.height = 500;

		this.ctxMAP = canvas.getContext('2d');
		
		divmap.appendChild(img);
		divmap.appendChild(canvas);
		document.body.appendChild(divmap);
		
		return divmap;
	}

    getx(x, mainx) {
        return 254 + (x - mainx) * 26;
    }

    gety(y, mainy) {
        return 192 + (y - mainy) * 23;
    }


    drawmap(data){
        let player = data.find(player => player.userID == this.userID);
        if (player.player_status === 1)
            console.warn("combat");
        if (player.player_status === 2)
            console.warn("talk");
        if (player.player_map != 0)
            console.warn("map");
        const mapimage = new Image(520 , 510);
        mapimage.src = './images/Maps/ext_grid.png';
        const img = new Image();
        img.src = this.asset_selection(player.orientation, player.player_skin);
        mapimage.onload = () => {
            let mainx = (player.posX - (19/2)) * 16;
            let mainy = (player.posY - (19/2)) * 16;
            let pmainx = player.posX;
            let pmainy = player.posY;
            this.ctxMAP.drawImage(mapimage, mainx, mainy, 19 * 16, 19 * 16, 0, 0, 520, 510);
            data.forEach(player => {
                if (player.userID != this.userID && player.active && player.player_map == this.map) {
                        if (player.posX < pmainx + 10 && player.posX > pmainx - 10 && player.posY < pmainy + 10 && player.posY > pmainy - 10) {
                            let playerX = this.getx(player.posX, pmainx);
                            let playerY = this.gety(player.posY, pmainy);
                            const otherimg = new Image();
                            otherimg.src = this.asset_selection(player.orientation, player.player_skin);
                            otherimg.onload = () => {
                                this.ctxMAP.drawImage(otherimg, playerX, playerY, 25, 50);
                            }
                        }
                }
            });
            this.ctxMAP.drawImage(img, 500/2 - 16/2 + 12, 500/2 - 24, 25, 50);
        }
        this.map = player.player_map;
    }

    asset_selection(orientation, skin) {
        switch (skin) {
            case 0:
                switch (orientation) {
                    case "N":
                        return './images/Persos/Guards-Tileset/Guard_00.png';
                    case "S":
                        return './images/Persos/Guards-Tileset/Guard_03.png';
                    case "E":
                        return './images/Persos/Guards-Tileset/Guard_09.png';
                    case "W":
                        return './images/Persos/Guards-Tileset/Guard_06.png';
                }
            case 2:
                switch (orientation) {
                    case "N":
                        return './images/Persos/James-Tileset/James_00.png';
                    case "S":
                        return './images/Persos/James-Tileset/James_03.png';
                    case "E":
                        return './images/Persos/James-Tileset/James_09.png';
                    case "W":
                        return './images/Persos/James-Tileset/James_06.png';
                }
            case 1:
                switch (orientation) {
                    case "N":
                        return './images/Persos/Jessie-Tileset/Jessie_00.png';
                    case "S":
                        return './images/Persos/Jessie-Tileset/Jessie_03.png';
                    case "E":
                        return './images/Persos/Jessie-Tileset/Jessie_09.png';
                    case "W":
                        return './images/Persos/Jessie-Tileset/Jessie_06.png';
                }
        }
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
            
            if (event.key == 'ArrowUp') {
                event.preventDefault();
                socket.send(JSON.stringify({
                    action: "move",
                    new: "y-",
                    userID: id,
                }));

            }
            if (event.key == 'ArrowDown') {
                event.preventDefault();
                socket.send(JSON.stringify({
                    action: "move",
                    new: "y+",
                    userID: id,
                }));
            }
            if (event.key == 'ArrowRight') {
                event.preventDefault();
                socket.send(JSON.stringify({
                    action: "move",
                    new: "x+",
                    userID: id,
                }));
            }
            if (event.key == 'ArrowLeft') {
                event.preventDefault();
                socket.send(JSON.stringify({
                    action: "move",
                    new: "x-",
                    userID: id,
                }));
            }
        };
    }

}