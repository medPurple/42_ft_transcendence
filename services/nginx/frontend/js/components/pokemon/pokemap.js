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
        this.divmapCreation();
    }
}