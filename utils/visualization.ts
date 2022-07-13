export function drawWaveform(canvas: HTMLCanvasElement, canvasCtx: CanvasRenderingContext2D, dataArray: Uint8Array) {
    const width = canvas.width;
    const height = canvas.height;

    const bufferLength = dataArray.length;

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();

    const sliceWidth = width * 1.0 / bufferLength;
    let x = 0;
    for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height/2;
        if(i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
    }
    canvasCtx.lineTo(width, height/2);
    canvasCtx.stroke();
}

export function drawFFTBins(canvas: HTMLCanvasElement, canvasCtx: CanvasRenderingContext2D, dataArray: Uint8Array) {
    const width = canvas.width;
    const height = canvas.height;


    const bufferLength = dataArray.length;

    canvasCtx.fillStyle = 'rgb(20, 20, 20)';
    canvasCtx.fillRect(0, 0, width, height);
    canvasCtx.fillStyle = 'rgb(200, 140, 140)';

    const sliceWidth = width * 1.0 / bufferLength;
    let x = 0;
    for(let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0 * 1000;
        const y = Math.log10(v) / Math.log10(100) * height;

        canvasCtx.fillRect(x, height, sliceWidth + 1, height - y);
        x += sliceWidth;
    }
}