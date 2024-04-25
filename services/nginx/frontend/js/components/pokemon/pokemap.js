import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";


export class pokeMap{
    
    divmapCreation(){
        const divmap = document.createElement('div');
        const pokecanva = document.createElement('canvas');
        pokecanva.width = 800;
        pokecanva.height = 400;
        const mapimage = new Image(800, 400);
        mapimage.src = './images/image_with_grid.png';
        mapimage.onload = () => {
            var ctx = pokecanva.getContext('2d');
            ctx.drawImage(mapimage, 0 , 0);
        }
        divmap.appendChild(pokecanva);
        document.body.appendChild(divmap);
        
        return divmap;
    }
    
    startingPokeverse(){
        document.preven
        this.divmapCreation();
        this.connection();
    }
    
    async connection(){
        let id = await Iuser.getID();
        const socket = new WebSocket("ws://localhost:8080/ws/pokemap/");
        
        socket.onopen = function(event){
            console.log("WebSocket connection opened.");
            socket.send(JSON.stringify({
                type: "message",
                content: "Hey pokemap"
            }));
        }
        socket.onclose = function(event){
            console.log("Websocket connection closed.");
        }

        socket.onmessage = function(e){
            var parsed_data = JSON.parse(e.data)
            console.log(parsed_data);
        }

        document.onkeydown = (event) => {
            event.preventDefault();
            if (event.key == 'ArrowUp')
            {
                console.log("up");
                socket.send(JSON.stringify({
                    new: "y+",
                    userID: id,
                }));
                
            }
            if (event.key == 'ArrowDown'){
                console.log("down");
                socket.send(JSON.stringify({
                    new: "y-",
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