function chainNodes(...nodes) {
    for (var i = 0; i < nodes.length - 1; i++) {
        nodes[i].connect(nodes[i + 1]);
    }

    nodes[i].connect(nodes[i].context.destination);
}

function createPatternSequencer(bpm, pattern, callback) {
    const msPerBeat = (60000 / bpm);
    const msPerQuarterNote = msPerBeat / 4;
    let unit = 0;
    const intervalId = setInterval(() => {
        const value = pattern[unit % pattern.length];
        if (value) {
            if (typeof value === 'number') {
                callback(unit, (value * msPerQuarterNote) / 1000, msPerQuarterNote);
            } else {
                callback(unit, value, msPerQuarterNote);
            }
        }

        unit = unit + 1;
    }, msPerQuarterNote);

    return () => clearInterval(intervalId);
}

/**
 * Creates a new low frequency oscillator node.
 * @param frequency The frequency of the oscillator.
 * @param audioContext The audio context to create the node in.
 * @param range The range of modulation of the oscillator.
 * @param audioParam The audio parameter to control.
 * @return {function(): void}
 */
function createLFO(frequency, audioContext, range, audioParam) {
    const lfo = audioContext.createOscillator();
    const gainAdjustment = audioContext.createGain();
    gainAdjustment.gain.value = range;
    lfo.frequency.value = frequency;
    lfo.type = 'sine';
    lfo.connect(gainAdjustment);
    gainAdjustment.connect(audioParam);
    lfo.start();

    return () => lfo.stop(audioContext.currentTime);
}

fetch('/reverb-long.wav').then(response => response.arrayBuffer()).then(arrayBuffer => {
    const audioContext = new AudioContext();
    audioContext.decodeAudioData(arrayBuffer, buffer => {
        window.reverbBuffer = buffer;
    });
});

function createTwoOscillatorDevice(audioCtx, _params = {}) {

    const params = {
        octaveOffset: 0,
        oscillatorTypes: ['triangle', 'sawtooth'],
        detune: 10,
        depan: 0.2,
        reverbWetness: 0.2,
        attack: 0.01,
        release: 0.1,
        filterFreq: 600,
        filterQ: 4,
        ..._params,
    };

    const oscillator1 = audioCtx.createOscillator();
    const stereoPanner1 = audioCtx.createStereoPanner();
    const envelopeGenerator1 = audioCtx.createGain();

    const oscillator2 = audioCtx.createOscillator();
    const stereoPanner2 = audioCtx.createStereoPanner();
    const envelopeGenerator2 = audioCtx.createGain();

    const filterNode = audioCtx.createBiquadFilter();

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;

    const reverb = audioCtx.createConvolver();
    reverb.buffer = window.reverbBuffer;

    const wetGain = audioCtx.createGain();
    const dryGain = audioCtx.createGain();

    const masterGain = audioCtx.createGain();

    oscillator1.connect(stereoPanner1);
    stereoPanner1.connect(envelopeGenerator1);
    envelopeGenerator1.connect(filterNode);

    oscillator2.connect(stereoPanner2);
    stereoPanner2.connect(envelopeGenerator2);
    envelopeGenerator2.connect(filterNode);

    filterNode.connect(gainNode);
    gainNode.connect(reverb);
    reverb.connect(wetGain);
    gainNode.connect(dryGain);
    dryGain.connect(masterGain);
    wetGain.connect(masterGain);

    const reconfigure = (paramOverrides) => {
        const {
            oscillatorTypes,
            detune,
            depan,
            reverbWetness,
            filterFreq,
            filterQ,
        } = { ...params, ...paramOverrides };

        oscillator1.type = oscillatorTypes[0];
        oscillator1.detune.value = detune;
        stereoPanner1.pan.value = depan;
        envelopeGenerator1.gain.value = 0;

        oscillator2.type = oscillatorTypes[1];
        oscillator2.detune.value = -detune;
        stereoPanner2.pan.value = -depan;
        envelopeGenerator2.gain.value = 0;

        filterNode.type = 'lowpass';
        filterNode.frequency.value = filterFreq;
        filterNode.Q.value = filterQ;

        wetGain.gain.value = reverbWetness;
        dryGain.gain.value = 1 - reverbWetness;
    };

    const triggerEnvelope = (time, note, release = params.release) => {
        oscillator1.frequency.value = note.length === 1 ? getFreqForNote(note) : freqLookup(note);
        envelopeGenerator1.gain.cancelScheduledValues(time);
        envelopeGenerator1.gain.setValueAtTime(0, time);
        envelopeGenerator1.gain.linearRampToValueAtTime(1, time + params.attack);
        envelopeGenerator1.gain.linearRampToValueAtTime(0, time + params.attack + release);

        oscillator2.frequency.value = (note.length === 1 ? getFreqForNote(note) : freqLookup(note)) * (2
            ** params.octaveOffset);
        envelopeGenerator2.gain.cancelScheduledValues(time);
        envelopeGenerator2.gain.setValueAtTime(0, time);
        envelopeGenerator2.gain.linearRampToValueAtTime(1, time + params.attack);
        envelopeGenerator2.gain.linearRampToValueAtTime(0, time + params.attack + release);
    };

    reconfigure();
    oscillator1.start(audioCtx.currentTime);
    oscillator2.start(audioCtx.currentTime);

    return {
        params,
        reconfigure,
        oscillator1,
        oscillator2,
        envelopeGenerator1,
        envelopeGenerator2,
        masterGain,
        filterNode,
        triggerEnvelope,
    };
}

