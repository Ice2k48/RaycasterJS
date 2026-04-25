/* ************************************************************************************************************ */

import { COLORES, JUGADOR_PARAMS } from "./Constantes.js";

/* ************************************************************************************************************ */

export default class Render {
	#canvas_contexto;
	
	/* ******************************************************************************************************** */
	
	constructor ( p_canvas_contexto ) {
		this.#canvas_contexto = p_canvas_contexto
	}
	
	/* ******************************************************************************************************** */

	dibujarMapa ( p_mundo, p_camara, p_n_tamanio_baldosa_render ) {
		let color;
		
		const mundo = p_mundo.obtenerMundo ();
		const valores_mundo = p_mundo.obtenerValoresMundo ();
		const rectangulo_camara = p_camara.obtenerRectangulo();
		
		/*
			p_n_tamanio_baldosa_render indica cuántos píxeles ocupa una unidad de mundo en este render.

			Ejemplos:
			- Render principal: 1 baldosa lógica = 80 px
			- Render GUI/minimapa: 1 baldosa lógica = 16 px
		*/
		let inicio_x = Math.floor ( rectangulo_camara.x );
		let fin_x = Math.floor ( rectangulo_camara.x + rectangulo_camara.ancho ) + 1;

		let inicio_y = Math.floor ( rectangulo_camara.y );
		let fin_y = Math.floor ( rectangulo_camara.y + rectangulo_camara.alto ) + 1;
		
		// para que no se desborde la camara en x
		if ( inicio_x < 0 ) {
			inicio_x = 0;
		}
		if ( fin_x > valores_mundo.ancho_coordenadas ) {
			fin_x = valores_mundo.ancho_coordenadas;
		}
		
		// para que no se desborde la camara en y
		if ( inicio_y < 0 ) {
			inicio_y = 0;
		}
		if ( fin_y > valores_mundo.alto_coordenadas ) {
			fin_y = valores_mundo.alto_coordenadas;
		}
		
		/* Dibujar baldosas visibles ************************************************************************* */
		for (let y = inicio_y; y < fin_y; y++) {
			for (let x = inicio_x; x < fin_x; x++) {
				let baldosa_actual = mundo[y][x];
				
				if ( baldosa_actual.esObstaculo () ) {
					color = COLORES.negro;
				} else {
					color = COLORES.gris;
				}
				
				const rectangulo_baldosa = baldosa_actual.obtenerRectangulo ();
				
				//Convertir valores del mundo a valores del canvas
				const pantalla_x = Math.floor ( ( rectangulo_baldosa.x - rectangulo_camara.x ) * p_n_tamanio_baldosa_render );
				const pantalla_y = Math.floor ( ( rectangulo_baldosa.y - rectangulo_camara.y ) * p_n_tamanio_baldosa_render );
				
				const ancho = Math.ceil ( rectangulo_baldosa.ancho * p_n_tamanio_baldosa_render );
				const alto = Math.ceil ( rectangulo_baldosa.alto * p_n_tamanio_baldosa_render );
				
				this.#canvas_contexto.fillStyle = color;
				this.#canvas_contexto.fillRect ( pantalla_x, pantalla_y, ancho, alto );
			}
		}
		
	}
	
	/* ******************************************************************************************************** */

	dibujarJugador ( p_jugador, p_camara, p_n_tamanio_baldosa_render ) {
		const valores_jugador = p_jugador.obtenerValoresJugador ();
		const rectangulo_camara = p_camara.obtenerRectangulo();
		
		//Convertir valores del mundo a valores del canvas
		const pantalla_x = Math.floor ( ( valores_jugador.posicion_x - rectangulo_camara.x ) * p_n_tamanio_baldosa_render );
		const pantalla_y = Math.floor ( ( valores_jugador.posicion_y - rectangulo_camara.y ) * p_n_tamanio_baldosa_render );
		
		const radio = ( valores_jugador.tamanio / 2 ) * p_n_tamanio_baldosa_render; //entre dos porque es radio, no diametro
		
		this.#canvas_contexto.beginPath();
		this.#canvas_contexto.arc ( pantalla_x, pantalla_y, radio, 0, Math.PI * 2);
		this.#canvas_contexto.fillStyle = COLORES.azul;
		this.#canvas_contexto.fill();
		
		//dibujar direccion
		this.#canvas_contexto.beginPath ();
		this.#canvas_contexto.moveTo ( pantalla_x, pantalla_y );
		this.#canvas_contexto.lineTo ( pantalla_x + Math.cos ( valores_jugador.angulo ) * ( radio * JUGADOR_PARAMS.tam_direccion ), pantalla_y + Math.sin ( valores_jugador.angulo ) * ( radio * JUGADOR_PARAMS.tam_direccion ) );
		this.#canvas_contexto.strokeStyle = COLORES.blanco; // o el color que quieras
		this.#canvas_contexto.stroke();
		
	}
	
	/* ******************************************************************************************************** */
}
