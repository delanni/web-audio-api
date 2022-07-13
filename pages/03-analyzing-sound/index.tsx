import { NextPage } from "next";
import EditorSplitView from "../../components/EditorSplitView";
import useSmartState from "../../utils/smartState";
import { useEffect } from "react";
import { drawFFTBins, drawWaveform } from "../../utils/visualization";

const AnalyzingSound: NextPage = () => {
  // language=HTML
  const html = /* html */ `
    <select id="analysis-kind">
      <option value="time">Time / Waveform</option>
      <option value="frequency">Frequency / FFT</option>
    </select>
    <canvas id="canvas" width="1024" height="400"></canvas>
  `;

  // language=JavaScript
  const code = /* javascript */ `
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const filterNode = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain();

    const analyserNode = audioCtx.createAnalyser(); // create an analyser node
    analyserNode.fftSize = 2 ** 12; // set the fft size to a power of 2, for visualisation

    oscillator.connect(filterNode); // oscillator => filter
    filterNode.connect(gainNode); // filter => gain
    gainNode.connect(analyserNode); // gain => analyser
    analyserNode.connect(audioCtx.destination); // analyser => speakers
    
    let analysisKind = "time";
    document.getElementById("analysis-kind").addEventListener("change", (e) => {
      analysisKind = e.target.value;
    });
    
    // Send analysis data in a loop to a visualizer
    let shouldDraw = true;
    const drawLoop = () => {
      if (!shouldDraw) return;
      requestAnimationFrame(drawLoop);

      const canvas = document.getElementById("canvas");
      const canvasCtx = canvas.getContext("2d");
      const e = new Event("draw-data");
      
      if (analysisKind === "frequency") {
        // Frequency Domain
        const bufferLength = analyserNode.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(data);
        e.detail = { canvas, canvasCtx, data, kind: analysisKind };
      } else {
        // Time Domain
        const bufferLength = analyserNode.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(data);
        e.detail = { canvas, canvasCtx, data, kind: analysisKind };
      }

      window.dispatchEvent(e);
    }

    // bind the dial updates from react to the audio nodes:
    window.addEventListener("update-waveform", (e) => {
      oscillator.type = e.detail;
    });
    window.addEventListener("update-frequency", (e) => {
      oscillator.frequency.value = e.detail;
    });
    window.addEventListener("update-cutoff", (e) => {
      filterNode.frequency.value = e.detail;
    });
    window.addEventListener("update-q", (e) => {
      filterNode.Q.value = e.detail;
    });
    window.addEventListener("update-filter-kind", (e) => {
      filterNode.type = e.detail;
    });
    window.addEventListener("update-gain", (e) => {
      gainNode.gain.value = e.detail;
    });

    document.getElementById('btn').onclick = () => {
      oscillator.start();
      drawLoop();
    }

    /* CLEANUP */
    oscillator.stop();
    audioCtx.close();
    shouldDraw = false;
  `;

  const selectedWaveform = useSmartState<string>("sine", {
    onUpdate: dispatchOnWindow("update-waveform")
  });

  const selectedFilterKind = useSmartState<string>("lowpass", {
    onUpdate: dispatchOnWindow("update-filter-kind")
  });

  const frequency = useSmartState<number>(440, {
    valueToInput: (val) => Math.log10(val / 2),
    inputToValue: (input) => Math.floor(2 * Math.pow(10, input)),
    onUpdate: dispatchOnWindow("update-frequency")
  });

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

  useEffect(() => {
    window.addEventListener("draw-data", (e: any) => {
      const { canvas, canvasCtx, data } = e.detail;

      if (e.detail.kind === "frequency") {
        drawFFTBins(canvas, canvasCtx, data);
      } else {
        drawWaveform(canvas, canvasCtx, data);
      }
    });
  }, []);

  return <EditorSplitView code={code} html={html} runCodeOnLoad={true}>
    <div>
      <select value={selectedWaveform.value} onChange={selectedWaveform.update}>
        <option value={"sine"}>Sine wave</option>
        <option value={"sawtooth"}>Sawtooth</option>
        <option value={"square"}>Square wave</option>
        <option value={"triangle"}>Triangle wave</option>
      </select>
    </div>

    <div>
      <input id="freq-dial" type="range" min="1" max="4" step="0.001" value={frequency.inputValue}
             onChange={frequency.update} />
      Output Frequency: {frequency.value} Hz
    </div>
    <div>
      <input id="cutoff-dial" type="range" min="0" max="4" step="0.001" value={cutoff.inputValue}
             onChange={cutoff.update} />
      Cutoff Frequency: {cutoff.value} Hz
    </div>
    <div>
      <input id="q-dial" type="range" min="0" max="20" step="0.01" value={q.inputValue}
             onChange={q.update} />
      Q value: {q.value}
    </div>
    <div>
      <select value={selectedFilterKind.value} onChange={selectedFilterKind.update}>
        <option value={"lowpass"}>Lowpass</option>
        <option value={"highpass"}>Highpass</option>
        <option value={"bandpass"}>Bandpass</option>
        <option value={"notch"}>Notch</option>
      </select>
    </div>

    <div>
      <input id="gain-dial" type="range" min="0" max="3" step="0.01" value={gain.inputValue}
             onChange={gain.update} />
      Gain: {Math.floor(gain.value * 100)}%
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

    // console.log("Sent: ", ev);
  };
}

export default AnalyzingSound;
