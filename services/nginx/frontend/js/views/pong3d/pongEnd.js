
// export default () => `
// 	<div class="container mt-5">
// 		<div class="row justify-content-center">
// 			<div class="col-md-10">
// 				<div class="#custom-endgame">
// 					<img src="../../../images/Game/P1-WINS.jpeg" alt="Display Image">
// 				</div>
// 			</div>
// 		</div>
// 	</div>
// `

// export default () => `
// 	<div class="container mt-5">
// 		<div class="row justify-content-center">
// 			<div class="col-md-10">
// 				<div class="#custom-endgame">
// 					<img src="../../../images/Game/P2-WINS.jpeg" alt="Display Image">
// 				</div>
// 			</div>
// 		</div>
// 	</div>
// 	`

export default async function pongEnd(winner) {
	console.log('WINNER in pongEnd: ', winner);

	if (winner == 1)
		return `
		<div class="container mt-5">
			<div class="row justify-content-center">
				<div class="col-md-10">
					<div class="#custom-endgame">
						<img src="../../../images/Game/P1-WINS.jpeg" alt="Display Image">
					</div>
				</div>
			</div>
		</div>
		`
	else
		return `
		<div class="container mt-5">
			<div class="row justify-content-center">
				<div class="col-md-10">
					<div class="#custom-endgame">
						<img src="../../../images/Game/P2-WINS.jpeg" alt="Display Image">
					</div>
				</div>
			</div>
		</div>
		`
}