function createDrumSynth(audioContext, options = {}) {
    const params = {
        pitchMax: 220,
        pitchMin: 55,
        pitchRelease: 0.08,

        attack: 0.01,
        gainRelease: 0.3,
        gainMax: 1.0,

        drumMix: 0.9,
        noiseMix: 0.1,

        oscillatorType: 'sine',
        ...(options.params || {}),
    };

    const mainOscillator = audioContext.createOscillator();
    mainOscillator.type = params.oscillatorType;
    mainOscillator.frequency = 100;
    mainOscillator.start();
    const drumMix = audioContext.createGain();
    drumMix.gain.value = params.drumMix;

    const whiteNoiseBuffer = createWhiteNoise(audioContext);
    const noiseMix = audioContext.createGain();
    noiseMix.gain.value = params.noiseMix || 0.0;

    const envelopeGen = audioContext.createGain();
    envelopeGen.gain.value = 0;

    const masterGain = audioContext.createGain();

    whiteNoiseBuffer.connect(noiseMix);
    noiseMix.connect(envelopeGen);

    mainOscillator.connect(drumMix);
    drumMix.connect(envelopeGen);

    envelopeGen.connect(masterGain);

    const getEpsilon = (domain) => {
        return Math.random() * domain - domain / 2;
    };

    const triggerEnvelope = (time, randomize = true) => {
        noiseMix.gain.value = params.noiseMix || 0.0;
        drumMix.gain.value = params.drumMix;

        if (randomize) {
            mainOscillator.frequency.cancelScheduledValues(time);
            mainOscillator.frequency.setValueAtTime(params.pitchMin, time);
            mainOscillator.frequency.exponentialRampToValueAtTime(params.pitchMax + getEpsilon(10),
                time + params.attack);
            mainOscillator.frequency.exponentialRampToValueAtTime(params.pitchMin + getEpsilon(10),
                time + params.attack + params.pitchRelease + getEpsilon(0.05));

            envelopeGen.gain.cancelScheduledValues(time);
            envelopeGen.gain.setValueAtTime(0, time);
            envelopeGen.gain.linearRampToValueAtTime(params.gainMax + getEpsilon(0.1), time + params.attack);
            envelopeGen.gain.linearRampToValueAtTime(0, time + params.attack + params.gainRelease + getEpsilon(0.1));
        } else {
            mainOscillator.frequency.cancelScheduledValues(time);
            mainOscillator.frequency.setValueAtTime(params.pitchMin, time);
            mainOscillator.frequency.exponentialRampToValueAtTime(params.pitchMax, time + params.attack);
            mainOscillator.frequency.exponentialRampToValueAtTime(params.pitchMin,
                time + params.attack + params.pitchRelease);

            envelopeGen.gain.cancelScheduledValues(time);
            envelopeGen.gain.setValueAtTime(0, time);
            envelopeGen.gain.linearRampToValueAtTime(params.gainMax, time + params.attack);
            envelopeGen.gain.linearRampToValueAtTime(0, time + params.attack + params.gainRelease);
        }
    };

    return {
        mainOscillator,
        gainEnvelope: envelopeGen,
        masterGain,
        params,
        triggerEnvelope,
    };
}

function createWhiteNoise(audioContext) {
    const lengthInSamples = 5 * audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, lengthInSamples, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < lengthInSamples; i++) {
        data[i] = ((Math.random() * 2) - 1);
    }

    // Create a source node from the buffer.
    const node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.loop = true;
    node[node.start ? 'start' : 'noteOn'](0);

    return node;
}

function getFreqForNote(note) {
    const noteOrdinal = note.charCodeAt(0) - 65;
    return 440 * (2 ** (noteOrdinal / 12));
}

function freqLookup(note) {
    return freqDictionary[note];
}

