/* ************************************************************************************************************ */

import { gradosARadianes } from "./Utils.js";

/* ************************************************************************************************************ */

export default class Jugador {
	#posicion_x			//coordenada continua de mundo
	#posicion_y			//coordenada continua de mundo
	#mundo 				//Para las colisiones
	#angulo 			//hacia donde esta mirando: 0º -> derecha; 90º -> abajo; 180º -> izquierda; 270º -> arriba
	#tamanio 			//tamaño del jugador en unidades de mundo. Ejemplo: 0.7 ocupa el 70% de una baldosa
	#velocidad_jugador	//unidades de mundo por segundo
	#velocidad_angular	//grados por segundo
	
	/* ******************************************************************************************************** */
	
	constructor ( p_mundo, p_n_posicion_x, p_n_posicion_y, p_n_angulo, p_n_tamanio, p_n_velocidad_jugador, p_n_velocidad_angular ) {
		this.#posicion_x = p_n_posicion_x;
		this.#posicion_y = p_n_posicion_y;
		
		this.#mundo = p_mundo;
		
		this.#angulo = gradosARadianes ( p_n_angulo );
		
		this.#tamanio = p_n_tamanio;
		
		this.#velocidad_jugador = p_n_velocidad_jugador;
		this.#velocidad_angular = p_n_velocidad_angular;
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
	
	actualizar ( p_deltatime, p_input ) {
		
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
		
		/* Calcular nueva posicion ************************************************************************** */
		const velocidad = this.#velocidad_jugador * direccion; // unidades del mundo/seg, con signo de direccion
		
		//Comprobamos si colisiona
		let nueva_posicion_x = this.#posicion_x + Math.cos ( this.#angulo ) * velocidad * p_deltatime;
		let nueva_posicion_y = this.#posicion_y + Math.sin ( this.#angulo ) * velocidad * p_deltatime;
		
		const radio = ( this.#tamanio / 2 );
		
		//tenemos en cuenta el radio
		let nueva_posicion_x_radio_mas = nueva_posicion_x + radio;
		let nueva_posicion_x_radio_menos = nueva_posicion_x - radio;
		
		let nueva_posicion_y_radio_mas = nueva_posicion_y + radio;
		let nueva_posicion_y_radio_menos = nueva_posicion_y - radio;
		
		/*
			Hacemos la comprobacion en dos pasos para permitir deslizarse por paredes.

			Primero intentamos mover en X.
			Despues intentamos mover en Y.

			Para la colision simplificamos el jugador como un cuadrado:
			- izquierda  = posicion_x - radio
			- derecha    = posicion_x + radio
			- arriba     = posicion_y - radio
			- abajo      = posicion_y + radio
		*/
		//Colision en X
		if ( 
				this.#esObstaculoEn ( nueva_posicion_x_radio_mas, this.#posicion_y + radio ) ||
				this.#esObstaculoEn ( nueva_posicion_x_radio_mas, this.#posicion_y - radio ) ||
				this.#esObstaculoEn ( nueva_posicion_x_radio_menos, this.#posicion_y + radio ) ||
				this.#esObstaculoEn ( nueva_posicion_x_radio_menos, this.#posicion_y - radio ) ) {
			
		} else { //no es obstaculo, movemos al jugador
			this.#posicion_x = nueva_posicion_x;
		}
		//Colision en Y
		if ( 
				this.#esObstaculoEn ( this.#posicion_x + radio, nueva_posicion_y_radio_mas ) ||
				this.#esObstaculoEn ( this.#posicion_x - radio, nueva_posicion_y_radio_mas ) ||
				this.#esObstaculoEn ( this.#posicion_x + radio, nueva_posicion_y_radio_menos ) ||
				this.#esObstaculoEn ( this.#posicion_x - radio, nueva_posicion_y_radio_menos ) ) {
			
		} else { //no es obstaculo, movemos al jugador
			this.#posicion_y = nueva_posicion_y;
		}
		
	}
	
	/* ******************************************************************************************************** */
	// Funcion auxiliar para evitar error cuando obtenerBaldosaEn() devuelve null. 
	// Consideramos que fuera del mapa es obstáculo.
	#esObstaculoEn ( p_pos_x, p_pos_y ) {
		let es_obstaculo = true;
		
		const baldosa = this.#mundo.obtenerBaldosaEn ( p_pos_x, p_pos_y );
		
		if ( baldosa !== null ) {
			es_obstaculo = baldosa.esObstaculo ();
		}
		
		return es_obstaculo;
	}
	
	/* ******************************************************************************************************** */
	
	establecerTamanio ( p_tamanio ) {
		this.#tamanio = p_tamanio;
	}
	
	/* ******************************************************************************************************** */
}

/* ************************************************************************************************************ */
