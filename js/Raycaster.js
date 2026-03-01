import Nivel from "./Nivel.js";
import Jugador from "./Jugador.js";
import InputManager from "./InputManager.js";

/* ************************************************************************************************************ */

import { TAM_CANVAS, JUGADOR_PARAMS, FPS, CASILLAS, COLORES } from "./Constantes.js";
import { MAPAS } from "./Mapas.js";

/* ************************************************************************************************************ */

let ultimo_tiempo = 0;
let acumulador_tiempo = 0;

const DELTATIME = 1 / FPS;

/* ************************************************************************************************************ */

let canvas;
let canvas_contexto;

let mapa;
let nivel;
let jugador;
let input_manager;

/* ************************************************************************************************************ */

function inicializar() {
	console.log ("Inicializando...")
	
	canvas = document.getElementById ( "canvas" );
	canvas_contexto = canvas.getContext ("2d");
	
	canvas.width = TAM_CANVAS.ancho;
	canvas.height = TAM_CANVAS.alto;
	
	let mapa_inicial = MAPAS.mapa_test;
	let jugador_pos_inicial_x = 8;
	let jugador_pos_inicial_y = 2;
	let angulo_inicial = JUGADOR_PARAMS.angulo;
	
	nivel = new Nivel ( canvas_contexto, MAPAS.mapa_test );
	jugador = new Jugador ( canvas_contexto, mapa_inicial, jugador_pos_inicial_x, jugador_pos_inicial_y, angulo_inicial );
	input_manager = new InputManager (  );
	
	ultimo_tiempo = performance.now() / 1000; //tiempo en alta precision independiente de la hora, pasado a segundos
	requestAnimationFrame ( buclePrincipal ); //pasa como parametro p_tiempo automaticamente
}

/* ************************************************************************************************************ */

function buclePrincipal ( p_tiempo ){
	console.log ( "fotograma" );
	
	/* ******************************************************************************************************** */
	//Control del tiempo de actualizacion con delta time
	const tiempo_actual = p_tiempo /1000; // a segundos para que sea consistente en unidades con FPS
	let delta = tiempo_actual - ultimo_tiempo;
	ultimo_tiempo = tiempo_actual;
	
	// Evitar saltos enormes si la pestaña estuvo parada
	if ( delta > 0.25 ) {
		delta = 0.25;
	}
	
	acumulador_tiempo += delta;

	/* ******************************************************************************************************** */
	// Update con FPS fijo
	while ( acumulador_tiempo >= DELTATIME ) {
		update ( DELTATIME );
		acumulador_tiempo -= DELTATIME;
	}
	
	/* ******************************************************************************************************** */
	// Dibujar a todo lo que pueda requestAnimationFrame
	borrarCanvas ();
	dibujar ();
	
	requestAnimationFrame ( buclePrincipal );
}

/* ************************************************************************************************************ */

function update ( p_delta_time ) {
	// La ? indica que ejecute el metodo actualizar si existe, si no, no da error
	
	let velocidad_jugador = JUGADOR_PARAMS.velocidad; //temporal, luego estará basado en los inputs
	
	jugador.actualizar ( p_delta_time, velocidad_jugador, 45, input_manager );
	nivel.actualizar?.( p_delta_time );
}

/* ************************************************************************************************************ */

function dibujar () {
	nivel.dibujarMapa();
	jugador.dibujarJugador();
}

/* ************************************************************************************************************ */

function borrarCanvas () {
	canvas_contexto.clearRect(0, 0, canvas.width, canvas.height);
}

/* ************************************************************************************************************ */

window.addEventListener("load", inicializar);

/* ************************************************************************************************************ */
