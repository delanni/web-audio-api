import { NextPage } from "next";
import EditorSplitView from "../../components/EditorSplitView";
import useSmartState from "../../utils/smartState";

const MelodicSequences: NextPage = () => {
  // language=HTML
  const html = /* html */ `
  `;

  // language=JavaScript
  const code = /* javascript */ `
    const audioCtx = new AudioContext();

    const oscillator1 = audioCtx.createOscillator();
    oscillator1.type = "triangle";
    oscillator1.detune.value = 10;
    const stereoPanner1 = audioCtx.createStereoPanner();
    stereoPanner1.pan.value = -0.2;
    oscillator1.connect(stereoPanner1);
    oscillator1.frequency.value = 110;
    const envelopeGenerator1 = audioCtx.createGain();

    const oscillator2 = audioCtx.createOscillator();
    oscillator2.type = "sawtooth";
    oscillator2.detune.value = -10;
    const stereoPanner2 = audioCtx.createStereoPanner();
    stereoPanner2.pan.value = 0.1;
    oscillator2.connect(stereoPanner2);
    oscillator2.frequency.value = 220;
    const envelopeGenerator2 = audioCtx.createGain();

    stereoPanner1.connect(envelopeGenerator1);
    stereoPanner2.connect(envelopeGenerator2);

    const filterNode = audioCtx.createBiquadFilter();
    envelopeGenerator1.connect(filterNode);
    envelopeGenerator2.connect(filterNode);

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.2;
    filterNode.connect(gainNode);

    const reverb = audioCtx.createConvolver();
    reverb.buffer = window.reverbBuffer;
    gainNode.connect(reverb);

    const wetGain = audioCtx.createGain();
    const dryGain = audioCtx.createGain();
    reverb.connect(wetGain);
    gainNode.connect(dryGain);

    dryGain.connect(audioCtx.destination);
    wetGain.connect(audioCtx.destination);

    // Trigger one hit on the oscillator
    document.getElementById('btn').onclick = () => {
      oscillator1.start();
      oscillator2.start();
    }

    document.getElementById("shuffle-oscillators").onclick = () => {
      oscillator1.type = ["sine", "triangle", "square", "sawtooth"][Math.floor(Math.random() * 4)]
      oscillator2.type = ["sine", "triangle", "square", "sawtooth"][Math.floor(Math.random() * 4)]
    }

    document.getElementById("split-view-controllers").onkeydown = ev => {
      ev.preventDefault()
      
      const freq = {
        "Digit1": 27.50*16, "Digit2": 30.87*16, "Digit3": 32.70*16, "Digit4": 36.71*16, "Digit5": 41.20*16, "Digit6": 43.65*16, "Digit7": 49.00*16, "Digit8": 55.00*16, "Digit9": 30.87*32,
        "KeyQ": 27.50*8, "KeyW": 30.87*8, "KeyE": 32.70*8, "KeyR": 36.71*8, "KeyT": 41.20*8, "KeyY": 43.65*8, "KeyU": 49.00*8, "KeyI": 55.00*8, "KeyO": 30.87*16,
        "KeyA": 27.50*4, "KeyS": 30.87*4, "KeyD": 32.70*4, "KeyF": 36.71*4, "KeyG": 41.20*4, "KeyH": 43.65*4, "KeyJ": 49.00*4, "KeyK": 55.00*4,
        "KeyZ": 27.50 * 2, "KeyX": 30.87 * 2, "KeyC": 32.70 * 2, "KeyV": 36.71 * 2, "KeyB": 41.20 * 2, "KeyN": 43.65 * 2, "KeyM": 49.00 * 2, "Comma": 55.00 * 2
      }[ev.code];
      
      if (freq) {
        oscillator1.frequency.value = oscillator2.frequency.value = freq;

        // if ("123456789qwertyuiop".includes(ev.code[ev.code.length-1].toLowerCase())) {
        //   oscillator1.frequency.value = freq;
        //   if (!ev.shiftKey) {
        //     triggerEnvelope(envelopeGenerator1.gain, 0.01, 0, 3);
        //   } else {
        //     envelopeGenerator1.gain.cancelScheduledValues(audioCtx.currentTime);
        //     envelopeGenerator1.gain.value = 1;
        //   }
        // } else {
        //   oscillator2.frequency.value = freq;
        //   if (!ev.shiftKey) {
        //     triggerEnvelope(envelopeGenerator2.gain, 0.1, 0, 4);
        //   } else {
        //     envelopeGenerator2.gain.cancelScheduledValues(audioCtx.currentTime);
        //     envelopeGenerator2.gain.value = 1;
        //   }
        // }
      }
    }

    // Start the oscillator in the background

    window.addEventListener("update-cutoff", (e) => {
      filterNode.frequency.value = e.detail;
    });
    window.addEventListener("update-q", (e) => {
      filterNode.Q.value = e.detail;
    });
    window.addEventListener("update-gain", (e) => {
      gainNode.gain.value = e.detail;
    });
    window.addEventListener("update-stereo-pan", (e) => {
      stereoPanner1.pan.value = e.detail;
      stereoPanner2.pan.value = -e.detail;
    });
    window.addEventListener("update-detune", (e) => {
      oscillator1.detune.value = e.detail;
      oscillator2.detune.value = -e.detail;
    });
    window.addEventListener("update-wetness", (e) => {
      dryGain.gain.value = 1 - e.detail;
      wetGain.gain.value = e.detail;
    });

    function triggerEnvelope(audioParam, attack, hold, release) {
      const time = audioCtx.currentTime;
      audioParam.cancelScheduledValues(time);
      audioParam.setValueAtTime(0, time);
      audioParam.linearRampToValueAtTime(1, time + attack);
      audioParam.linearRampToValueAtTime(1, time + attack + hold);
      audioParam.exponentialRampToValueAtTime(0.0001, time + attack + hold + release);
    }

    /* CLEANUP */
    oscillator1.stop(audioCtx.currentTime);
    oscillator2.stop(audioCtx.currentTime);
    audioCtx.close();
  `;

  const cutoff = useSmartState<number>(20000, {
    valueToInput: (val) => Math.log10(val / 2),
    inputToValue: (input) => Math.floor(2 * Math.pow(10, input)),
    onUpdate: dispatchOnWindow("update-cutoff")
  });

  const q = useSmartState<number>(1, {
    onUpdate: dispatchOnWindow("update-q")
  });

  const gain = useSmartState<number>(0.2, {
    onUpdate: dispatchOnWindow("update-gain")
  });

  const stereoPan = useSmartState<number>(-.2, {
    onUpdate: dispatchOnWindow("update-stereo-pan")
  });

  const detune = useSmartState<number>(10, {
    onUpdate: dispatchOnWindow("update-detune")
  });

  const reverbWetness = useSmartState<number>(0, {
    onUpdate: dispatchOnWindow("update-wetness")
  });

  return <EditorSplitView code={code} html={html} runCodeOnLoad={true}>
    <button id="shuffle-oscillators">Shuffle oscillators</button>

    <div>
      <input id="pan-dial" type="range" min="-1" max="1" step="0.01" value={stereoPan.inputValue}
             onChange={stereoPan.update} />
      Pan {Math.floor(stereoPan.value * 100)}%
    </div>

    <div>
      <input id="detune-dial" type="range" min="-100" max="100" step="1" value={detune.inputValue}
             onChange={detune.update} />
      Detune {detune.value} cents
    </div>

    <div>
      <input id="cutoff-dial" type="range" min="0" max="4" step="0.001" value={cutoff.inputValue}
             onChange={cutoff.update} />
      Cutoff Frequency: {cutoff.value} Hz
    </div>

    <div>
      <input id="q-dial" type="range" min="0" max="50" step="0.01" value={q.inputValue}
             onChange={q.update} />
      Q value: {q.value}
    </div>

    <div>
      <input id="gain-dial" type="range" min="0" max="3" step="0.01" value={gain.inputValue}
             onChange={gain.update} />
      Gain: {Math.floor(gain.value * 100)}%
    </div>

    <div>
      <input id="reverb-dial" type="range" min="0" max="1" step="0.01"
             value={reverbWetness.inputValue}
             onChange={reverbWetness.update} />
      Reverb: {Math.floor(reverbWetness.value * 100)}% wet
    </div>

    <button id="btn">Beep!</button>
  </EditorSplitView>;
};

class UpdateEvent extends Event {
  public detail: any;

  constructor(type: string, public value: any) {
    super(type);
    this.detail = value;
  }
}

function dispatchOnWindow(functionName: string) {
  return (value: unknown) => {
    const ev = new UpdateEvent(functionName, value);
    (window as any).dispatchEvent(ev);
  };
}

export default MelodicSequences;
