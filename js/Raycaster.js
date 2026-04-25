import Jugador from "./Jugador.js";
import Camara from "./Camara.js";
import Render from "./Render.js";
import InputManager from "./InputManager.js";
import Mundo from "./Mundo.js";

import { leerArchivo } from "./Utils.js";

/* ************************************************************************************************************ */

import { TAM_CANVAS, TAM_CANVAS_GUI, JUGADOR_PARAMS, FPS, COLORES, MODOS_CAMARA } from "./Constantes.js";
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

let canvas_gui;
let canvas_gui_contexto;
let canvas_gui_tam_ancho;
let canvas_gui_tam_alto;

/* ************************************************************************************************************ */

let mundo; //Clase mundo
let tam_baldosas;

/* ************************************************************************************************************ */

let camara; 
let render;
let camara_gui; 
let render_gui;

/* ************************************************************************************************************ */

let mapa;
let nivel;

/* ************************************************************************************************************ */
let jugador;
let jugador_pos_inicial_x;
let jugador_pos_inicial_y;
let jugador_angulo_inicial;
let	jugador_tamanio_inicial;
let velocidad_jugador;
let velocidad_angular;
/* ************************************************************************************************************ */

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
	canvas_tam_ancho = Number ( tam_canvas_input_ancho.value );
	canvas_tam_alto = Number ( tam_canvas_input_alto.value );
	
	/* ******************************************************************************************************** */
	
	tam_baldosa_input = document.getElementById ( "tam_baldosa_input" );
	tam_baldosa_input.value = TAM_CANVAS.baldosa;
	tam_baldosas = Number ( tam_baldosa_input.value );
	
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
	
	canvas_gui = document.getElementById ( "canvas_gui_mapa" );
	canvas_gui_contexto = canvas_gui.getContext ("2d");
	
	actualizarCanvasPrincipal();
	actualizarCanvasGui();
	
	/* Mapa *************************************************************************************************** */
	
	cargarMapa();
	
	/* Cámaras ************************************************************************************************ */
	
	crearCamaras();
	
	camara.establecerModoCamara ( MODOS_CAMARA.seguir_jugador );
	camara_gui.establecerModoCamara ( MODOS_CAMARA.seguir_jugador );
	
	/* Render ************************************************************************************************* */
	
	crearRenders();
	
	/* Jugador ************************************************************************************************ */

	crearJugador();
	
	/* Controles ********************************************************************************************** */

	input_manager = new InputManager();
	
	/* Inicio del bucle *************************************************************************************** */

	ultimo_tiempo = performance.now() / 1000; // tiempo en alta precision independiente de la hora, pasado a segundos
	requestAnimationFrame ( buclePrincipal ); // pasa como parametro p_tiempo automaticamente
}

/* ************************************************************************************************************ */

function buclePrincipal ( p_tiempo ){
	
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
	dibujar ();
	
	requestAnimationFrame ( buclePrincipal );
}

/* ************************************************************************************************************ */

function update ( p_delta_time ) {
	// La ? indica que ejecute el metodo actualizar si existe, si no, no da error
	// Ejemplo: nivel.actualizar?.( p_delta_time );
	
	jugador.actualizar ( p_delta_time, input_manager );
	camara.actualizar ( jugador, mundo );
	camara_gui.actualizar ( jugador, mundo );
	
}

/* ************************************************************************************************************ */

function dibujar () {
	borrarCanvas ();
	
	render.dibujarMapa ( mundo, camara, tam_baldosas );
	render.dibujarJugador ( jugador, camara, tam_baldosas );
	
	render_gui.dibujarMapa ( mundo, camara_gui, TAM_CANVAS_GUI.baldosa );
	render_gui.dibujarJugador ( jugador, camara_gui, TAM_CANVAS_GUI.baldosa );
}

/* ************************************************************************************************************ */

function borrarCanvas () {
	//Limpiar canvas
	//canvas_contexto.clearRect(0, 0, canvas.width, canvas.height);
	
	//En vez de vaciarlo, vamos a darle un fondo de color negro para que sea uniforme
	canvas_contexto.fillStyle = COLORES.negro;
	canvas_contexto.fillRect ( 0, 0, canvas.width, canvas.height );
	
	canvas_gui_contexto.fillStyle = COLORES.negro;
	canvas_gui_contexto.fillRect ( 0, 0, canvas_gui.width, canvas_gui.height );
}

/* ************************************************************************************************************ */
//Cuando se pulsa el boton tam_canvas_boton se establece el tamaño del canvas
document.getElementById("tam_canvas_boton").addEventListener("click", establecerTamCanvas);
function establecerTamCanvas () {
	canvas_tam_ancho = Number ( tam_canvas_input_ancho.value );
	canvas_tam_alto = Number ( tam_canvas_input_alto.value );
	
	if ( canvas !== undefined && canvas !== null ) {
		actualizarCanvasPrincipal();

		if ( camara !== undefined && camara !== null ) {
			crearCamaras();

			camara.establecerModoCamara ( MODOS_CAMARA.seguir_jugador );
			camara_gui.establecerModoCamara ( MODOS_CAMARA.seguir_jugador );
		}
	}
}

