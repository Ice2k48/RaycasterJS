/* ************************************************************************************************************ */
import Baldosa from "./Baldosa.js";
import { TAM_CANVAS, CASILLAS, COLORES } from "./Constantes.js";

/* ************************************************************************************************************ */

export default class Render {
	#canvas_contexto;
	
	/* ******************************************************************************************************** */
	
	constructor ( p_canvas_contexto ) {
		this.#canvas_contexto = p_canvas_contexto
	}
	
	/* ******************************************************************************************************** */

	dibujarMapa ( p_mundo, p_camara ) {
		let color;
		
		for ( let y = 0; y < p_mundo.length; y++) {
			for ( let x = 0; x < p_mundo[0].length; x++) {
				let baldosa_actual = p_mundo[y][x];
				
				if ( baldosa_actual.esObstaculo () ) {
					color = COLORES.negro;
				} else {
					color = COLORES.gris;
				}
				
				const rectangulo_baldosa = baldosa_actual.obtenerRectangulo ();
				const rectangulo_camara = p_camara.obtenerRectangulo();
				const pantalla_x = rectangulo_baldosa.x - rectangulo_camara.x;
				const pantalla_y = rectangulo_baldosa.y - rectangulo_camara.y;
				
				this.#canvas_contexto.fillStyle = color;
				this.#canvas_contexto.fillRect ( pantalla_x, pantalla_y, rectangulo_baldosa.ancho, rectangulo_baldosa.alto );
			}
		}
		
	}
	
	/* ******************************************************************************************************** */

	dibujarJugador ( p_jugador, p_camara ) {
		/*
		//console.log(this.#posicion_x, this.#posicion_y);
		
		const radio = this.#tamanio;
		//console.log("radio: " + radio);
		//console.log("this.#tamanio: " + this.#tamanio);
		this.#canvas_contexto.beginPath();
		this.#canvas_contexto.arc(this.#posicion_x, this.#posicion_y, radio, 0, Math.PI * 2);
		this.#canvas_contexto.fillStyle = COLORES.azul;
		this.#canvas_contexto.fill();
		
		//dibujar direccion
		this.#canvas_contexto.beginPath ();
		this.#canvas_contexto.moveTo ( this.#posicion_x, this.#posicion_y);
		this.#canvas_contexto.lineTo ( this.#posicion_x + Math.cos ( this.#angulo ) * (radio * 3), this.#posicion_y + Math.sin ( this.#angulo ) * (radio * 3) );
		this.#canvas_contexto.strokeStyle = COLORES.blanco;   // o el color que quieras
		this.#canvas_contexto.stroke();
		*/
	}
	
	/* ******************************************************************************************************** */
}
