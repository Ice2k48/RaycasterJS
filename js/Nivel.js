/* ************************************************************************************************************ */

import { TAM_CANVAS, CASILLAS, COLORES } from "./Constantes.js";

/* ************************************************************************************************************ */

export default class Nivel {
	#canvas_contexto;
	#mapa;
	#mapa_alto;
	#mapa_ancho;
	#canvas_alto;
	#canvas_ancho;
	#baldosa_size_alto;
	#baldosa_size_ancho;
	
	constructor ( p_canvas_contexto, p_mapa_nivel ) {
		this.#canvas_contexto = p_canvas_contexto;
		this.#mapa = p_mapa_nivel;
		
		this.#mapa_alto = this.#mapa.length;
		this.#mapa_ancho = this.#mapa[0].length;
		
		this.#canvas_alto = TAM_CANVAS.alto;
		this.#canvas_ancho = TAM_CANVAS.ancho;
		
		//Dimensiones de las baldosas
		this.#baldosa_size_alto = parseInt ( this.#canvas_alto / this.#mapa_alto );
		this.#baldosa_size_ancho = parseInt ( this.#canvas_ancho / this.#mapa_ancho );
		
	}
	
	/* ******************************************************************************************************** */
	
	dibujarMapa () {
		let color;
		
		for ( let y = 0; y < this.#mapa_alto; y++) {
			for ( let x = 0; x < this.#mapa_ancho; x++) {
				if ( this.#mapa[y][x] == CASILLAS.obstaculo ) {
					color = COLORES.negro;
				} else {
					color = COLORES.gris;
				}
				
				this.#canvas_contexto.fillStyle = color;
				this.#canvas_contexto.fillRect ( x * this.#baldosa_size_ancho, y * this.#baldosa_size_alto, this.#baldosa_size_ancho, this.#baldosa_size_alto );
			}
		}
	}
}

/* ************************************************************************************************************ */
