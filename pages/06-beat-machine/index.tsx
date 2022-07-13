import { NextPage } from "next";
import EditorSplitView from "../../components/EditorSplitView";
import useSmartState from "../../utils/smartState";

const BeatMachine: NextPage = () => {
  // language=HTML
  const html = /* html */ `
  `;

  // language=JavaScript
  const code = /* javascript */ `
    const audioCtx = new AudioContext();

    const synth1 = createTwoOscillatorDevice(audioCtx, {
      octaveOffset: -2,
      depan: 0.1,
      detune: 10,
      reverbWetness: 0.2
    });

    const synth2 = createTwoOscillatorDevice(audioCtx, {
      octaveOffset: -1,
      depan: 0.8,
      oscillatorTypes: ["sine", "triangle"],
      detune: 0,
      reverbWetness: 0.4,
      filterFreq: 10000,
    });

    const kickDrum = createDrumSynth(audioCtx, {
      params: {
        drumMix: 1.1,
        noiseMix: 0
      }
    });

    const snareDrum = createDrumSynth(audioCtx, {
      params: {
        drumMix: 0.4,
        noiseMix: 0.2,
        pitchMax: 300,
        pitchMin: 30,
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
    hihatFilter.frequency.value = 8000;
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
        "K", "", "H", "",
        "KS", "", "H", "",
        "K", "", "H", "H?",
        "KS", "", "H", "",
        "K", "", "H", "",
        "KS", "", "H", "S?",
        "K", "", "H", "H?",
        "KS", "K?", "H", "*",
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
        3, 0, 0, 0,
        // 3, 0, 0, 0,
        // 3, 0, 0, 0,
        // 1, 0, 1, 0,
        //
        // 3, 0, 0, 0,
        // 3, 0, 0, 0,
        // 3, 0, 0, 0,
        // 1, 0, 1, 0,
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
      ], (count, envLength) => {
        const time = audioCtx.currentTime;
        synth1.triggerEnvelope(time, "A", envLength);
      });

      const notes = ["A4", "C5", "A5", "D4", "F4"];

      // const notes = ["A", "C", "D", "E", "F"];
      let currentNoteIdx = 0;
      createPatternSequencer(BPM, [
        1, 0, 2, 0, 0, 0,
        1, 0, 2, 0, 0, 0,
        1, 0, 2, 0, 1, 0,
        1, 0, 2, 0, 0, 0,
        1, 0, 2, 0, 0, 0,
        1, 0, 2, 0, 1, 1,
      ], (count, envLength) => {
        const time = audioCtx.currentTime;

        synth2.triggerEnvelope(time, notes[currentNoteIdx % notes.length], envLength);

        if (Math.random() > 0.1) {
          currentNoteIdx++;
        }
      });

      createLFO(0.1, audioCtx, 300, synth1.filterNode.frequency)
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
  `;

  const synth1Cutoff = useSmartState<number>(600, {
    valueToInput: (val) => Math.log10(val / 2),
    inputToValue: (input) => Math.floor(2 * Math.pow(10, input)),
    onUpdate: dispatchOnWindow("update-synth1-cutoff")
  });

  const synth1Q = useSmartState<number>(4, {
    onUpdate: dispatchOnWindow("update-synth1-q")
  });

  const synth1Level = useSmartState(1, {
    onUpdate: dispatchOnWindow("update-synth1-level")
  });

  const synth2Cutoff = useSmartState<number>(10000, {
    valueToInput: (val) => Math.log10(val / 2),
    inputToValue: (input) => Math.floor(2 * Math.pow(10, input)),
    onUpdate: dispatchOnWindow("update-synth2-cutoff")
  });

  const synth2Depan = useSmartState<number>(0.8, {
    onUpdate: dispatchOnWindow("update-synth2-depan")
  });

  const synth2Level = useSmartState(1, {
    onUpdate: dispatchOnWindow("update-synth2-level")
  });

  const kickdrumLevel = useSmartState(1, {
    onUpdate: dispatchOnWindow("update-kickdrum-level")
  });

  const snaredrumLevel = useSmartState(1, {
    onUpdate: dispatchOnWindow("update-snaredrum-level")
  });

  const hiHatLevel = useSmartState(1, {
    onUpdate: dispatchOnWindow("update-hihat-level")
  });

  const hihatRelease = useSmartState(.1, {
    onUpdate: dispatchOnWindow("update-hihat-release")
  });

  const hihatCutoff = useSmartState<number>(8000, {
    valueToInput: (val) => Math.log10(val / 2),
    inputToValue: (input) => Math.floor(2 * Math.pow(10, input)),
    onUpdate: dispatchOnWindow("update-hihat-cutoff")
  });

  return <EditorSplitView code={code} html={html} runCodeOnLoad={true}>

    <div className={"device"}>
      <header>Synth 1</header>
      <section>
        <div>
          Level: {Math.floor(synth1Level.value * 100)}%
        </div>
        <input type="range" min="0" max="1" step="0.01"
               value={synth1Level.inputValue}
               onChange={synth1Level.update} />
      </section>

      <section>
        <div>
          Cutoff freq: {synth1Cutoff.value} Hz
        </div>
        <input type="range" min="0" max="4" step="0.001"
               value={synth1Cutoff.inputValue}
               onChange={synth1Cutoff.update} />
      </section>
      <section>
        <div>Q value: {synth1Q.value}</div>
        <input type="range" min="0" max="50" step="0.01" value={synth1Q.inputValue}
               onChange={synth1Q.update} />
      </section>
    </div>

    <div className={"device"}>
      <header>Synth 2</header>
      <section>
        <div>
          Level: {Math.floor(synth2Level.value * 100)}%
        </div>
        <input type="range" min="0" max="1" step="0.01"
               value={synth2Level.inputValue}
               onChange={synth2Level.update} />
      </section>

      <section>
        <div>
          Cutoff freq: {synth2Cutoff.value} Hz
        </div>
        <input type="range" min="0" max="4" step="0.001"
               value={synth2Cutoff.inputValue}
               onChange={synth2Cutoff.update} />
      </section>
      <section>
        <div>Depan: {Math.floor(100 * synth2Depan.value)} %</div>
        <input type="range" min="-1" max="1" step="0.01" value={synth2Depan.inputValue}
               onChange={synth2Depan.update} />
      </section>
    </div>

    <div className={"device"}>
      <header>Drums</header>
      <section>
        <div>
          Kickdrum Level {Math.floor(100 * kickdrumLevel.value)} %
        </div>
        <input type="range" min="0" max="1" step="0.01"
               value={kickdrumLevel.inputValue}
               onChange={kickdrumLevel.update} />
      </section>

      <section>
        <div>
          Snaredrum Level {Math.floor(100 * snaredrumLevel.value)} %
        </div>
        <input type="range" min="0" max="1" step="0.01"
               value={snaredrumLevel.inputValue}
               onChange={snaredrumLevel.update} />
      </section>

      <section>
        <div>
          Hi-hat level {Math.floor(100 * hiHatLevel.value)} %
        </div>
        <input type="range" min="0" max="1" step="0.01"
               value={hiHatLevel.inputValue}
               onChange={hiHatLevel.update} />
      </section>

      <section>
        <div>
          Hi-hat release: {hihatRelease.value.toPrecision(2)} seconds
        </div>
        <input type="range" min="0" max="1" step="0.01"
               value={hihatRelease.inputValue}
               onChange={hihatRelease.update} />
      </section>

      <section>
        <div>
          Hihat filter: {hihatCutoff.value} Hz
        </div>
        <input type="range" min="0" max="4" step="0.001"
               value={hihatCutoff.inputValue}
               onChange={hihatCutoff.update} />
      </section>
    </div>


    <button id="btn">Start!</button>
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

export default BeatMachine;
