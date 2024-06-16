import Icookies from "../cookie/cookie.js"
import Iuser from "../user/userInfo.js"
import Ifriends from "../friends/friendsInfo.js";

export class chat {

  constructor() {
    this.targetid = null;
    this.websocket = null;
    this.player1 = null;
    this.player2 = null;
  }

  async getusername(id) {

    console.log('id', id);
    const users = await Iuser.getAllUsers();
    let username = users.users.find(user => user.user_id === parseInt(id)).username;
    console.log('username', username);
    return username;

  }

  createChatDiv() {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('m-3', 'rounded', 'd-flex');;
    chatDiv.style.height = 'calc(100vh - 2rem)';
    chatDiv.id = 'chatDiv';
    return chatDiv;
  }

  async createUsersDiv() {
    const usersDiv = document.createElement('div');
    usersDiv.classList.add('d-flex', 'flex-column', 'rounded');
    usersDiv.style.flex = '1'; // Ajoute la propriété flex
    usersDiv.id = 'usersDiv';

    const title = document.createElement('h2'); // Crée un nouvel élément de titre
    title.textContent = 'User List'; // Ajoute du texte au titre
    title.classList.add('text-underline', 'mt-3'); // Ajoute une marge en haut et souligne le texte
    usersDiv.appendChild(title); // Ajoute le titre à usersDiv


    const response = await Iuser.getAllUsers();
    const id = await Iuser.getID()

    response.users.forEach(user => {
      if (user.user_id != id) {
        const userButton = document.createElement('button');
        userButton.classList.add('btn', 'btn-lg', 'w-100', 'rounded', 'bg-light');
        userButton.textContent = user.username;
        usersDiv.appendChild(userButton);
        userButton.onclick = async (e) => {
          console.log("user id ", user.user_id);
          this.targetid = user.user_id;
          const interactiondiv = document.querySelector('.interactionDiv');
          const Nonediv = document.querySelector('.Nonediv');
          if (Nonediv)
            Nonediv.remove();
          else {
            this.websocket.send(JSON.stringify({
              'message': '@refuse@',
              'user_id': await Iuser.getID()
            }));
            this.player1 = null;
            this.player2 = null;
            this.websocket.close();
            interactiondiv.remove();
          }
          const newinteractiondiv = await this.createInteractionDiv();
          document.querySelector('#chatDiv').appendChild(newinteractiondiv);
          this.createChat();
        }
      }
    });

    return usersDiv;
  }

  async createMessagesDiv() {

    const messagesDiv = document.createElement('div');
    messagesDiv.classList.add('p-3', 'mt-auto', 'flex-grow-1', 'bg-white', 'rounded');
    messagesDiv.id = 'messagesDiv';
    messagesDiv.textContent = '';
    messagesDiv.style.overflowY = 'scroll'; // Ajoute la propriété overflow-y: scroll
    return messagesDiv;
  }

  createInputDiv() {
    const inputDiv = document.createElement('div');
    inputDiv.id = 'inputDiv';
    inputDiv.classList.add('p-3', 'mt-auto');

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'messageInput';
    input.classList.add('form-control', 'mr-2');

    const sendButton = document.createElement('button');
    sendButton.id = 'sendButton';
    sendButton.textContent = 'Send';
    sendButton.classList.add('btn', 'btn-dark');

    inputDiv.appendChild(input);
    inputDiv.appendChild(sendButton);

    return inputDiv;
  }

