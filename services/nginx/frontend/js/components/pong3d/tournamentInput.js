import Iuser from "../user/userInfo.js";

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
				<input type="text" class="form-control" name="player1" placeholder="player 1" value="${username}" readonly>
			</div>
			<div class="mb-4">
				<input type="text" class="form-control" name="player2" placeholder="player">
			</div>
			<div class="mb-4">
				<input type="text" class="form-control" name="player3" placeholder="player">
			</div>

			<div class="mb-4">
				<input type="text" class="form-control" name="player4" placeholder="player">
			</div>
			<button type="submit" class="btn btn-dark">Validate</button>
		`
    form.innerHTML = elementContainer;

    tournamentContainer.appendChild(form);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);

      const players = Object.fromEntries(formData.entries());

      console.log(players);
      this.players = players;

    });

    return tournamentContainer;
  }
}
