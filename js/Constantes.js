/* ************************************************************************************************************ */
//Tamaño canvas
export const TAM_CANVAS = Object.freeze ( {
	ancho: 1900,
	alto: 650,
	baldosa: 80
});

export const TAM_CANVAS_GUI = Object.freeze ( {
	ancho: 350,
	alto: 150,
	baldosa: 16
});

/* ************************************************************************************************************ */
//Parametros por defecto del jugador (pueden variar en tiempo de ejecucion)
export const JUGADOR_PARAMS = Object.freeze ( {
	velocidad: 1.6, // unidades del mundo/seg
	radio: 0.25,
	tam_direccion: 3, //veces el radio
	angulo: 0,
	velocidad_angular: 180, // grados/seg
	tamanio_jugador_inicial: 0.5, //es el diametro si dibujamos un circulo
	tamanio_porcentaje_baldosa: 0.7
});

/* ************************************************************************************************************ */
//Velocidad de actualizaciond de la logica del juego
export const FPS = 60;

/* ************************************************************************************************************ */
//Tipo de casillas
export const CASILLAS = Object.freeze ( {
	libre: 0,
	obstaculo: 1,
	jugador: 2
});

/* ************************************************************************************************************ */
//Colores
export const COLORES = Object.freeze ( {
	negro: "#000000",
	gris: "#666666",
	blanco: "#FFFFFF",
	azul: "#0041C2"
});

/* ************************************************************************************************************ */

export const MODOS_CAMARA = Object.freeze ( {
    seguir_jugador: 0
});

/* ************************************************************************************************************ */
