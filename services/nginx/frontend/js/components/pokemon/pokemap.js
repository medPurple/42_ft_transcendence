import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";

export class pokeMap{

    constructor(){
        this.divmapCreation();
    }

    divmapCreation(){
        const divmap = document.createElement('div');
        const pokecanva = document.createElement('canvas');
        const mapimage = new Image(800, 400);
        mapimage.src = './images/image_with_grid.png';
        var ctx = pokecanva.getContext('2d');
        ctx.drawImage(mapimage, -20 , -20);
        divmap.appendChild(pokecanva);
        document.body.appendChild(divmap);
    }
}