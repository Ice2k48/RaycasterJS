/* ************************************************************************************************************ */

import { CASILLAS, COLORES, JUGADOR_PARAMS } from "./Constantes.js";
import { gradosARadianes } from "./Utils.js";

/* ************************************************************************************************************ */

export default class Jugador {
	#canvas_contexto;
	#posicion_x
	#posicion_y
	#mundo //lo dejamos por si comprobamos aqui la colision, se verá
	#angulo //hacia donde esta mirando: 0º -> derecha; 90º -> abajo; 180º -> izquierda; 270º -> arriba
	#tamanio //relacion con el tamaño de la baldosa Ej: tamanio jugador un 90% de una baldosa
	#velocidad_jugador
	#velocidad_angular
	
	constructor ( p_canvas_contexto, p_mundo, p_posicion_x, p_posicion_y, p_angulo, p_tamanio, p_velocidad_jugador, p_velocidad_angular ) {
		this.#canvas_contexto = p_canvas_contexto;
		
		this.#posicion_x = p_posicion_x;
		this.#posicion_y = p_posicion_y;
		
		this.#mundo = p_mundo;
		
		this.#angulo = gradosARadianes ( p_angulo );
		
		this.#tamanio = p_tamanio;
		
		this.#velocidad_jugador = p_velocidad_jugador;
		this.#velocidad_angular = p_velocidad_angular;
	}
	
	/* ******************************************************************************************************** */
	
	obtenerValoresJugador () {
		const valores_jugador = {
			posicion_x: null,
			posicion_y: null,
			angulo: null,
			tamanio: null,
			velocidad_jugador: null
		};
		
		valores_jugador.posicion_x = this.#posicion_x;
		valores_jugador.posicion_y = this.#posicion_y;
		valores_jugador.angulo = this.#angulo;
		valores_jugador.tamanio = this.#tamanio;
		valores_jugador.velocidad_jugador = this.#velocidad_jugador;
		
		return valores_jugador;
	}
	
	/* ******************************************************************************************************** */
	
	actualizar ( p_deltatime, p_velocidad_jugador, p_input ) {
		
		/* **************************************************************************************************** */
		const velocidad_giro = gradosARadianes ( this.#velocidad_angular ); // rad/seg
		
		/* **************************************************************************************************** */
		// Giramos el jugador
		if ( p_input.estaPulsada ( "KeyA" ) ) { this.#angulo -= velocidad_giro * p_deltatime; }
		if ( p_input.estaPulsada ( "KeyD" ) ) { this.#angulo += velocidad_giro * p_deltatime; }
		
		/* **************************************************************************************************** */
		// Normalizar ángulo, siempre dentro de 360º 
		this.#angulo = ( this.#angulo + Math.PI * 2 ) % ( Math.PI * 2 );
		
		/* **************************************************************************************************** */
		// Movemos al jugador
		let direccion = 0; //adelante o atras
		if ( p_input.estaPulsada ( "KeyW" ) ) { direccion += 1; } //adelante
		if ( p_input.estaPulsada ( "KeyS" ) ) { direccion -= 1; } //atras
		
		const velocidad = this.#velocidad_jugador * direccion; // px/seg, con signo de direccion
		
		this.#posicion_x += Math.cos ( this.#angulo ) * velocidad * p_deltatime;
		this.#posicion_y += Math.sin ( this.#angulo ) * velocidad * p_deltatime;
	}
	
	/* ******************************************************************************************************** */
	
	establecerTamanio ( p_tamanio ) {
		this.#tamanio = p_tamanio;
	}
	
	/* ******************************************************************************************************** */
}

/* ************************************************************************************************************ */
