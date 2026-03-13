/* ************************************************************************************************************ */

export default class Camara {
	#pos_x;
	#pos_y;
	#ancho;
	#alto;
	
	/* ******************************************************************************************************** */
	
	constructor ( p_pos_x, p_pos_y, p_ancho, p_alto ) {
		this.#pos_x = p_pos_x;
		this.#pos_y = p_pos_y;
		this.#ancho = p_ancho;
		this.#alto = p_alto;
	}
	
	/* ******************************************************************************************************** */
	
	obtenerRectangulo () {
		const rectangulo = {
			x: null,
			y: null,
			ancho: null,
			alto: null
		};
		
		rectangulo.x = this.#pos_x;
		rectangulo.y = this.#pos_y;
		rectangulo.ancho = this.#ancho;
		rectangulo.alto = this.#alto;
		
		return rectangulo;
	}
	
	/* ******************************************************************************************************** */
}

/* ************************************************************************************************************ */
