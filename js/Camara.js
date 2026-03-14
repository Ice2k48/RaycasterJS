import { MODOS_CAMARA } from "./Constantes.js";

/* ************************************************************************************************************ */

export default class Camara {
	#pos_x;
	#pos_y;
	#ancho;
	#alto;
	#modo_camara
	
	/* ******************************************************************************************************** */
	
	constructor ( p_pos_x, p_pos_y, p_ancho, p_alto ) {
		this.#pos_x = p_pos_x;
		this.#pos_y = p_pos_y;
		this.#ancho = p_ancho;
		this.#alto = p_alto;
		
		this.#modo_camara = MODOS_CAMARA.seguir_jugador;
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
	
	actualizar ( p_jugador ) {
		switch ( this.#modo_camara ) {
			
			case MODOS_CAMARA.seguir_jugador:
				this.#actualizarSeguirJugador ( p_jugador );
				
				break;
			
			default:
				throw new Error("[Camara.js:actualizar()] Modo de cámara no válido");
				
		}
	}
	
	/* ******************************************************************************************************** */
	
	establecerModoCamara ( p_modo_camara ) {
		if ( !Object.values ( MODOS_CAMARA ).includes ( p_modo_camara ) ) {
			throw new Error ( "[Camara.js:establecerModoCamara()] Modo de cámara no válido");
		}
		
		this.#modo_camara = p_modo_camara;
		
	}
	
	/* ******************************************************************************************************** */
	
	#actualizarSeguirJugador ( p_jugador ) {
		const valores_jugador = p_jugador.obtenerValoresJugador();
		
		//Con los valores de la posicion del jugador, ponemos la camara siempre encima
		// de forma que el jugador este siempre en el centro del canvas
		//Pos_x y Pos_y es la esquina superior izquierda del rectangulo que muestra la camara
		//Por tanto, hay que desplazarlo para que el jugador este el medio desde esa referencia
		//Ejemplo: 	Canvas: 1600 x 800; Jugador: 1320 x 600
		// 			Centro canvas: 800 x 400
		//			camara.pos_x = 1320 - 800 = 520 -> x para esquina izquierda
		//			camara.pos_y = 600  - 400 = 200 -> y para esquina izquierda
    this.#pos_y = valores_jugador.posicion_y - (this.#alto / 2);
		this.#pos_x = valores_jugador.posicion_x - (this.#ancho / 2);
		this.#pos_y = valores_jugador.posicion_y - (this.#alto / 2);
	}
	
	/* ******************************************************************************************************** */
}

/* ************************************************************************************************************ */
