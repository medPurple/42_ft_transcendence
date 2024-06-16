import Iuser from "../user/userInfo.js";

export class pokechat {

	constructor(){
		const roomName = 'pokeroom';
		this.chatSocket = new WebSocket(
			'wss://' + window.location.host + '/ws/chat/'
			+ roomName
			+ '/'
		);
	}

	createTitleAndModal(){
		const titleAndButtonDiv = document.createElement('div');
		const modalButton = document.createElement('button');

		modalButton.classList.add('btn', 'btn-dark', 'w-100', 'rounded');
		modalButton.setAttribute('data-bs-toggle', 'modal');
		modalButton.setAttribute('data-bs-target', '#participantsModal');
		modalButton.setAttribute('type', 'button');
		modalButton.innerText = 'Who\'s there ?';
		titleAndButtonDiv.appendChild(modalButton);

		const title = document.createElement('h5');
		title.classList.add('p-2');
		title.innerText = 'Pokechat';
		titleAndButtonDiv.appendChild(title);

		return titleAndButtonDiv;
	}

	createModal(){
		const participantsModal = document.createElement('div');
		participantsModal.classList.add('modal', 'fade');
		participantsModal.id = 'participantsModal';

		const modalDialog = document.createElement('div');
		modalDialog.classList.add('modal-dialog');

		const modalContent = document.createElement('div');
		modalContent.classList.add('modal-content', 'bg-dark', 'text-white');

		const modalBody = document.createElement('div');
		modalBody.classList.add('modal-body');
		modalBody.innerText = 'Participants: ';

		modalContent.appendChild(modalBody);
		modalDialog.appendChild(modalContent);
		participantsModal.appendChild(modalDialog);

		return participantsModal;
	}

	createChatbox(){
		const chatbox = document.createElement('div');
		chatbox.classList.add('bg-white', 'rounded', 'mb-3', 'chatbox','flex-grow-1', 'd-flex', 'flex-column');
		chatbox.style.padding = '12px';
		chatbox.style.overflowWrap = 'break-word';
		chatbox.style.overflowY = 'auto';
		chatbox.style.textAlign = 'left';
		chatbox.style.flexGrow = '1';
	
		return chatbox;
	}

	createInputAndButtonArea() {
		const inputAndButtonDiv = document.createElement('div');
		inputAndButtonDiv.classList.add('d-flex');

		const inputArea = document.createElement('textarea');
		inputArea.classList.add('form-control', 'flex-grow-1', 'border');
		inputArea.style.resize = 'none';
		inputArea.placeholder = 'Write here...';
		inputAndButtonDiv.appendChild(inputArea);

		const sendButton = document.createElement('button');
		sendButton.classList.add('btn', 'btn-dark', 'btn-sm', 'ms-2', 'send-button');
		
		sendButton.innerText = 'Send';
		inputAndButtonDiv.appendChild(sendButton);

		return inputAndButtonDiv;
	}


	createElement() {
		const chatdiv = document.createElement('div');
		chatdiv.classList.add('d-flex', 'flex-column', 'text-black', 'justify-content-center');
		chatdiv.style.height = '50vw';
		chatdiv.appendChild(this.createTitleAndModal());
		chatdiv.appendChild(this.createModal());
		chatdiv.appendChild(this.createChatbox());
		chatdiv.appendChild(this.createInputAndButtonArea());

		return chatdiv
	}

	getRandomColor(){
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	async getusername(id){
		const users = await Iuser.getAllUsers();
		let username = users.users.find(user => user.user_id === parseInt(id)).username;
		return username;
	}

	timerCalculation(date) {
		try {
			let time = new Date(date);
			if (isNaN(time.getTime())) {
			return 0;
			}
			const options = { day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' };
			return time.toLocaleDateString('en-US', options);
		} catch (error) {
			return (0);
		}
	}

	async addChatMessage(message, id, timestamp){
		const chatbox = document.querySelector('.chatbox');
		const userID = await Iuser.getID();
		const username = await this.getusername(id);
		
		const messageDiv2 = document.createElement('div');
		messageDiv2.classList.add('d-flex', 'mb-2');

		if (id == userID) {
			messageDiv2.classList.add('align-self-end');
			messageDiv2.style.justifyContent = 'flex-end';
		}
		else {
			messageDiv2.classList.add('align-self-start');
			messageDiv2.style.justifyItems = 'flex-start';
		}

		const usernameColor = this.getRandomColor();
		const name = document.createElement('div');

		name.textContent = username;
		name.style.color = usernameColor;
		name.style.fontWeight = 'bold';
		if (id == userID)
			name.classList.add('align-self-end');
		else
			name.classList.add('align-self-start');

		const time = document.createElement('div');
		let timer = this.timerCalculation(timestamp);
		time.style.color = 'gray';
		time.textContent = ' ' + timer;
		if (id == userID)
			time.classList.add('align-self-end');
		else
			time.classList.add('align-self-start');
		
		chatbox.appendChild(name);
		chatbox.appendChild(time);

		const msg = document.createElement('div');
		msg.classList.add('mb-2', 'rounded', 'p-2');
		msg.style.backgroundColor = 'grey';
		msg.style.maxWidth = '20vw';
		msg.style.overflow = 'auto';
		msg.style.overflowWrap = 'break-word';
		msg.textContent = message;
		msg.style.textAlign = 'left';
		if (id == userID) {
			msg.style.backgroundColor = 'lightgrey';
			msg.classList.add('align-self-end');
		}

		messageDiv2.appendChild(msg);
		chatbox.appendChild(messageDiv2);
	}

	pokechatinit(){
		const chatdiv = this.createElement();
		const chatbox = chatdiv.querySelector('.chatbox');
		const chatInput = chatdiv.querySelector('textarea');
		const chatMessageSubmit = chatdiv.querySelector('.send-button');

		this.chatSocket.onmessage = async (e) => {
			const data = JSON.parse(e.data);
			const message = data.message;
			const id = data.user_id;
			const time = data.time;
			await this.addChatMessage(message, id, time);
		};

		chatInput.focus();
		chatInput.onkeydown = function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
			}
		};
		chatInput.onkeyup =	(e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				chatMessageSubmit.click();
			}
		};

		chatMessageSubmit.onclick = async (e) => {
			const message = chatInput.value;
			const user_id = await Iuser.getID();
			if (user_id === '') {
				console.error("You're not logged !");
			} else {
				this.chatSocket.send(JSON.stringify({
					'message': message,
					'user_id': user_id
				}));
			}
			chatInput.value = '';
		}
		return chatdiv;
	}
}

export class pokebag{ 

	createCardLevel(pokemon){
		const cardTitle = document.createElement('h6');
		cardTitle.classList.add('card-title');
		cardTitle.innerText = pokemon.name;
		return cardTitle;
	}

	createCardTitle(pokemon) {
		const cardLevel = document.createElement('h6');
		cardLevel.classList.add('card-level');
		cardLevel.innerText = "N.	" + pokemon.level;
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
		card.classList.add('card', 'mb-3', 'cardelement', 'border');
		
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
				level: Math.floor(Math.random() * 100) + 1,
				pvMax: maxpv,
				pvActuel: Math.floor(Math.random() * (maxpv + 1)),
			};
			
			pokelist.push(pokemon);
		}
		
		return pokelist;
	}
		
	createAllCards(){
		const bagdiv = document.createElement('div');
		const pokelist = this.getpokelist();

		pokelist.forEach(pokemon => {
			bagdiv.appendChild(this.createCard(pokemon));
		});
		
		return bagdiv
	}
}