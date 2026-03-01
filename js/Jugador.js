/* ************************************************************************************************************ */

import { CASILLAS, COLORES, JUGADOR_PARAMS } from "./Constantes.js";
import { gradosARadianes } from "./Utils.js";

/* ************************************************************************************************************ */

export default class Jugador {
	#canvas_contexto;
	#posicion_x
	#posicion_y
	#mapa_nivel
	#angulo //hacia donde esta mirando: 0º -> derecha; 90º -> abajo; 180º -> izquierda; 270º -> arriba
	
	constructor ( p_canvas_contexto, p_mapa_nivel, p_posicion_x, p_posicion_y, p_angulo ) {
		this.#canvas_contexto = p_canvas_contexto;
		
		this.#mapa_nivel = p_mapa_nivel;
		
		this.#posicion_x = p_posicion_x;
		this.#posicion_y = p_posicion_y;
		
		this.#angulo = gradosARadianes ( p_angulo );
		
	}
	
	/* ******************************************************************************************************** */
	
	dibujarJugador () {
		const radio = JUGADOR_PARAMS.radio;
		
		this.#canvas_contexto.beginPath();
		this.#canvas_contexto.arc(this.#posicion_x, this.#posicion_y, radio, 0, Math.PI * 2);
		this.#canvas_contexto.fillStyle = COLORES.azul;
		this.#canvas_contexto.fill();
		
		//dibujar direccion
		this.#canvas_contexto.beginPath ();
		this.#canvas_contexto.moveTo ( this.#posicion_x, this.#posicion_y);
		this.#canvas_contexto.lineTo ( this.#posicion_x + Math.cos ( this.#angulo ) * JUGADOR_PARAMS.tam_direccion, this.#posicion_y + Math.sin ( this.#angulo ) * JUGADOR_PARAMS.tam_direccion );
		this.#canvas_contexto.strokeStyle = COLORES.blanco;   // o el color que quieras
		this.#canvas_contexto.stroke();
		
	}
	
	/* ******************************************************************************************************** */
	actualizar ( p_deltatime, p_velocidad_jugador, p_angulo, p_input ) {
		//this.#angulo = gradosARadianes ( p_angulo );
		
		/* **************************************************************************************************** */
		const velocidad_giro = gradosARadianes ( JUGADOR_PARAMS.velocidad_angular ); // rad/seg
		
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
		
		const velocidad = p_velocidad_jugador * direccion; // px/seg, con signo de direccion
		
		this.#posicion_x += Math.cos ( this.#angulo ) * velocidad * p_deltatime;
		this.#posicion_y += Math.sin ( this.#angulo ) * velocidad * p_deltatime;
	}
}

/* ************************************************************************************************************ */
