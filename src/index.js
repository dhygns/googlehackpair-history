
import Track from "./midi/track.js"
import Visual from "./visual.js"


const button = document.querySelector("button");
button.addEventListener("click", function(){
	if (Tone.Transport.state === "started"){
		// button.textContent = "START";
		stop();
	} else {
		// button.textContent = "STOP";
		start();
	}
});

function stop() {
	Tone.Transport.stop();
}

function start() {
	Tone.Transport.start("+0.1", 0);
}


//Midi file Load... and...
var Miditracks = [];
MidiConvert.load("res/MIDI_sample.mid").then(function(midi){

	//You have to check tracks for making notes.
	console.log(midi);

	// play each tracks with each sound
	midi.tracks.forEach((track)=>{
		Miditracks.push(new Track(4, Tone.Synth, track.notes));
	})
	
	Tone.Transport.bpm.value = midi.bpm;
	Tone.Transport.timeSignature = midi.timeSignature;
	// button.classList.add("active")
});



//Visual Effect
(function() {
    this.setup();
    this.animate(0, 0);
}).bind({
    setup : function() {
        this.main = new Visual(Miditracks);
    },

    update : function(t, dt) {
        this.main.update(t, dt);
    },

    animate : function(oldt, nowt) {
        this.update(nowt * 0.001, (nowt - oldt) * 0.001);
        requestAnimationFrame(this.animate.bind(this, nowt));
    }
})();