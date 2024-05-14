
import {MatchmakingButtons} from "../components/matchmaking/matchmakingClass.js";
import {pokeMap} from "../components/pokemon/pokemap.js";
import Icookies from "../components/cookie/cookie.js"


export default () => {
        const gamediv = document.createElement('div');
	if (Icookies.getCookie('token') != null) {
                gamediv.appendChild(new MatchmakingButtons().buttonsCreation());
                gamediv.appendChild(new pokeMap().startingPokeverse());
        } else {
                gamediv.classList.add('not-logged');
                gamediv.innerText = 'You need to be logged in to play';
        }
        document.body.appendChild(gamediv);
        return gamediv;
}