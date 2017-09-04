
export default class Track extends Tone.PolySynth{
    constructor(polyphony, voice, notes) {
        super(polyphony, voice);
        this.track = new Tone.Part(this.playNote.bind(this), notes).start(0);
        this.master = this.toMaster();
        
        this.event = {midi : 0};
    }

    playNote(time, event) {
        this.master.triggerAttackRelease(event.name, event.duration, time, event.velocity);
        this.event = event;
        setTimeout(
            ((midi)=>{ 
                if(this.event.midi == midi) this.event = {midi : 0};
            }).bind(this, this.event.midi), 
            event.duration * 1000.0);
    }

};