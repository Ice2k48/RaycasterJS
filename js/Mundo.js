import Baldosa from "./Baldosa.js";

import { CASILLAS } from "./Constantes.js";

/* ************************************************************************************************************ */

export default class Mundo {
	#mundo
	#alto_pixeles
	#ancho_pixeles
	#alto_coordenadas
	#ancho_coordenadas
	#tamanio_baldosa
	
	/* ******************************************************************************************************** */
	
	constructor ( p_mapa, p_tamanio_baldosa ) {
		this.#tamanio_baldosa = p_tamanio_baldosa;
		
		this.#crearMundo ( p_mapa );
	}
	
	/* ******************************************************************************************************** */
	
	#crearMundo ( p_mapa ) {
		const filas = p_mapa.length;
		const columnas = p_mapa[0].length;
		
		this.#mundo = [];
		
		for ( let y = 0; y < filas; y++ ) {
			this.#mundo[y] = [];
			
			for ( let x = 0; x < columnas; x++ ) {
	            let tipo = p_mapa[y][x];
	            
	            if ( tipo != CASILLAS.obstaculo ) {
					tipo = CASILLAS.libre;
				}
	            
	            const pos_x0 = x * this.#tamanio_baldosa; //Ejemplo: si es x=1 y el tamaño es 10, pos_x0 es 10
	            const pos_x1 = pos_x0 + this.#tamanio_baldosa; // Ejemplo: si pos_x0 es 10 y el tamaño es 10 pos_x1 es 20
	            
	            const pos_y0 = y * this.#tamanio_baldosa;
	            const pos_y1 = pos_y0 + this.#tamanio_baldosa;
	            
	            let baldosa = new Baldosa ( pos_x0, pos_x1, pos_y0, pos_y1, tipo );
	            this.#mundo[y][x] = baldosa;
			}
		}
		
		this.#ancho_pixeles = this.#mundo[0].length * this.#tamanio_baldosa;
		this.#alto_pixeles = this.#mundo.length * this.#tamanio_baldosa;
		this.#ancho_coordenadas = this.#mundo[0].length;
		this.#alto_coordenadas= this.#mundo.length;
		
	}
	
	/* ******************************************************************************************************** */
	
	obtenerValoresMundo () {
		const valores_mundo = {
			ancho_pixeles: null,
			alto_pixeles: null,
			alto_coordenadas: null,
			ancho_coordenadas: null,
			tamanio_baldosas: null
		};
		
		valores_mundo.ancho_pixeles = this.#ancho_pixeles;
		valores_mundo.alto_pixeles = this.#alto_pixeles;
		valores_mundo.alto_coordenadas = this.#alto_coordenadas;
		valores_mundo.ancho_coordenadas = this.#ancho_coordenadas;
		valores_mundo.tamanio_baldosas = this.#tamanio_baldosa;
		
		return valores_mundo;
	}
	
	/* ******************************************************************************************************** */
	
	obtenerMundo () {
		return this.#mundo;
	}
	
	/* ******************************************************************************************************** */
	
	obtenerBaldosaEn ( p_pos_x, p_pos_y ) {
		//p_pos_x, p_pos_y son una posición en píxeles (ejemplo, posicion del jugador)
		//devuelve la baldosa para poder ver por ejemplo si es obstaculo o no
		let baldosa;
		
		//Convertimos las coordenadas en pixeles a coordenadas de las baldosas del mundo
		const x = Math.floor ( p_pos_x / this.#tamanio_baldosa );
		const y = Math.floor ( p_pos_y / this.#tamanio_baldosa );
		
		// Comprobar que está dentro del mundo
		if ( x < 0 || x >= this.#mundo[0].length || y < 0 || y >= this.#mundo.length ) {
			baldosa = null;
		} else {
			baldosa = this.#mundo[y][x];
		}
		
		return baldosa;
	}
	
	/* ******************************************************************************************************** */
}

/* ************************************************************************************************************ */
