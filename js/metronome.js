var context = new AudioContext();
var getSound = new XMLHttpRequest();
var isPlaying = false;		//Esta activo el metronomo
var metroBPM;
var metronomo;
var signature = 4;
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

	$("#signature").change(function(){
		signature = parseInt($("#signature").val());
	});

	initValues();
	
});

function setBPM (bpm) {
	metroBPM = 60000 / bpm - 0; 	// -1 para compensar el setTimeOut
	console.log("BPM: " + metroBPM + " ms");
}

function repeatMetronome() {
	
		var now = getTimestamp();
		delta = now - then;

		if(delta > metroBPM) {
			if (++timeCount < signature && timeCount != 0) {
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

	$("#signature").val(4);
	signature = 4;
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