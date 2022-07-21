import { useEffect } from 'react';
import { drawFFTBins, drawWaveform } from '../utils/visualization';

export class UpdateEvent extends Event {
  public detail: any;

  constructor(type: string, public value: any) {
    super(type);
    this.detail = value;
  }
}

export function dispatchOnWindow(functionName: string) {
  return (value: unknown) => {
    const ev = new UpdateEvent(functionName, value);
    (window as any).dispatchEvent(ev);
  };
}

export const useAnalysis = ({
                           startDrawEventName = "start-drawing",
                           analysisKindSelectorId = "analysis-kind-selector",
                           canvasId = "canvas"} : {
  analysisKindSelectorId?: string,
  canvasId?: string,
  startDrawEventName?: string;
} = {}) => {
  return useEffect(() => {
    let shouldDraw = true;

    const analysisKindSelector = document.getElementById(analysisKindSelectorId) as HTMLSelectElement;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const canvasCtx = canvas.getContext("2d") as CanvasRenderingContext2D;

    debugger;

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

    window.addEventListener(startDrawEventName, draw);

    return () => {
      shouldDraw = false;
      window.removeEventListener(startDrawEventName, draw);
    };
  }, []);
}