import {pongRemoteMatchmaking, pongTournamentMatchmaking, pkmRemoteMatchmaking, pkmTournamentMatchmaking} from "../components/matchmaking/matchmakingClass.js";
import {pokeMap} from "../components/pokemon/pokemap.js";
import Icookies from "../components/cookie/cookie.js"
import { setup } from "../components/pong3d/pongServLogic.js";


export function pong_localplay() {
    const generaldiv = document.createElement('div');
    const gamediv = document.createElement('div');
    gamediv.id = "pong-renderer"
    const scorediv = document.createElement('div');
    scorediv.id = "pong-score"
    if (Icookies.getCookie('token') != null) {
		setup("local");
    } else {
        generaldiv.classList.add('not-logged');
        generaldiv.innerText = 'You need to be logged in to play';
    }
    generaldiv.appendChild(gamediv);
    generaldiv.appendChild(scorediv);
    document.body.appendChild(generaldiv);
    return generaldiv;
}

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