const freqDictionary = {
    'C0': 16.35,
    'C#0': 17.32,
    'Db0': 17.32,
    'D0': 18.35,
    'D#0': 19.45,
    'Eb0': 19.45,
    'E0': 20.60,
    'F0': 21.83,
    'F#0': 23.12,
    'Gb0': 23.12,
    'G0': 24.50,
    'G#0': 25.96,
    'Ab0': 25.96,
    'A0': 27.50,
    'A#0': 29.14,
    'Bb0': 29.14,
    'B0': 30.87,
    'C1': 32.70,
    'C#1': 34.65,
    'Db1': 34.65,
    'D1': 36.71,
    'D#1': 38.89,
    'Eb1': 38.89,
    'E1': 41.20,
    'F1': 43.65,
    'F#1': 46.25,
    'Gb1': 46.25,
    'G1': 49.00,
    'G#1': 51.91,
    'Ab1': 51.91,
    'A1': 55.00,
    'A#1': 58.27,
    'Bb1': 58.27,
    'B1': 61.74,
    'C2': 65.41,
    'C#2': 69.30,
    'Db2': 69.30,
    'D2': 73.42,
    'D#2': 77.78,
    'Eb2': 77.78,
    'E2': 82.41,
    'F2': 87.31,
    'F#2': 92.50,
    'Gb2': 92.50,
    'G2': 98.00,
    'G#2': 103.83,
    'Ab2': 103.83,
    'A2': 110.00,
    'A#2': 116.54,
    'Bb2': 116.54,
    'B2': 123.47,
    'C3': 130.81,
    'C#3': 138.59,
    'Db3': 138.59,
    'D3': 146.83,
    'D#3': 155.56,
    'Eb3': 155.56,
    'E3': 164.81,
    'F3': 174.61,
    'F#3': 185.00,
    'Gb3': 185.00,
    'G3': 196.00,
    'G#3': 207.65,
    'Ab3': 207.65,
    'A3': 220.00,
    'A#3': 233.08,
    'Bb3': 233.08,
    'B3': 246.94,
    'C4': 261.63,
    'C#4': 277.18,
    'Db4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'Eb4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'Gb4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'Ab4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'Bb4': 466.16,
    'B4': 493.88,
    'C5': 523.25,
    'C#5': 554.37,
    'Db5': 554.37,
    'D5': 587.33,
    'D#5': 622.25,
    'Eb5': 622.25,
    'E5': 659.25,
    'F5': 698.46,
    'F#5': 739.99,
    'Gb5': 739.99,
    'G5': 783.99,
    'G#5': 830.61,
    'Ab5': 830.61,
    'A5': 880.00,
    'A#5': 932.33,
    'Bb5': 932.33,
    'B5': 987.77,
    'C6': 1046.50,
    'C#6': 1108.73,
    'Db6': 1108.73,
    'D6': 1174.66,
    'D#6': 1244.51,
    'Eb6': 1244.51,
    'E6': 1318.51,
    'F6': 1396.91,
    'F#6': 1479.98,
    'Gb6': 1479.98,
    'G6': 1567.98,
    'G#6': 1661.22,
    'Ab6': 1661.22,
    'A6': 1760.00,
    'A#6': 1864.66,
    'Bb6': 1864.66,
    'B6': 1975.53,
    'C7': 2093.00,
    'C#7': 2217.46,
    'Db7': 2217.46,
    'D7': 2349.32,
    'D#7': 2489.02,
    'Eb7': 2489.02,
    'E7': 2637.02,
    'F7': 2793.83,
    'F#7': 2959.96,
    'Gb7': 2959.96,
    'G7': 3135.96,
    'G#7': 3322.44,
    'Ab7': 3322.44,
    'A7': 3520.00,
    'A#7': 3729.31,
    'Bb7': 3729.31,
    'B7': 3951.07,
    'C8': 4186.01,
    'C#8': 4434.92,
    'Db8': 4434.92,
    'D8': 4698.63,
    'D#8': 4978.03,
    'Eb8': 4978.03,
    'E8': 5274.04,
    'F8': 5587.65,
    'F#8': 5919.91,
    'Gb8': 5919.91,
    'G8': 6271.93,
    'G#8': 6644.88,
    'Ab8': 6644.88,
    'A8': 7040.00,
    'A#8': 7458.62,
    'Bb8': 7458.62,
    'B8': 7902.13,
};

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

function addEventListeners(map) {
    Object.keys(map).forEach(function(key) {
        const callbackOrAudioParam = map[key];
        if (typeof callbackOrAudioParam === 'function') {
            window.addEventListener(key, ({ detail }) => callbackOrAudioParam(detail));
        } else {
            window.addEventListener(key, ({ detail }) => (callbackOrAudioParam.value = detail));
        }
    });
}
