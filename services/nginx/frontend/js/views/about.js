export default () => `
	<div id="app-general-container">
		<p>This project marks the culmination of the 42 School main curriculum.</p>

		<p>Our goal was to create an engaging online platform for the Classic Pong game, 
			providing users with an enjoyable experience and enabling competitive matches. The main challenge was 
			to ensure smooth functionality while optionally adding extra features to enhance complexity.</p>

		<p>We incorporated a variety of additional features, using Django and DjangoRest for backend and API 
			development, Bootstrap for frontend design, and PostgreSQL for data management. Our User Management 
			system facilitates seamless user interactions, including login, registration, profile customization, 
			friend linking, blocking, and other functionalities.</p>

		<p>Emphasizing gameplay and user experience, we implemented remote player functionality, alternative game 
			options, customization through skins and powerups, matchmaking, tournaments, and user history tracking. 
			Additionally, the platform features a live chat system. For cybersecurity, we deployed WAF/ModSecurity, 
			HashiCorp Vault for secure secrets management, ensured GDPR compliance, implemented Two-Factor Authentication (2FA), 
			and utilized JWT.</p>

		<p>In the DevOps domain, our focus was on microservices architecture for scalability. We prioritized a visually 
			appealing and user-friendly interface, using Three.js and WebGL for 3D graphics and rendering in the main game.</p>

		<p>Furthermore, we developed a server-side Pong game, utilizing an API for seamless integration and websockets 
			to enhance the experience for users with high-latency connections.</p>

		<p>To further enhance the user experience, we introduced a second game: the Metaverse, a 2D Pokémon-like game 
			with multiplayer functionality and all the features of the main project game.</p>
	</div>
	`;