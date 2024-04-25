
import {MatchmakingButtons,matchmaking} from "../components/matchmaking/matchmakingClass.js";
import {pokeMap} from "../components/pokemon/pokemap.js";

export default () =>
        new MatchmakingButtons(matchmaking).buttonsCreation();
        new pokeMap().divmapCreation();
