/* ************************************************************************************************************ */

export default class InputManager {
	#teclas = {};

	constructor() {
		window.addEventListener("keydown", (e) => {
			this.#teclas[e.code] = true;
		});

		window.addEventListener("keyup", (e) => {
			this.#teclas[e.code] = false;
		});
	}

	/* ******************************************************************************************************** */

	estaPulsada ( p_codigo ) {
		return this.#teclas[p_codigo] === true;
	}
	
}

/* ************************************************************************************************************ */