  async createTitleDiv() {
    const response = await Iuser.getAllUsers();
    let user = response.users.find(user => user.user_id === parseInt(this.targetid));
    // console.warn(user)

    const titleDiv = document.createElement('div');
    titleDiv.id = 'titleDiv';
    titleDiv.classList.add('bg-light', 'mb-3', 'align-items-center', 'w-100', 'p-1', 'border', 'rounded');

    const titleElement = document.createElement('h1');
    titleElement.textContent = user.username;
    titleElement.href = `/friend-profile/${user.username}`;
    titleElement.setAttribute('data-link', '');
    titleElement.classList.add('text-center', 'font-italic', 'mr-3');

    const inviteButton = document.createElement('button');
    inviteButton.id = 'inviteButton';
    inviteButton.textContent = 'Invite';
    inviteButton.classList.add('btn', 'btn-secondary', 'ml-3', 'mr-3', 'mb-3', 'p-2'); // Ajoute les classes ml-auto et mr-2


    titleDiv.appendChild(titleElement);
    titleDiv.appendChild(inviteButton);

    const getUserBlockStatut = await Ifriends.getUserBlock(user.username);
    if (getUserBlockStatut.user_blocked_other) {
      const unblockButton = document.createElement('button');
      unblockButton.id = 'unblockButton';
      unblockButton.textContent = 'Unblock';
      unblockButton.classList.add('btn', 'btn-danger', 'mr-3', 'ml-3'); // Ajoute la classe mr-2
      this.unblockExec(unblockButton, user.username);
      titleDiv.appendChild(unblockButton);

    }
    else if (getUserBlockStatut.other_user_blocked_user) {
      const blockedButton = document.createElement('button');
      blockedButton.id = 'blockedButton';
      blockedButton.textContent = 'Blocked';
      blockedButton.classList.add('btn', 'btn-danger', 'mr-3', 'ml-3');
      blockedButton.disabled = true;
      titleDiv.appendChild(blockedButton);

    } else {
      const blockButton = document.createElement('button');
      blockButton.id = 'blockButton';
      blockButton.textContent = 'Block';
      blockButton.classList.add('btn', 'btn-danger', 'mr-3', 'ml-3', 'mb-3', 'p-2'); // Ajoute la classe mr-2
      this.blockExec(blockButton, user.username);
      titleDiv.appendChild(blockButton);
    }

    return titleDiv;
  }

