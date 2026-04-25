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
		
		this.#modo_camara = MODOS_CAMARA.seguir_jugador; //por defecto, para que tenga una camara correcta
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
	
	actualizar ( p_jugador, p_mundo ) {
		switch ( this.#modo_camara ) {
			
			case MODOS_CAMARA.seguir_jugador:
				this.#actualizarSeguirJugador ( p_jugador, p_mundo );
				
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
	
	#actualizarSeguirJugador ( p_jugador, p_mundo ) {
		const valores_jugador = p_jugador.obtenerValoresJugador();
		const valores_mundo = p_mundo.obtenerValoresMundo();
		
		/*
			La cámara trabaja en unidades de mundo.

			Ejemplo:
			- Si el canvas mide 1900 px y cada baldosa se renderiza a 80 px,
			  el ancho visible de la cámara debe ser 1900 / 80 = 23.75 unidades de mundo.

			Por eso aquí no se usan píxeles.
		*/

		this.#pos_x = valores_jugador.posicion_x - ( this.#ancho / 2 );
		this.#pos_y = valores_jugador.posicion_y - ( this.#alto / 2 );
		
		/* Limitar cámara al mundo *************************************************************************** */
		// Ahora que ya sigue al jugador, vamos a hacer que deje de seguirle cuando llegue a un borde del mapa
		
		/* **************************************************************************************************** */
		// EJE X
		// Mundo más pequeño en X que la vista de cámara, centramos el mundo en eje X
		if ( valores_mundo.ancho_coordenadas <= this.#ancho ) {
			this.#pos_x = ( valores_mundo.ancho_coordenadas - this.#ancho ) / 2;
		} else {
			// Si se sale por la izquierda, se ajusta al borde izquierdo
			if ( this.#pos_x < 0 ) {
				this.#pos_x = 0;
			}
			
			// Si se sale por la derecha, se ajusta al borde derecho
			if ( this.#pos_x > valores_mundo.ancho_coordenadas - this.#ancho ) {
				this.#pos_x = valores_mundo.ancho_coordenadas - this.#ancho;
			}
	
		}
	
		/* **************************************************************************************************** */
		// EJE Y
		// Mundo más pequeño en Y que la vista de cámara, centramos el mundo en eje Y
		if ( valores_mundo.alto_coordenadas <= this.#alto ) {
			this.#pos_y = ( valores_mundo.alto_coordenadas - this.#alto ) / 2;
		} else {
			// Si se sale por arriba, se ajusta al borde superior
			if ( this.#pos_y < 0 ) {
				this.#pos_y = 0;
			}
			
			// Si se sale por abajo, se ajusta al borde inferior
			if ( this.#pos_y > valores_mundo.alto_coordenadas - this.#alto ) {
				this.#pos_y = valores_mundo.alto_coordenadas - this.#alto;
			}
	
		}
		
	}
	
	/* ******************************************************************************************************** */
}

/* ************************************************************************************************************ */
