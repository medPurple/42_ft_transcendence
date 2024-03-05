function authenticate(token){
    const authenticationUrl = "/api/token/authentication/";
    return fetch(authenticationUrl, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token
	}})
        .then(response => {
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });
}