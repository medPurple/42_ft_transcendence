import {pongRemoteMatchmaking, pongTournamentMatchmaking, pkmRemoteMatchmaking, pkmTournamentMatchmaking} from "../components/matchmaking/matchmakingClass.js";
import {pokeMap} from "../components/pokemon/pokemap.js";
import Icookies from "../components/cookie/cookie.js"


export async function pong_remoteplay() {
        const gamediv = document.createElement('div');
	if (Icookies.getCookie('token') != null) {
                gamediv.appendChild(await pongRemoteMatchmaking.mainMatchmakingDiv());
        } else {
                gamediv.classList.add('not-logged');
                gamediv.innerText = 'You need to be logged in to play';
        }
        document.body.appendChild(gamediv);
        return gamediv;
}

export async function pong_tournamentplay() {
        const gamediv = document.createElement('div');
	if (Icookies.getCookie('token') != null) {
                gamediv.appendChild(await pongTournamentMatchmaking.mainMatchmakingDiv());
        } else {
                gamediv.classList.add('not-logged');
                gamediv.innerText = 'You need to be logged in to play';
        }
        document.body.appendChild(gamediv);
        return gamediv;
}

export async function pkm_remoteplay() {
        const gamediv = document.createElement('div');
	if (Icookies.getCookie('token') != null) {
                gamediv.appendChild(await pkmRemoteMatchmaking.mainMatchmakingDiv());
        } else {
                gamediv.classList.add('not-logged');
                gamediv.innerText = 'You need to be logged in to play';
        }
        document.body.appendChild(gamediv);
        return gamediv;
}

export async function pokemap_interactive() {
        const gamediv = document.createElement('div');
	if (Icookies.getCookie('token') != null) {
                gamediv.appendChild(new pokeMap().startingPokeverse());
        } else {
                gamediv.classList.add('not-logged');
                gamediv.innerText = 'You need to be logged in to play';
        }
        document.body.appendChild(gamediv);
        return gamediv;
}