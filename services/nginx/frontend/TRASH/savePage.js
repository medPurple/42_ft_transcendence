
const signupFormElement = document.getElementById("app-content");

if (sessionStorage.getItem("autosave")) {
	// Restore the contents of the text field
	signupFormElement.value = sessionStorage.getItem("autosave");
}

signupFormElement.addEventListener("change", function() {
	// And save the results into the session storage object
	sessionStorage.setItem("autosave", signupFormElement.value);
});
