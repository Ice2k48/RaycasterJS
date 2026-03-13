/* ************************************************************************************************************ */
//Tamaño canvas
export const TAM_CANVAS = {
	ancho: 1600,
	alto: 800,
	balsosa: 10
};

/* ************************************************************************************************************ */
//Parametros por defecto del jugador (pueden variar en tiempo de ejecucion)
export const JUGADOR_PARAMS = {
	velocidad: 128, // px/seg
	radio: 20,
	tam_direccion: 64,
	angulo: 0,
	velocidad_angular: 180, // grados/seg
	tamanio_jugador_inicial: 20 //es el radio si dibujamos un circulo
};

/* ************************************************************************************************************ */
//Velocidad de actualizaciond de la logica del juego
export const FPS = 60;

/* ************************************************************************************************************ */
//Tipo de casillas
export const CASILLAS = {
	libre: 0,
	obstaculo: 1,
	jugador: 2
};

/* ************************************************************************************************************ */
//Colores
export const COLORES = {
	negro: "#000000",
	gris: "#666666",
	blanco: "#FFFFFF",
	azul: "#0041C2"
};

/* ************************************************************************************************************ */
