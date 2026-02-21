/* ************************************************************************************************************ */

var canvas;
var canvas_contexto;

var mapa;
var nivel;

const canvas_ancho = 1600;
const canvas_alto = 800;
const FPS = 60;
const LIBRE = 0;
const OBSTACULO = 1;
const COLOR_NEGRO = "#000000";
const COLOR_GRIS = "#666666";

/* ************************************************************************************************************ */

var mapa_test = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

/* ************************************************************************************************************ */

function inicializar() {
	console.log ("Inicializando...")
	
	canvas = document.getElementById ( "canvas" );
	canvas_contexto = canvas.getContext ("2d");
	
	canvas.width = canvas_ancho;
	canvas.height = canvas_alto;
	
	nivel = new Nivel ( canvas, canvas_contexto, mapa_test );
	
	setInterval ( function () { buclePrincipal(); }, 1000/FPS );
}

/* ************************************************************************************************************ */

function buclePrincipal (){
	console.log ( "fotograma" );
	
	borrarCanvas ();
	nivel.dibujar();
	
}

/* ************************************************************************************************************ */

class Nivel {
	constructor ( p_canvas, p_canvas_contexto, p_mapa_nivel ) {
		this.canvas = p_canvas;
		this.canvas_contexto = p_canvas_contexto;
		this.mapa = p_mapa_nivel;
		
		this.mapa_alto = this.mapa.length;
		this.mapa_ancho = this.mapa[0].length;
		
		this.canvas_alto = this.canvas.height;
		this.canvas_ancho = this.canvas.width;
		
		//Dimensiones de las baldosas
		this.baldosa_size_alto = parseInt ( this.canvas_alto / this.mapa_alto );
		this.baldosa_size_ancho = parseInt ( this.canvas_ancho / this.mapa_ancho );
		
	}
	
	/* ******************************************************************************************************** */
	
	dibujar () {
		var color;
		
		for ( var y = 0; y < this.mapa_alto; y++) {
			for ( var x = 0; x < this.mapa_ancho; x++) {
				if ( this.mapa[y][x] == OBSTACULO ) {
					color = COLOR_NEGRO;
				} else {
					color = COLOR_GRIS;
				}
				
				this.canvas_contexto.fillStyle = color;
				this.canvas_contexto.fillRect ( x * this.baldosa_size_ancho, y * this.baldosa_size_alto, this.baldosa_size_ancho, this.baldosa_size_alto );
			}
		}
	}
}

/* ************************************************************************************************************ */

function borrarCanvas () {
	canvas.width = canvas_ancho;
	canvas.height = canvas_alto;
}

/* ************************************************************************************************************ */
