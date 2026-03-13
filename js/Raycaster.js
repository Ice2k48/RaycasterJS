import Nivel from "./Nivel.js";
import Jugador from "./Jugador.js";
import InputManager from "./InputManager.js";
import { leerArchivo } from "./Utils.js";

/* ************************************************************************************************************ */

import { TAM_CANVAS, JUGADOR_PARAMS, FPS, CASILLAS, COLORES } from "./Constantes.js";
import { MAPAS } from "./Mapas.js";

/* ************************************************************************************************************ */

let ultimo_tiempo = 0;
let acumulador_tiempo = 0;

const DELTATIME = 1 / FPS;

/* ************************************************************************************************************ */
// Elementos de html
let div_informacion;
let select_mapa_desplegable;
let tam_canvas_input_ancho;
let tam_canvas_input_alto;
let tam_baldosa_input;
let cargar_archivo_mapa_input;

/* ************************************************************************************************************ */

let archivo_json;

/* ************************************************************************************************************ */

let canvas;
let canvas_contexto;
let canvas_tam_ancho;
let canvas_tam_alto;

/* ************************************************************************************************************ */

let matriz_baldosas;
let matriz_tam_baldosas;

/* ************************************************************************************************************ */

let mapa;
let nivel;
let jugador;
let input_manager;

/* ************************************************************************************************************ */

function inicializar() {
	console.log ("Inicializando...")
	
	div_informacion = document.getElementById ( "div_informacion" );
	cargar_archivo_mapa_input = document.getElementById ( "cargar_archivo_mapa_input" );
	
	cargar_archivo_mapa_input.value = "";
	
	/* ******************************************************************************************************** */
	//Poner valores por defecto en los botones del html
	tam_canvas_input_ancho = document.getElementById ( "tam_canvas_input_ancho" );
	tam_canvas_input_alto = document.getElementById ( "tam_canvas_input_alto" );
	tam_canvas_input_ancho.value = TAM_CANVAS.ancho;
	tam_canvas_input_alto.value = TAM_CANVAS.alto;
	canvas_tam_ancho = tam_canvas_input_ancho.value;
	canvas_tam_alto = tam_canvas_input_alto.value;
	
	/* ******************************************************************************************************** */
	
	tam_baldosa_input = document.getElementById ( "tam_baldosa_input" );
	tam_baldosa_input.value = TAM_CANVAS.balsosa;
	matriz_tam_baldosas = tam_baldosa_input.value;
	
	/* ******************************************************************************************************** */
	
	select_mapa_desplegable = document.getElementById ( "select_mapa_desplegable" );
	for (const nombre_mapa of Object.keys ( MAPAS ) ) {
		select_mapa_desplegable.add ( new Option ( nombre_mapa, nombre_mapa ) );
	}
	
	/* ******************************************************************************************************** */
}

/* ************************************************************************************************************ */
document.getElementById("iniciar_boton").addEventListener("click", iniciar);
function iniciar() {
	console.log ("Iniciando...")
	
	/* Crear canvas ******************************************************************************************* */
	
	canvas = document.getElementById ( "canvas" );
	canvas_contexto = canvas.getContext ("2d");
	
	canvas.width = tam_canvas_input_ancho.value;
	canvas.height = tam_canvas_input_alto.value;
	
	/* Mapa *************************************************************************************************** */
	
	cargarMapa();
	
	let jugador_pos_inicial_x = 800;
	let jugador_pos_inicial_y = 200;
	let angulo_inicial = JUGADOR_PARAMS.angulo;
	let tamanio_jugador_inicial = JUGADOR_PARAMS.tamanio_jugador_inicial; //para test, luego en relacion a baldosa
	
	//matriz_baldosas = calcularRelacionBaldosas ( canvas.width, canvas.height, mapa_inicial[0].length, mapa_inicial.length  );
	
	nivel = new Nivel ( canvas_contexto, mapa );
	jugador = new Jugador ( canvas_contexto, mapa, jugador_pos_inicial_x, jugador_pos_inicial_y, angulo_inicial, tamanio_jugador_inicial );
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
//Cuando se pulsa el boton tam_canvas_boton se establece el tamaño del canvas
document.getElementById("tam_canvas_boton").addEventListener("click", establecerTamCanvas);
function establecerTamCanvas () {
}

/* ************************************************************************************************************ */
//Cuando se pulsa el boton tam_baldosa_boton se establece el tamaño de la baldosa
document.getElementById("tam_baldosa_boton").addEventListener("click", establecerTamBaldosa);
function establecerTamBaldosa() {
}

/* ************************************************************************************************************ */
// Cuando se pulsa el boton select_mapa_boton se carga un mapa seleccionado del desplegable select_mapa_desplegable
document.getElementById("select_mapa_boton").addEventListener("click", cargarMapa);
function cargarMapa() {
	if ( cargar_archivo_mapa_input.files.length > 0 ) {
		mapa = archivo_json[select_mapa_desplegable.value];
	} else {
		mapa = MAPAS[select_mapa_desplegable.value];
	}
	
	// Buscar posicion de jugador
	// cargar el canvas
	//procesarMapa ( mapa, canvas_contexto );
}

/* ************************************************************************************************************ */
//Cuando se pulsa el boton cargar_archivo_mapa_boton se carga el desplegable con los mapas del archivo seleccionado
// en cargar_archivo_mapa_input
document.getElementById("cargar_archivo_mapa_boton").addEventListener("click", cargarArchivoMapa);
async function cargarArchivoMapa() {
	// Leemos el archivo y esperamos a que termine
	const archivo = cargar_archivo_mapa_input.files[0];
	const contenido = await leerArchivo ( archivo );
	archivo_json = JSON.parse ( contenido );
	
	// Limpiamos el desplegable
	select_mapa_desplegable.innerHTML = "";
	
	// Lo cargamos con los nombres de los mapas del json
	for (const nombreMapa of Object.keys(archivo_json)) {
		select_mapa_desplegable.add(new Option(nombreMapa, nombreMapa));
	}
}

/* ************************************************************************************************************ */

window.addEventListener("load", inicializar);

/* ************************************************************************************************************ */
