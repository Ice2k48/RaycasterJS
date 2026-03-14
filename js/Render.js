/* ************************************************************************************************************ */
import Baldosa from "./Baldosa.js";
import Jugador from "./Jugador.js";
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
		
		console.log(p_mundo.length, p_mundo[0].length);
		
		const rectangulo_camara = p_camara.obtenerRectangulo();
		
		for ( let y = 0; y < p_mundo.length; y++) {
			for ( let x = 0; x < p_mundo[y].length; x++) {
				let baldosa_actual = p_mundo[y][x];
				
				if ( baldosa_actual.esObstaculo () ) {
					color = COLORES.negro;
				} else {
					color = COLORES.gris;
				}
				
				const rectangulo_baldosa = baldosa_actual.obtenerRectangulo ();
				
				//Convertir valores del mundo a valores del canvas
				/* Esto usa decimales y provoca suciedad en el canvas
				const pantalla_x = rectangulo_baldosa.x - rectangulo_camara.x;
				const pantalla_y = rectangulo_baldosa.y - rectangulo_camara.y;
				*/
				const pantalla_x = Math.floor(rectangulo_baldosa.x - rectangulo_camara.x);
				const pantalla_y = Math.floor(rectangulo_baldosa.y - rectangulo_camara.y);
				
				const ancho = Math.floor(rectangulo_baldosa.ancho);
				const alto  = Math.floor(rectangulo_baldosa.alto);
				
				this.#canvas_contexto.fillStyle = color;
				this.#canvas_contexto.fillRect ( pantalla_x, pantalla_y, ancho, alto );
			}
		}
		
	}
	
	/* ******************************************************************************************************** */

	dibujarJugador ( p_jugador, p_camara ) {
		const valores_jugador = p_jugador.obtenerValoresJugador ();
		const rectangulo_camara = p_camara.obtenerRectangulo();
		
		//Convertir valores del mundo a valores del canvas
		const pantalla_x = valores_jugador.posicion_x - rectangulo_camara.x;
		const pantalla_y = valores_jugador.posicion_y - rectangulo_camara.y;
		
		const radio = valores_jugador.tamanio / 2; //entre dos porque es radio, no diametro
		
		this.#canvas_contexto.beginPath();
		this.#canvas_contexto.arc ( pantalla_x, pantalla_y, radio, 0, Math.PI * 2);
		this.#canvas_contexto.fillStyle = COLORES.azul;
		this.#canvas_contexto.fill();
		
		//dibujar direccion
		this.#canvas_contexto.beginPath ();
		this.#canvas_contexto.moveTo ( pantalla_x, pantalla_y );
		this.#canvas_contexto.lineTo ( pantalla_x + Math.cos ( valores_jugador.angulo ) * (radio * 3), pantalla_y + Math.sin ( valores_jugador.angulo ) * (radio * 3) );
		this.#canvas_contexto.strokeStyle = COLORES.blanco; // o el color que quieras
		this.#canvas_contexto.stroke();
		
	}
	
	/* ******************************************************************************************************** */
}
