import { NextPage } from "next";
import EditorSplitView from "../../components/EditorSplitView";

const BasicWaveforms: NextPage = () => {
  const html = /* html */ `
    <div>
      <input id="freq-dial" type="range" min="1" max="4" step="0.001" value="2.342422680822206"></input>
      Output Frequency: <span id="freq">440</span> Hz
    </div>
    
    <div>
      <select id="waveform">
        <option selected value="sine">Sine wave</input>
        <option value="sawtooth">Sawtooth</input>
        <option value="square">Square wave</input>
        <option value="triangle">Triangle wave</input>
      </select>
    </div>
    
    <button id="btn">Beep!</button>
`;

  // language=JavaScript
  const code = /* javascript */`
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    
    document.getElementById('btn').onclick = () => oscillator.start();
    
    document.getElementById("freq-dial").oninput = e => {
        const v = parseFloat(e.target.value); // take reading from the dial, use it a log scaler
        const freq = Math.floor(2 * (10 ** v)); // convert to Hz
        document.getElementById('freq').innerText = freq; // display the frequency
    
        oscillator.frequency.value = freq; // set the frequency of the oscillator
    }
    
    document.getElementById("waveform").onchange = e => {
        oscillator.type = e.target.value; // Set oscillator waveform
    };
    
    /* CLEANUP */
    oscillator.stop();
    audioCtx.close();
  `;

  return <EditorSplitView code={code} html={html} runCodeOnLoad={true} />;
};

export default BasicWaveforms;
