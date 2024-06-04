import { setup } from "../components/pong3d/pongServLogic.js";
import Icookies from "../components/cookie/cookie.js"

export default async function pong_remoteplay() {
    const generaldiv = document.createElement('div');
    const gamediv = document.createElement('div');
    gamediv.id = "pong-renderer"
    const scorediv = document.createElement('div');
    scorediv.id = "pong-score"
    if (Icookies.getCookie('token') != null) {
        await setup("remote");
    } else {
        generaldiv.classList.add('not-logged');
        alert("You need to be logged in to play in remote");
    }
    generaldiv.appendChild(gamediv);
    generaldiv.appendChild(scorediv);
    document.body.appendChild(generaldiv);
    return generaldiv;
}