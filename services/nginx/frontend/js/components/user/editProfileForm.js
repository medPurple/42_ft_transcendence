import Iuser from "./userInfo.js"

export default class editProfileForm extends HTMLElement {
	constructor() {
		super(); // Always call super first in constructor
		this.attachShadow({ mode: 'open' }); // Create a new attached DOM tree for the component

	}

	connectedCallback() {
		const editForm = this.shadowRoot.getElementById('profile-container'); // Use getElementById to find the form within the component
		editForm.addEventListener('editprofile', function(event) {
            