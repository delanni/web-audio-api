const audioCtx = new AudioContext();

const synth1 = createTwoOscillatorDevice(audioCtx, {
    octaveOffset: -1,
    depan: 0.0,
    detune: -10,
    reverbWetness: 0.4,
    oscillatorTypes: ["sawtooth", "square"]
});

const synth2 = createTwoOscillatorDevice(audioCtx, {
    octaveOffset: -2,
    depan: 0.8,
    oscillatorTypes: ["triangle", "triangle"],
    detune: 0,
    reverbWetness: 0.4,
    filterFreq: 10000,
});

const kickDrum = createDrumSynth(audioCtx, {
    params: {
        drumMix: 1.0,
        noiseMix: 0.001,
        gainRelease: 0.2
    }
});

const snareDrum = createDrumSynth(audioCtx, {
    params: {
        drumMix: 0.4,
        noiseMix: 0.2,
        pitchMax: 300,
        pitchMin: 30,
        gainRelease: 0.1,
        oscillatorType: "triangle"
    }
});
const snareFilter = audioCtx.createBiquadFilter();
snareFilter.type = "highpass";
snareFilter.frequency.value = 700;
snareDrum.masterGain.connect(snareFilter);

const hiHat = createDrumSynth(audioCtx, {
    params: {
        drumMix: 0.1,
        pitchRelease: 0.1,

        noiseMix: 0.6,

        gainRelease: 0.1,
        oscillatorType: "sawtooth"
    }
});
const hihatFilter = audioCtx.createBiquadFilter();
hihatFilter.type = "highpass";
hihatFilter.frequency.value = 11000;
hiHat.masterGain.connect(hihatFilter);

const compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-20, audioCtx.currentTime);
compressor.knee.setValueAtTime(10, audioCtx.currentTime);
compressor.ratio.setValueAtTime(6, audioCtx.currentTime);
compressor.attack.setValueAtTime(0, audioCtx.currentTime);
compressor.release.setValueAtTime(0.1, audioCtx.currentTime);

kickDrum.masterGain.connect(compressor);
snareFilter.connect(compressor);
hihatFilter.connect(compressor);

synth1.masterGain.connect(compressor);
synth2.masterGain.connect(compressor);

compressor.connect(audioCtx.destination);

const BPM = 130;

// Trigger one hit on the oscillator
document.getElementById('btn').onclick = () => {
    createPatternSequencer(BPM, [
        "K", "", "H", "K",
        "S", "", "KH", "",
        "", "K", "H", "H?",
        "KS", "", "KH", "",
        "K", "", "H", "K",
        "S", "", "KH", "",
        "", "K", "H", "H?",
        "KS", "", "KH", "KS?",
    ], (count, value) => {
        const time = audioCtx.currentTime;
        if (value.indexOf("?") >= 0 && Math.random() > 0.5) return;

        value.split("").forEach((symbol) => {
            switch (symbol) {
                case "K": {
                    kickDrum.triggerEnvelope(time);
                    break;
                }
                case "H": {
                    hiHat.triggerEnvelope(time, false);
                    break;
                }
                case "S": {
                    snareDrum.triggerEnvelope(time);
                    break;
                }
                case "*": {
                    if (Math.random() > 0.5) {
                        hihatFilter.frequency.value = hihatFilter.frequency.value - 500;
                    } else {
                        hihatFilter.frequency.value = hihatFilter.frequency.value + 500;
                    }
                }
            }
        });
    });

    createPatternSequencer(BPM, [
        // 3, 0, 0, 0,
        // 3, 0, 0, 0,
        // 3, 0, 0, 0,
        // 1, 0, 1, 0,
        //
        0, 1, 0, 1,
        0, 0, 2, 0,
        0, 1, 0, 1,
        4, 0, "potato", 0,
        //
        // 3, 0, 0, 0,
        // 3, 0, 0, 0,
        // 3, 0, 0, 0,
        // 1, 0, 1, 0,
        //
        // 3, 0, 0, 0,
        // 3, 0, 0, 0,
        // 6, 0, 0, 0,
        // 0, 0, 0, 0,
    ], (count, value, unitLength) => {
        if (value === "potato") {
            const time = audioCtx.currentTime;
            synth1.triggerEnvelope(time, "A4", unitLength);
        } else {
            const time = audioCtx.currentTime;
            synth1.triggerEnvelope(time, "A3", value * unitLength);
        }
    });

    const notes = ["A5", "C6", "A6", "C5"];

    // const notes = ["A", "C", "D", "E", "F"];
    let currentNoteIdx = 0;
    createPatternSequencer(BPM, [
        1,
        // 0, 2, 0, 0, 0,
        // 1, 0, 2, 0, 0, 0,
        // 1, 0, 2, 0, 1, 0,
        // 1, 0, 2, 0, 0, 0,
        // 1, 0, 2, 0, 0, 0,
        // 1, 0, 2, 0, 1, 1,
    ], (count, value, envLength) => {
        const time = audioCtx.currentTime;

        synth2.triggerEnvelope(time, notes[currentNoteIdx % notes.length], value * envLength);

        if (Math.random() > 0.9) {
            currentNoteIdx = Math.floor(Math.random() * notes.length);
        }
    });

    createLFO(0.1, audioCtx, 300, synth1.filterNode.frequency)
    createLFO(0.05, audioCtx, 1, synth2.stereoPanner1.pan)
    createLFO(0.06, audioCtx, -1, synth2.stereoPanner2.pan)
}

addEventListeners({
    "update-synth1-level": synth1.masterGain.gain,
    "update-synth1-cutoff": synth1.filterNode.frequency,
    "update-synth1-q": synth1.filterNode.Q,
    "update-synth2-level": synth2.masterGain.gain,
    "update-synth2-cutoff": synth2.filterNode.frequency,
    "update-synth2-depan": (v) => {
        synth2.params.depan = v;
        synth2.reconfigure();
    },
    "update-kickdrum-level": kickDrum.masterGain.gain,
    "update-snaredrum-level": snareDrum.masterGain.gain,
    "update-hihat-level": hiHat.masterGain.gain,
    "update-hihat-cutoff": hihatFilter.frequency,
    "update-hihat-release": v => {
        hiHat.params.gainRelease = v;
    }
});

/* CLEANUP */
audioCtx.close();