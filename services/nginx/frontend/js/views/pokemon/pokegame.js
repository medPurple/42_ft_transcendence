import Icookies from "../../components/cookie/cookie.js"


export default async function pkm_remoteplay() {
    const generaldiv = document.createElement('div');
    if (Icookies.getCookie('token') != null) {
        const gamediv = document.createElement('div');
        gamediv.innerText = "Pokemon Game";
        generaldiv.appendChild(gamediv);
        
    } else {
        generaldiv.classList.add('not-logged');
        alert("You need to be logged in to play in remote");
        document.location.href = "/home";
    }
    document.body.appendChild(generaldiv);
    return generaldiv;

}