var context = new AudioContext();
var tickSound;
var getSound = new XMLHttpRequest();
var isPlaying = false;		//Esta activo el metronomo
var metroBPM;
var metronomo;

getSound.open("GET", "media/tick.wav", true);
getSound.responseType = "arraybuffer"; // Read as Binary Data
getSound.onload = function() { 
	context.decodeAudioData(getSound.response, function(buffer){ 
		tickSound = buffer; //Decodificar audio y guardar
	});
}
getSound.send(); //Mandar request

//Compatibilidad para pricision timing
if (window.performance.now) {
    console.log("Using high performance timer");
    getTimestamp = function() { return window.performance.now(); };
} else {
    if (window.performance.webkitNow) {
        console.log("Using webkit high performance timer");
        getTimestamp = function() { return window.performance.webkitNow(); };
    } else {
        console.log("Using low performance timer");
        getTimestamp = function() { return new Date().getTime(); };
    }
}

//Variables para timing
var now;
var then = getTimestamp();
var delta;

//Graficos y jQuery
$("document").ready(function(){
	$("#upTempo").click(function(){
		var val = parseInt($("#tempo").val());
		$("#tempo").val(val+8);
	});

	$("#downTempo").click(function(){
		var val = parseInt($("#tempo").val());
		$("#tempo").val(val-8);
	});

	$("#play").click(function(){
		if(isPlaying) {
			//stopMetronome();
			$("#play").html("Play");
			isPlaying = false;
		}
		else {
			//startMetronome();
			$("#play").html("Stop");
			isPlaying = true;
			repeatMetronome();
		}
	});

	$("#tempo").change(function(){
		setBPM($("#tempo").val());
	});

	$("#tempo").val(120);
});

//Funciones de metronomo
function play(sound) {
	var playSound = context.createBufferSource();
	playSound.buffer = sound;
	playSound.connect(context.destination);
	playSound.start(0);
	console.log("Sound played");
}

function setBPM (bpm) {
	metroBPM = 60000 / bpm - 0; 	// -1 para compensar el setTimeOut
	console.log("BPM: " + metroBPM);
}

function repeatMetronome() {
	
		var now = getTimestamp();
		delta = now - then;

		if(delta > metroBPM) {
			play(tickSound);
			then = now - (delta % metroBPM)
		}

		console.log(delta);
	if (isPlaying) setTimeout(function(){repeatMetronome()}, 0);
	
}

/*
function startMetronome() {
	metronomo = setInterval(function(){play(tickSound)}, metroBPM);
}

function stopMetronome() {
	clearInterval(metronomo);
}
*/
