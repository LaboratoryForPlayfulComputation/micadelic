/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../typings/globals/peerjs/index.d.ts" />
/// <reference path="sound.d.ts" />

namespace pxsim {

    /**
     * This function gets called each time the program restarts
     */
    initCurrentRuntime = () => {
        runtime.board = new Board();
    };

    /**
     * Gets the current 'board', eg. program state.
     */
    export function board() : Board {
        return runtime.board as Board;
    }

    /**
     * Represents the entire state of the executing program.
     * Do not store state anywhere else!
     */
    export class Board extends pxsim.BaseBoard {
        public bus: EventBus;
        public canvas : HTMLCanvasElement;
        public canvasContext : CanvasRenderingContext2D;
        public audioContext : AudioContext;
        public waveformAnalyser : AnalyserNode;
        public frequencyBarsAnalyser : AnalyserNode;
        public source : any;
        public waveformBufferLength : number;
        public waveformDataArray : Uint8Array;
        public frequencyBarsBufferLength : number;
        public frequencyBarsDataArray : Uint8Array;
        
        constructor() {
            super();
            this.canvas = document.getElementById("visualizer-canvas") as HTMLCanvasElement;
            this.canvasContext = this.canvas.getContext("2d");
            this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
            this.waveformAnalyser = this.audioContext.createAnalyser();     
            this.waveformAnalyser.fftSize = 2048;
            this.frequencyBarsAnalyser = this.audioContext.createAnalyser();     
            this.frequencyBarsAnalyser.fftSize = 256;            
            this.waveformBufferLength = this.waveformAnalyser.frequencyBinCount;
            this.waveformDataArray = new Uint8Array(this.waveformBufferLength);  
            this.frequencyBarsBufferLength = this.frequencyBarsAnalyser.frequencyBinCount;
            this.frequencyBarsDataArray = new Uint8Array(this.frequencyBarsBufferLength);       
            this.initAudioStream();
            this.bus = new EventBus(runtime); 
            
        }
        
        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
            // reset sound stuff eventually       
            return Promise.resolve();
        }

        initAudioStream() {
            if (!(navigator as any).getUserMedia) {
                (navigator as any).getUserMedia = (navigator as any).getUserMedia 
                                       || (navigator as any).webkitGetUserMedia 
                                       || (navigator as any).mozGetUserMedia 
                                       || (navigator as any).msGetUserMedia;    
            }
            
            let self = this;
            if ((navigator as any).getUserMedia) {
                (navigator as any).getUserMedia({audio: true}, function (stream: MediaStream) {
                    self.source = self.audioContext.createMediaStreamSource(stream);
                    self.source.connect(self.waveformAnalyser);
                    self.source.connect(self.frequencyBarsAnalyser);
                }, function (e: any) {
                    console.log('Error capturing audio.');
                });
            } else {
                console.log('getUserMedia not supported in this browser.');
            }
            this.source = self.source;   
            requestAnimationFrame(this.drawAudioStream.bind(this));       
        }

        drawAudioStream() {
            this.waveformAnalyser.getByteTimeDomainData(this.waveformDataArray);
            this.frequencyBarsAnalyser.getByteFrequencyData(this.frequencyBarsDataArray);

            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvasContext.lineWidth = 2;
            this.canvasContext.strokeStyle = 'rgb(0, 0, 0)';
            this.canvasContext.beginPath();

            let waveformSliceWidth = this.canvas.width * 1.0 / this.waveformBufferLength;
            let frequencySliceWidth = this.canvas.width * 1.0 / this.frequencyBarsBufferLength;
            let xw = 0;
            for (let i = 0; i < this.waveformBufferLength; i++){
                var vw = this.waveformDataArray[i] / 128.0;
                var yw = vw * this.canvas.height/2;
        
                if(i === 0) {
                  this.canvasContext.moveTo(xw, yw);
                } else {
                  this.canvasContext.lineTo(xw, yw);
                }
        
                xw += waveformSliceWidth;
            }

            let xf = 0;
            let barWidth = (this.canvas.width / this.frequencyBarsBufferLength) * 2.5;
            let barHeight = 0;            
            for (let i = 0; i < this.frequencyBarsBufferLength; i++){
                barHeight = this.frequencyBarsDataArray[i]/2;
                let barColor = barHeight + 100;
                if (barColor > 255)
                    barColor = 255;
                this.canvasContext.fillStyle = 'rgb(30,30,' + (barColor) + ')';
                this.canvasContext.fillRect(xf, this.canvas.height-barHeight/2, barWidth, barHeight);
                xf += barWidth + 1;
            }

            this.canvasContext.lineTo(this.canvas.width, this.canvas.height/2);
            this.canvasContext.stroke();
            requestAnimationFrame(this.drawAudioStream.bind(this));
        }        
        
    }
}