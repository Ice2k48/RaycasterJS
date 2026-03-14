import Jugador from "./Jugador.js";
import Camara from "./Camara.js";
import Render from "./Render.js";
import Baldosa from "./Baldosa.js";
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

let mundo; //es una matriz de baldosas, de las misma dimensiones que el mapa
let tam_baldosas;

/* ************************************************************************************************************ */

let camara; 
let render;

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
	canvas_tam_ancho = tam_canvas_input_ancho.value;
	canvas_tam_alto = tam_canvas_input_alto.value;
	
	/* ******************************************************************************************************** */
	
	tam_baldosa_input = document.getElementById ( "tam_baldosa_input" );
	tam_baldosa_input.value = TAM_CANVAS.baldosa;
	tam_baldosas = tam_baldosa_input.value;
	
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
	
	canvas.width = Number ( tam_canvas_input_ancho.value );
	canvas.height = Number ( tam_canvas_input_alto.value );
	
	/* Mapa *************************************************************************************************** */
	
	cargarMapa();
	camara = new Camara ( 0, 0, canvas.width, canvas.height );
	render = new Render ( canvas_contexto );
	
	/* Jugador ************************************************************************************************ */
	//jugador_angulo_inicial = JUGADOR_PARAMS.angulo;
	//jugador_tamanio_inicial = JUGADOR_PARAMS.tamanio_jugador_inicial;
	jugador_tamanio_inicial = tam_baldosas * JUGADOR_PARAMS.tamanio_porcentaje_baldosa;
	velocidad_jugador = JUGADOR_PARAMS.velocidad; //temporal, luego estará basado en los inputs
	velocidad_angular = JUGADOR_PARAMS.velocidad_angular; //temporal??
	jugador = new Jugador ( canvas_contexto, mundo, jugador_pos_inicial_x, jugador_pos_inicial_y, jugador_angulo_inicial, jugador_tamanio_inicial, velocidad_jugador, velocidad_angular );
	
	/* Controles ********************************************************************************************** */
	input_manager = new InputManager (  );
	
	/* Inicio del bucle *************************************************************************************** */
	ultimo_tiempo = performance.now() / 1000; //tiempo en alta precision independiente de la hora, pasado a segundos
	requestAnimationFrame ( buclePrincipal ); //pasa como parametro p_tiempo automaticamente
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
	
	jugador.actualizar ( p_delta_time, velocidad_jugador, input_manager );
	camara.actualizar ( jugador );
	
}

/* ************************************************************************************************************ */

function dibujar () {
	borrarCanvas ();
	render.dibujarMapa ( mundo, camara );
	render.dibujarJugador ( jugador, camara );
}

/* ************************************************************************************************************ */

function borrarCanvas () {
	canvas_contexto.clearRect(0, 0, canvas.width, canvas.height);
}

/* ************************************************************************************************************ */
//Cuando se pulsa el boton tam_canvas_boton se establece el tamaño del canvas
document.getElementById("tam_canvas_boton").addEventListener("click", establecerTamCanvas);
function establecerTamCanvas () {
	canvas_tam_ancho = tam_canvas_input_ancho.value;
	canvas_tam_alto = tam_canvas_input_alto.value;
	
	//Desde cero o conservar el estado, empezaremos desde cero
	cargarMapa();
}

/* ************************************************************************************************************ */
//Cuando se pulsa el boton tam_baldosa_boton se establece el tamaño de la baldosa
document.getElementById("tam_baldosa_boton").addEventListener("click", establecerTamBaldosa);
function establecerTamBaldosa() {
	tam_baldosas = Number ( tam_baldosa_input.value );
	jugador.establecerTamanio ( tam_baldosas * JUGADOR_PARAMS.tamanio_porcentaje_baldosa );
	
	//Desde cero o conservar el estado, empezaremos desde cero
	cargarMapa();
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
	
	procesarMapa ( mapa, canvas_contexto );
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

function procesarMapa ( p_mapa, p_canvas_contexto ) {
	//Tenemos que crear una matriz del mismo tamaño de el mapa
	// pero de objetos baldosas, será nuestro mundo del juego
	mundo = crearMundo ( p_mapa, tam_baldosas );
	
	// Posicion de jugador
	jugador_pos_inicial_x = ( nivel.entidades.jugador.x * tam_baldosas ) + ( tam_baldosas / 2 );
	jugador_pos_inicial_y = ( nivel.entidades.jugador.y * tam_baldosas ) + ( tam_baldosas / 2 );
	jugador_angulo_inicial = nivel.entidades.jugador.angulo;
	
}

/* ************************************************************************************************************ */

function crearMundo ( p_mapa, p_tam_baldosas ) {
	const filas = p_mapa.length;
	const columnas = p_mapa[0].length;
	
	const aux_mundo = [];
	
	for ( let y = 0; y < filas; y++ ) {
		aux_mundo[y] = [];
		
		for ( let x = 0; x < columnas; x++ ) {
            let tipo = p_mapa[y][x];
            
            if ( tipo != CASILLAS.obstaculo ) {
				tipo = CASILLAS.libre;
			}
            
            const pos_x0 = x * p_tam_baldosas; //Ejemplo: si es x=1 y el tamaño es 10, pos_x0 es 10
            const pos_x1 = pos_x0 + p_tam_baldosas; // Ejemplo: si pos_x0 es 10 y el tamaño es 10 pos_x1 es 20
            
            const pos_y0 = y * p_tam_baldosas;
            const pos_y1 = pos_y0 + p_tam_baldosas;
            
            let baldosa = new Baldosa ( pos_x0, pos_x1, pos_y0, pos_y1, tipo );
            aux_mundo[y][x] = baldosa;
		}
	}
	
	return aux_mundo;
}

/* ************************************************************************************************************ */

window.addEventListener("load", inicializar);

/* ************************************************************************************************************ */