  async blockExec(blockButton, username) {
    blockButton.onclick = async () => {
      try {
        const blockIsValid = await Ifriends.blockUser(username);
        console.log(blockIsValid);
        if (blockIsValid.success) {
          blockButton.textContent = 'User is blocked';
          blockButton.disabled = true;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  async unblockExec(unblockButton, username) {
    unblockButton.onclick = async () => {
      try {
        const unblockIsValid = await Ifriends.unblockUser(username);
        console.log(unblockIsValid)
        if (unblockIsValid.success) {
          unblockButton.textContent = 'User is unblocked';
          unblockButton.disabled = true;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  async checkBlockStatus(id) {
    const username = await this.getusername(id)
    try {
      const blockStatus = await Ifriends.getUserBlock(username);
      console.log(blockStatus);
      if (blockStatus.success) {
        return true;
      }
      else {
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
    }

  }


  async createInteractionDiv() {
    const interactiondiv = document.createElement('div');
    interactiondiv.classList.add('interactionDiv', 'd-flex', 'flex-column', 'p-3');
    interactiondiv.style.flex = '3'; // Ajoute la propriété flex

    const messagesDiv = await this.createMessagesDiv();
    const inputDiv = this.createInputDiv();
    const titleDiv = await this.createTitleDiv();


    interactiondiv.appendChild(titleDiv);
    interactiondiv.appendChild(messagesDiv);
    interactiondiv.appendChild(inputDiv);

    return interactiondiv;
  }

  createNonediv() {
    const Nonediv = document.createElement('div');
    Nonediv.classList.add('d-flex', 'flex-column', 'border', 'border-dark', 'rounded', 'Nonediv');
    Nonediv.style.width = '100%'; // Set the width to 100%
    Nonediv.style.height = '100%'; // Set the height to 100%
    Nonediv.style.display = 'flex'; // Set display to flex
    Nonediv.style.justifyContent = 'center'; // Center along the main axis
    Nonediv.style.alignItems = 'center'; // Center along the cross axis

    const img = new Image();
    img.classList.add('w-100', 'h-100'); // Set width and height to 100%
    img.src = "../../../images/Site/AloneAgain.gif";

    Nonediv.appendChild(img);
    Nonediv.style.flex = '3';
    return Nonediv;
  }

  async initChat() {
    const chatDiv = this.createChatDiv();
    const usersDiv = await this.createUsersDiv();

    chatDiv.appendChild(usersDiv);
    if (this.targetid)
      chatDiv.appendChild(await this.createInteractionDiv());
    else
      chatDiv.appendChild(this.createNonediv());
    document.body.appendChild(chatDiv);
    return chatDiv;
  }

  async addMessage(user_id, message, timestamp) {
    const messagediv = document.querySelector('#messagesDiv');
    messagediv.classList.add('d-flex', 'flex-column', 'mb-2');

    const messageDiv2 = document.createElement('div'); // Create a new div for each message
    messageDiv2.classList.add('d-flex', 'mb-2');
    if (user_id == await Iuser.getID()) {
      console.log('end user_id', user_id);
      messageDiv2.classList.add('align-self-end');
    }
    else {
      console.log('start user_id', user_id);
      messageDiv2.classList.add('align-self-start');
    }

    const username = await this.getusername(user_id);
    const usernameColor = this.getRandomColor(); // Function to generate random color

    const name = document.createElement('span');
    name.style.color = usernameColor;
    name.textContent = username;
    name.style.fontWeight = 'bold';
    messagediv.appendChild(name);

    const time = document.createElement('span');
    let timer = this.timerCalculation(timestamp);
    time.style.color = 'gray';
    time.textContent = ' ' + timer;
    messagediv.appendChild(time);

    const msg = document.createElement('p');
    msg.classList.add('mb-1', 'border', 'border-dark', 'rounded', 'p-2');
    msg.style.backgroundColor = 'grey';
    msg.textContent = message;
    console.log(user_id, await Iuser.getID());
    msg.style.backgroundColor = 'grey';
    if (user_id == await Iuser.getID())
      msg.style.backgroundColor = 'lightgrey';

    messageDiv2.appendChild(msg);
    messagediv.appendChild(messageDiv2); // Append the message div to the main messages div
  }

  timerCalculation(date) {

    try {
      console.log(date);
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

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  async checkInvite(data, id) {

    if (data === '@invite@') {
      console.warn('INVITATION BY' + id);
      return true;
    }
    return false;
  }

  createInviteButton() {
    const inputdiv = document.querySelector('#inputDiv');

    const messagediv = document.querySelector('#messagesDiv');
    messagediv.innerHTML += '<span style="color: darkgreen;">A game can be created if you both accept the invitation</span><br>';

    inputdiv.appendChild(this.createAcceptButton());
    inputdiv.appendChild(this.createRefuseButton());
  }

  createAcceptButton() {
    const acceptButton = document.createElement('button');
    acceptButton.id = 'acceptButton';
    acceptButton.textContent = 'Accept';
    acceptButton.classList.add('btn', 'btn-dark', 'mr-2');

    acceptButton.onclick = async (e) => {
      console.log('accept');
      this.websocket.send(JSON.stringify({
        'message': '@accept@',
        'user_id': await Iuser.getID()
      }));
      const inputdiv = document.querySelector('#inputDiv');
      const acceptButton = inputdiv.querySelector('#acceptButton');
      const refuseButton = inputdiv.querySelector('#refuseButton');

      acceptButton.remove();
      refuseButton.remove();
    }

    return acceptButton;
  }

  createRefuseButton() {
    const refuseButton = document.createElement('button');
    refuseButton.id = 'refuseButton';
    refuseButton.textContent = 'Refuse';
    refuseButton.classList.add('btn', 'btn-secondary');

    refuseButton.onclick = async (e) => {
      console.log('refuse');
      this.websocket.send(JSON.stringify({
        'message': '@refuse@',
        'user_id': await Iuser.getID()
      }));
      const inputdiv = document.querySelector('#inputDiv');
      const acceptButton = inputdiv.querySelector('#acceptButton');
      const refuseButton = inputdiv.querySelector('#refuseButton');

      acceptButton.remove();
      refuseButton.remove();
    }

    return refuseButton;

  }

  async checkInviteStatus(data, id) {
    if (data === '@accept@') {
      console.warn('ACCEPTED BY' + id);
      if (this.player1 === null)
        this.player1 = id;
      else if (this.player2 === null)
        this.player2 = id;
      return true;
    }
    else if (data === '@refuse@') {
      console.warn('REFUSED BY' + id);
      this.player1 = null;
      this.player2 = null;
      const inviteButton = document.querySelector('#inviteButton');
      const acceptButton = document.querySelector('#acceptButton');
      const refuseButton = document.querySelector('#refuseButton');
      inviteButton.disabled = false;

      if (acceptButton)
        acceptButton.remove();
      if (refuseButton)
        refuseButton.remove();
      return true;
    }
    return false;

  }

  async createChat() {
    let myid = await Iuser.getID()
    let roomName = ''
    const interactiondiv = document.querySelector('.interactionDiv');
    const inputDiv = interactiondiv.querySelector('#inputDiv');
    const input = inputDiv.querySelector('#messageInput');
    const sendButton = inputDiv.querySelector('#sendButton');
    const inviteButton = document.querySelector('#inviteButton');

    if (myid > this.targetid)
      roomName = myid + '_' + this.targetid;
    else
      roomName = this.targetid + '_' + myid;

    const response = await fetch(`https://localhost:4430/api/chat/history/${roomName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Icookies.getCookie('token'),
        'X-CSRFToken': Icookies.getCookie('csrftoken')
      },
      credentials: 'include',
    });
    const data = await response.json();
    if (data.success) {
      if (data.data) {
        console.log(data.data);
        data.data.forEach(message => {
          if (message.message[0] !== '@')
            this.addMessage(message.user_id, message.message, message.timestamp);
        });
      }
    } else
      alert('Failed to get chat history');

    this.websocket = new WebSocket(
      'wss://' + window.location.host + '/ws/chat/'
      + roomName
      + '/'
    );

    this.websocket.onopen = function(e) {
      console.log('Chat socket open');
    }

    this.websocket.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      console.log('data', data);
      const id = data['user_id'];
      const message = data['message'];
      const timestamp = data['time'];
      const invite = await this.checkInvite(message, id);
      const invitestatus = await this.checkInviteStatus(message, id);
      const blockstatus = await this.checkBlockStatus(id);
      if (invite) {
        inviteButton.disabled = true;
        this.createInviteButton();
      }
      else if (invitestatus) {
        console.warn('INVITATION STATUS');
        if (!this.player1 && !this.player2)
          inviteButton.disabled = false;
      }
      else if (!blockstatus) {
        await this.addMessage(id, message, timestamp);
      }
      if (this.player1 && this.player2) {
        console.log("Creating party");
        //await this.createParty(this.player1, this.player2);
        //await this.changeStatus();
        if (id == this.player1) {
          console.log("Je lance direct")
          window.location.href = "/play_pc"
        }
        else {
          console.log("Je lance apres")
          setTimeout(() => { window.location.href = "/play_pc"; }, 50);
        }
      }

    };

    this.websocket.onclose = function(e) {
      console.error('Chat socket closed unexpectedly');
    };

    input.focus();
    input.onkeyup = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendButton.click();
      }
    };

    sendButton.onclick = async (e) => {
      const message = input.value;
      const user_id = await Iuser.getID();
      this.websocket.send(JSON.stringify({
        'message': message,
        'user_id': user_id
      }));
      input.value = '';
    }

    inviteButton.onclick = async (e) => {
      const user_id = await Iuser.getID();
      this.websocket.send(JSON.stringify({
        'message': '@invite@',
        'user_id': user_id
      }));
    }

  }

  async createParty(id1, id2) {
    const users = await Iuser.getAllUsers();
    let username1 = users.users.find(user => user.user_id === parseInt(id1)).username;
    let username2 = users.users.find(user => user.user_id === parseInt(id2)).username;
    const party = {
      "player1": {
        id: id1,
        username: username1
      },
      "player2": {
        id: id2,
        username: username2
      },
    }
    const response = await fetch('https://localhost:4430/api/pong/match/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Icookies.getCookie('token'),
        'X-CSRFToken': Icookies.getCookie('csrftoken')
      },
      credentials: 'include',
      body: JSON.stringify(party)
    });
    console.log(response);
  }

  async changeStatus() {
    console.log("Changing status to game.");
    const id = await Iuser.getID();
    const body = {
      "userID": id,
      "status": "game"
    }
    const response = await fetch('https://localhost:4430/api/matchmaking/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Icookies.getCookie('token'),
        'X-CSRFToken': Icookies.getCookie('csrftoken')
      },
      credentials: 'include',
      body: JSON.stringify(body)
    });
    console.log(response);
  }

}
