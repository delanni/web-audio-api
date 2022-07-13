import { NextPage } from "next";
import EditorSplitView from "../../components/EditorSplitView";

const GainAndFilter: NextPage = () => {
  // language=HTML
  const html = /* html */ `
    <div>
      <select id="waveform">
        <option selected value="sine">Sine wave</input>
        <option value="sawtooth">Sawtooth</input>
        <option value="square">Square wave</input>
        <option value="triangle">Triangle wave</input>
      </select>
    </div>

    <div>
      <input id="frequency-dial" type="range" min="1" max="4" step="0.001"
             value="2.342422680822206" />
      Output Frequency: <span id="frequency-indicator">440 Hz</span>
    </div>

    <div>
      <input id="cutoff-dial" type="range" min="1" max="4" step="0.001" value="4" />
      Cutoff: <span id="cutoff-indicator">20000 Hz</span>
    </div>

    <div>
      <input id="q-dial" type="range" min="0" max="100" step="0.01" value="1" />
      Q value: <span id="q-indicator">1</span>
    </div>

    <div>
      <input id="gain-dial" type="range" min="0" max="3" step="0.01" value="1" />
      Gain: <span id="gain-indicator">1</span>
    </div>

    <button id="btn">Beep!</button>
  `;

  // language=JavaScript
  const code = /* javascript */ `
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const filterNode = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain(); // create a gain node

    oscillator.connect(filterNode); // connect the oscillator to the gain node
    filterNode.connect(gainNode); // connect the gain node to the filter node
    gainNode.connect(audioCtx.destination); // connect the filter node to the audio context destination (the speakers)

    document.getElementById("gain-dial").oninput = e => {
      const v = parseFloat(e.target.value);
      document.getElementById('gain-indicator').innerText = Math.round(v * 100) + '%';
      gainNode.gain.value = v;
    }

    document.getElementById("q-dial").oninput = e => {
      const v = parseFloat(e.target.value);
      document.getElementById('q-indicator').innerText = v.toFixed(2);
      filterNode.Q.value = v;
    }

    ["frequency", "cutoff"].forEach(filterName => {
      document.getElementById(filterName + "-dial").oninput = e => {
        const v = parseFloat(e.target.value);
        const filterValueHz = Math.round(2 * (10 ** v));
        document.getElementById(filterName + "-indicator").innerText = filterValueHz + ' Hz';
        
        if (filterName === "frequency") {
          oscillator.frequency.value = filterValueHz;
        } else {
          filterNode.frequency.value = filterValueHz;
        }
      }
    })
    
    document.getElementById("waveform").onchange = e => {
        oscillator.type = e.target.value; // Set oscillator waveform
    };
    
    ['frequency', 'cutoff', 'q', 'gain'].forEach(inputName => {
      const inputDial = document.getElementById(inputName + "-dial");
      inputDial.oninput({target: inputDial});
    });

    document.getElementById('btn').onclick = () => oscillator.start();

    /* CLEANUP */
    oscillator.stop();
    audioCtx.close();
  `;

  return <EditorSplitView code={code} html={html} runCodeOnLoad={true} />;
};

export default GainAndFilter;