/* ************************************************************************************************************ */
//Cuando se pulsa el boton tam_baldosa_boton se establece el tamaño de la baldosa
document.getElementById("tam_baldosa_boton").addEventListener("click", establecerTamBaldosa);
function establecerTamBaldosa() {
	tam_baldosas = Number ( tam_baldosa_input.value );
	
	if ( canvas !== undefined && canvas !== null && camara !== undefined && camara !== null ) {
		crearCamaras();

		camara.establecerModoCamara ( MODOS_CAMARA.seguir_jugador );
		camara_gui.establecerModoCamara ( MODOS_CAMARA.seguir_jugador );
	}
}

/* ************************************************************************************************************ */
// Cuando se pulsa el boton select_mapa_boton se carga un mapa seleccionado del desplegable select_mapa_desplegable
document.getElementById("select_mapa_boton").addEventListener("click", cargarMapa);
function cargarMapa() {
	if ( cargar_archivo_mapa_input.files.length > 0 ) {
		nivel = archivo_json[select_mapa_desplegable.value];
		mapa = nivel.mapa;
	} else {
		nivel = MAPAS[select_mapa_desplegable.value];
		mapa = nivel.mapa;
	}
	
	procesarMapa ( mapa );
	
	if ( jugador !== undefined && jugador !== null ) {
		crearJugador();
	}
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

function procesarMapa ( p_mapa ) {
	//Tenemos que crear una matriz del mismo tamaño de el mapa
	// pero de objetos baldosas, será nuestro mundo del juego
	mundo = new Mundo ( p_mapa );
	
	// Posicion de jugador
	jugador_pos_inicial_x = nivel.entidades.jugador.x + 0.5;
	jugador_pos_inicial_y = nivel.entidades.jugador.y + 0.5;
	jugador_angulo_inicial = nivel.entidades.jugador.angulo;
	
}

/* ************************************************************************************************************ */

function actualizarCanvasPrincipal() {
	canvas.width = Number ( tam_canvas_input_ancho.value );
	canvas.height = Number ( tam_canvas_input_alto.value );

	canvas_tam_ancho = canvas.width;
	canvas_tam_alto = canvas.height;
}

/* ************************************************************************************************************ */

function actualizarCanvasGui() {
	canvas_gui.width = Number ( TAM_CANVAS_GUI.ancho );
	canvas_gui.height = Number ( TAM_CANVAS_GUI.alto );

	canvas_gui_tam_ancho = canvas_gui.width;
	canvas_gui_tam_alto = canvas_gui.height;
}

/* ************************************************************************************************************ */

function crearCamaras() {
	const posicion_inicial_camara_x = 0;
	const posicion_inicial_camara_y = 0;

	/*
		Camara trabaja en unidades de mundo.

		canvas.width y canvas.height están en píxeles.
		tam_baldosas indica cuántos píxeles ocupa 1 unidad de mundo en el render principal.
		TAM_CANVAS_GUI.baldosa indica cuántos píxeles ocupa 1 unidad de mundo en el render GUI.

		Por eso dividimos:
		- canvas principal / tam_baldosas
		- canvas GUI / TAM_CANVAS_GUI.baldosa
	*/

	camara = new Camara (
		posicion_inicial_camara_x,
		posicion_inicial_camara_y,
		canvas.width / tam_baldosas,
		canvas.height / tam_baldosas
	);

	camara_gui = new Camara (
		posicion_inicial_camara_x,
		posicion_inicial_camara_y,
		canvas_gui.width / TAM_CANVAS_GUI.baldosa,
		canvas_gui.height / TAM_CANVAS_GUI.baldosa
	);
}

/* ************************************************************************************************************ */

function crearRenders() {
	render = new Render ( canvas_contexto );
	render_gui = new Render ( canvas_gui_contexto );
}

/* ************************************************************************************************************ */

function crearJugador() {
	jugador_tamanio_inicial = JUGADOR_PARAMS.tamanio_porcentaje_baldosa;

	/*
		JUGADOR_PARAMS.velocidad ya está expresada en unidades de mundo/seg.
		Por eso no se divide entre tam_baldosas.

		tam_baldosas solo afecta a cómo se dibuja el mundo en píxeles,
		no a la velocidad lógica del jugador.
	*/

	velocidad_jugador = JUGADOR_PARAMS.velocidad;
	velocidad_angular = JUGADOR_PARAMS.velocidad_angular;

	jugador = new Jugador (
		mundo,
		jugador_pos_inicial_x,
		jugador_pos_inicial_y,
		jugador_angulo_inicial,
		jugador_tamanio_inicial,
		velocidad_jugador,
		velocidad_angular
	);
}

/* ************************************************************************************************************ */

window.addEventListener("load", inicializar);

/* ************************************************************************************************************ */
