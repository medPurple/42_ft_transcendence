import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js";


export class pokechat{
    createElement(){
        console.warn("chat")
        const chatdiv = document.createElement('div');
        chatdiv.style.backgroundColor = 'black';

        const chatbox = document.createElement('div');
        chatbox.classList.add('bg-white', 'rounded', 'p-3', 'mb-3', 'chatbox');
        chatbox.innerText = 'Chatbox';

        chatdiv.appendChild(chatbox);
        return chatdiv
    }
}

export class pokebag{ 

    createCardLevel(pokemon){
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = pokemon.name; // Replace with your card title
        return cardTitle;
    }

    createCardTitle(pokemon) {
        const cardLevel = document.createElement('h5');
        cardLevel.classList.add('card-level');
        cardLevel.innerText = "N.  " + pokemon.level; // Replace with your card title
        return cardLevel;
    }

    createhealthbar(pokemon){

        const percentage = pokemon.pvActuel / pokemon.pvMax;

        const colorBarContainer = document.createElement('div');
        colorBarContainer.classList.add('border', 'border-dark', 'rounded', 'overflow-hidden');

        const colorBar = document.createElement('div');
        colorBar.classList.add('progress-bar');
        
        colorBar.style.height = '5px';
        colorBar.style.width = `${percentage * 100}%`;


        if (percentage < 0.33) {
            colorBar.classList.add('bg-danger');
        } else if (percentage < 0.67) {
            colorBar.classList.add('bg-warning');
        } else {
            colorBar.classList.add('bg-success');
        }

        colorBarContainer.appendChild(colorBar);
        return colorBarContainer;
    }

    createImage(pokemon){
        const img = document.createElement('img');
        if (pokemon.id < 10)
            img.src = "./images/Persos/Pokemon-Tileset/Pokemon-Planche_0" + pokemon.id + ".png"; // Replace with your image source
        else
            img.src = "./images/Persos/Pokemon-Tileset/Pokemon-Planche_" + pokemon.id + ".png"; // Replace with your image source
        img.classList.add('img-fluid', 'rounded-start');

        return img;
    }

    createCardElement(){
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'cardelement');
        card.style.maxWidth = '540px';
        card.style.margin = '5%';
        return card;
    }

    createCard(pokemon){

        
        const row = document.createElement('div');
        row.classList.add('row', 'g-0', 'cardelementrow');

        const colImg = document.createElement('div');
        colImg.classList.add('col-md-4', 'cardelementcolimg');

        const colContent = document.createElement('div');
        colContent.classList.add('col-md-8', 'cardelementcolcontent');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'cardelementcardbody');

        const titleLevelDiv = document.createElement('div');
        titleLevelDiv.classList.add('d-flex', 'justify-content-between'); 

        const card = this.createCardElement();
        const image = this.createImage(pokemon);
        const healthbar = this.createhealthbar(pokemon);
        const cardTitle = this.createCardTitle(pokemon);
        const cardLevel = this.createCardLevel(pokemon);

        colImg.appendChild(image);
        
        titleLevelDiv.appendChild(cardLevel);
        titleLevelDiv.appendChild(cardTitle);

        cardBody.appendChild(titleLevelDiv);
        cardBody.appendChild(healthbar);

        colContent.appendChild(cardBody);

        row.appendChild(colImg);
        row.appendChild(colContent);

        card.appendChild(row);

        return card;
    }

    getpokelist() {
        const pokelist = [];
        const maxPokemons = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
        
        for (let i = 0; i < maxPokemons; i++) {
            const maxpv = Math.floor(Math.random() * (200 - 10 + 1)) + 10;
            const pokemon = {
                name: "Bulbizarre",
                id: Math.floor(Math.random() * 15),
                level: Math.floor(Math.random() * 100) + 1, // Generate a random level between 1 and 100
                pvMax: maxpv,// Generate a random max HP between 1 and 100
                pvActuel: Math.floor(Math.random() * (maxpv + 1)), // Generate a random current HP between 0 and pvMax
            };
            
            pokelist.push(pokemon);
        }
        
        return pokelist;
    }
    
    createAllCards(){
        const bagdiv = document.createElement('div');

        const pokelist = this.getpokelist();
        console.warn(pokelist)
        pokelist.forEach(pokemon => {
            bagdiv.appendChild(this.createCard(pokemon));
        });
        
        return bagdiv
    }
}