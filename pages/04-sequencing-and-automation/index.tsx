import { NextPage } from "next";
import EditorSplitView from "../../components/EditorSplitView";
import useSmartState from "../../utils/smartState";
import { useEffect } from "react";
import { drawFFTBins, drawWaveform } from "../../utils/visualization";

const SequencingAndAutomation: NextPage = () => {
  // language=HTML
  const html = /* html */ `
  `;

  // language=JavaScript
  const code = /* javascript */ `
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const filterNode = audioCtx.createBiquadFilter();
    const gainNode = audioCtx.createGain();
    const envelopeGenerator = audioCtx.createGain();
    envelopeGenerator.gain.value = 0;
    
    const analyserNode = audioCtx.createAnalyser(); // create an analyser node
    analyserNode.fftSize = 2 ** 12; // set the fft size to a power of 2, for visualisation

    chainNodes(oscillator, envelopeGenerator, filterNode, analyserNode, gainNode);

    // Trigger one hit on the oscillator
    document.getElementById('btn').onclick = () => {
      const time = audioCtx.currentTime;
      envelopeGenerator.gain.setValueAtTime(0, time);
      envelopeGenerator.gain.linearRampToValueAtTime(1, time + 0.01);
      envelopeGenerator.gain.linearRampToValueAtTime(0, time + 0.1);
    }

    // Start the oscillator in the background
    oscillator.start();
    const e = new Event('start-drawing');
    e.detail = analyserNode;
    window.dispatchEvent(e);

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

    function triggerEnvelope(audioParam, attack, release) {
      const time = audioCtx.currentTime;
      audioParam.cancelScheduledValues(time);
      audioParam.setValueAtTime(0, time);
      audioParam.linearRampToValueAtTime(1, time + attack);
      audioParam.exponentialRampToValueAtTime(0.0001, time + attack + release);
    }

    /* CLEANUP */
    oscillator.stop();
    audioCtx.close();
  `;

  const selectedWaveform = useSmartState<string>("sine", {
    onUpdate: dispatchOnWindow("update-waveform")
  });

  const selectedFilterKind = useSmartState<string>("lowpass", {
    onUpdate: dispatchOnWindow("update-filter-kind")
  });

  const selectedAnalysisKind = useSmartState<string>("frequency", {
    onUpdate: dispatchOnWindow("update-analysis-kind")
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
    let shouldDraw = true;

    const analysisKindSelector = document.getElementById("analysis-kind-selector") as HTMLSelectElement;
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const draw = (e: Event) => {
      const analyserNode = (e as UpdateEvent).detail;
      if (!shouldDraw) {
        return;
      } else {
        window.requestAnimationFrame(() => draw(e));
      }

      if (analysisKindSelector.value === "frequency") {
        const bufferLength = analyserNode.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        analyserNode.getByteFrequencyData(data);
        drawFFTBins(canvas, canvasCtx, data);
      } else {
        const bufferLength = analyserNode.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        analyserNode.getByteTimeDomainData(data);
        drawWaveform(canvas, canvasCtx, data);
      }
    };

    window.addEventListener("start-drawing", draw);

    return () => {
      shouldDraw = false;
      window.removeEventListener("start-drawing", draw);
    };
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
      <input id="q-dial" type="range" min="0" max="50" step="0.01" value={q.inputValue}
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

    <select id="analysis-kind-selector" value={selectedAnalysisKind.value}
            onChange={selectedAnalysisKind.update}>
      <option value="frequency">Frequency / FFT</option>
      <option value="time">Time / Waveform</option>
    </select>
    <canvas id="canvas" width="1024" height="400"></canvas>

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

export default SequencingAndAutomation;
