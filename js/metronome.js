var isPlaying = false;		//Esta activo el metronomo
var metroBPM;
var metronomo;
var sigUpper = 4;
var sigLower = 4;
var timeCount = 0;


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

//Load Sounds
var SoundSources = function() {
  loadSounds(this, {
    tick: 'media/tick.wav',
    blip: 'media/blip.wav'
  });
};

var sounds = new SoundSources();

//Variables para timing
var then = getTimestamp();
var delta;

//Graficos y jQuery
$("document").ready(function(){
	$("#upTempo").click(function(){
		var val = parseInt($("#tempo").val());
		$("#tempo").val(val+8);
		setBPM(parseInt($("#tempo").val()));
	});

	$("#downTempo").click(function(){
		var val = parseInt($("#tempo").val());
		$("#tempo").val(val-8);
		setBPM(parseInt($("#tempo").val()));
	});

	$("#play").click(function(){
		if(isPlaying) {
			//stop Metronome
			$("#play").html("Play");
			stopMetronome();
		}
		else {
			//start Metronome
			$("#play").html("Stop");
			startMetronome();
		}
	});

	$("#tempo").change(function(){
		setBPM(parseInt($("#tempo").val()));
	});

	$("#sigUpper").change(function(){
		sigUpper = parseInt($("#sigUpper").val());
	});

	$("#sigLower").change(function(){
		var tmp = parseInt($("#sigLower").val());
		if (tmp - sigLower > 0) {
			sigLower *= 2;
			metroBPM /= 2;
		}
		else if(tmp - sigLower < 0){
			sigLower /= 2;
			metroBPM *= 2;
		}
		console.log("BPM: " + metroBPM + " ms");
		$("#sigLower").val(sigLower);
		//setBPM();
	});

	initValues();
	
});

function setBPM (bpm) {
	metroBPM = (60000 / bpm) / (sigLower / 4);
	console.log("BPM: " + metroBPM + " ms");
}

function repeatMetronome() {
	
		var now = getTimestamp();
		delta = now - then;

		if(delta > metroBPM) {
			if (++timeCount < sigUpper && timeCount != 0) {
				playSound(sounds.tick, 0);
			}
			else {
				playSound(sounds.blip, 0);
				timeCount = 0;
			}
				
			then = now - (delta % metroBPM)
		}

		//console.log(delta);
	if (isPlaying) setTimeout(function(){repeatMetronome()}, 0);
	
}

function initValues() {
	$("#tempo").val(120);
	setBPM(120);

	$("#sigUpper").val(4);
	sigUpper = 4;

	$("#sigLower").val(4);
	sigUpper = 4;
};

function startMetronome() {
	isPlaying = true;
	playSound(sounds.blip, 0);
	then = getTimestamp();
	repeatMetronome();
}

function stopMetronome(){
	isPlaying = false;
	timeCount = 0;
}

function drawRects() {
	//TODO: Disminuir margen al aumentar el denominador del tiempo
	var margin = 20;
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var rectWidth = (c.width - margin) / sigLower - margin;
	var maxHeight = c.height

	for (var i = 0; i < sigLower; i++) {
		var xStart = (rectWidth+margin) * i + margin;
		var xEnd = xStart + rectWidth;
		ctx.fillStyle = "#"+((1<<24)*Math.random()|0).toString(16);
		ctx.fillRect(xStart, margin, rectWidth, 60);	
	}
}