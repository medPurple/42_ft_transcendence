import Iuser from "../user/userInfo.js";
import { setup } from "./pongServLogic.js";

export class tournamentInput {

  constructor() {
    this.players = null;
  }

  async initTournamentInfo() {
    try {
      const username = await Iuser.getUsername();
      const tournamentForm = this.displayTournament(username)
      return tournamentForm;
    } catch (error) {
      console.error('Error', error);
    }
  }

  displayTournament(username) {
    let tournamentContainer = document.createElement('div');
    tournamentContainer.id = 'app-general-container';
    document.querySelector('main').appendChild(tournamentContainer);

    let alertContainer = document.createElement('div');
    alertContainer.id = 'alert-container';
    tournamentContainer.appendChild(alertContainer);

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
				<div class="mb-4">
					<input type="text" class="form-control" name="player3" placeholder="player" maxlength="15">
				</div>

				<div class="mb-4">
					<input type="text" class="form-control" name="player4" placeholder="player" maxlength="15">
				</div>
				<button type="submit" class="btn btn-dark">Validate</button>
			`
    form.innerHTML = elementContainer;

    tournamentContainer.appendChild(form);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const player2Input = document.querySelector('input[name="player2"]');
      const player3Input = document.querySelector('input[name="player3"]');
      const player4Input = document.querySelector('input[name="player4"]');
      const alphanumericRegex = /^[a-z0-9]+$/i;

      if (!alphanumericRegex.test(player2Input.value)
        || !alphanumericRegex.test(player3Input.value)
        || !alphanumericRegex.test(player4Input.value)) {
        alert('Incorrect player names');
        return;
      }

      const formData = new FormData(form);
      const players = Object.fromEntries(formData.entries());

      this.players = players;
      setup("tournament", players);
    });

    return tournamentContainer;
  }
}
