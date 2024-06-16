import Iuser from "../user/userInfo.js";
import { setup } from "./pongServLogic.js";

export class localInput {

  constructor() {
    this.players = null;
  }

  async initLocalInfo() {
    try {
      const username = await Iuser.getUsername();
      const localForm = this.displayLocal(username)
      return localForm;
    } catch (error) {
      console.error('Error', error);
    }
  }

  displayLocal(username) {
    let localContainer = document.createElement('div');
    localContainer.id = 'app-general-container';
    document.querySelector('main').appendChild(localContainer);

    let alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    localContainer.appendChild(alertContainer);

    let form = document.createElement('form');
    form.setAttribute('id', 'tournament-form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', '');
    form.setAttribute('class', 'container');
    let elementContainer =
      `
				<div class="mb-4">
				<h5>Who is going to play today?</h5>
				</div>
				<div class="mb-4">
					<input type="text" class="form-control" name="player1" placeholder="player 1" value="${username}" readonly>
				</div>
				<div class="mb-4">
					<input type="text" class="form-control" name="player2" placeholder="player" maxlength="15">
				</div>
				<button type="submit" class="btn btn-dark">Validate</button>
			`
    form.innerHTML = elementContainer;

    localContainer.appendChild(form);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const player2Input = document.querySelector('input[name="player2"]');
      const alphanumericRegex = /^[a-z0-9]+$/i;

      if (!alphanumericRegex.test(player2Input.value)) {
        alert('Incorrect player name');
        return;
      }

      const formData = new FormData(form);
      const players = Object.fromEntries(formData.entries());

      this.players = players;
      setup("local", players);
    });

    return localContainer;
  }
}
