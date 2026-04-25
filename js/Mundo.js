import Baldosa from "./Baldosa.js";

import { CASILLAS } from "./Constantes.js";

/* ************************************************************************************************************ */

export default class Mundo {
	#mundo
	#alto_coordenadas
	#ancho_coordenadas
	
	/* ******************************************************************************************************** */
	
	constructor ( p_mapa ) {	
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
	            
	            let baldosa = new Baldosa ( x, y, tipo );
	            this.#mundo[y][x] = baldosa;
			}
		}
		
		this.#ancho_coordenadas = this.#mundo[0].length;
		this.#alto_coordenadas = this.#mundo.length;
		
	}
	
	/* ******************************************************************************************************** */
	
	obtenerValoresMundo () {
		const valores_mundo = {
			alto_coordenadas: null,
			ancho_coordenadas: null,
		};
		
		valores_mundo.alto_coordenadas = this.#alto_coordenadas;
		valores_mundo.ancho_coordenadas = this.#ancho_coordenadas;
		
		return valores_mundo;
	}
	
	/* ******************************************************************************************************** */
	
	obtenerMundo () {
		return this.#mundo;
	}
	
	/* ******************************************************************************************************** */
	
	obtenerBaldosaEn ( p_pos_x, p_pos_y ) {
		// p_pos_x y p_pos_y son coordenadas continuas del mundo.
		// Ejemplo: x = 4.37, y = 7.82 está dentro de la baldosa x = 4, y = 7.
		let baldosa;
		
		const x = Math.floor ( p_pos_x );
		const y = Math.floor ( p_pos_y );
		
		// Comprobar que está dentro del mundo
		if ( x < 0 || x >= this.#ancho_coordenadas || y < 0 || y >= this.#alto_coordenadas ) {
			baldosa = null;
		} else {
			baldosa = this.#mundo[y][x];
		}
		
		return baldosa;
	}
	
	/* ******************************************************************************************************** */
}

/* ************************************************************************************************************ */
