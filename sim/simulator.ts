/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../typings/globals/peerjs/index.d.ts" />
/// <reference path="../typings/globals/webaudioapi/index.d.ts" />
/// <reference path="sound.d.ts" />

namespace pxsim {


    let globalrecordings = [] as any;
    let globalnumRecordings = 0;

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
        public bus : EventBus;
        public canvas : HTMLCanvasElement;
        public canvasContext : CanvasRenderingContext2D;
        public audioContext : AudioContext;
        public source : any;
        public recorder : any;
        public recordings : Array<pxsim.Map<any>>;
        public numRecordings : number;
        public waveformAnalyser : AnalyserNode;
        public waveformBufferLength : number;
        public waveformDataArray : Uint8Array;
        public frequencyBarsAnalyser : AnalyserNode;
        public frequencyBarsBufferLength : number;
        public frequencyBarsDataArray : Uint8Array;
        public volumeAnalyser : AnalyserNode;
        public volumeBuggerLength : number;        
        public volumeDataArray : Uint8Array;     
        public micVolume : number;  
        public notesArray : any; 
        
        constructor() {
            super();
            this.canvas = document.getElementById("visualizer-canvas") as HTMLCanvasElement;
            this.canvasContext = this.canvas.getContext("2d");
            this.audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

            /* to do, don't lose track of recordings on sim restart...*/
            this.recordings = globalrecordings;
            this.numRecordings = globalnumRecordings;
            this.micVolume = 0;

            this.waveformAnalyser = this.audioContext.createAnalyser();     
            this.waveformAnalyser.fftSize = 2048;
            this.waveformBufferLength = this.waveformAnalyser.frequencyBinCount;
            this.waveformDataArray = new Uint8Array(this.waveformBufferLength);   

            this.frequencyBarsAnalyser = this.audioContext.createAnalyser();     
            this.frequencyBarsAnalyser.fftSize = 512;            
            this.frequencyBarsBufferLength = this.frequencyBarsAnalyser.frequencyBinCount;
            this.frequencyBarsDataArray = new Uint8Array(this.frequencyBarsBufferLength);

            this.volumeAnalyser = this.audioContext.createAnalyser();
            this.volumeAnalyser.fftSize = 512;
            this.volumeBuggerLength = this.volumeAnalyser.frequencyBinCount;
            this.volumeDataArray =  new Uint8Array(this.volumeBuggerLength);    
            
            this.notesArray = notes.notesArray;

            this.initAudioStream();
            this.bus = new EventBus(runtime); 
        }
        
        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
            /*this.waveformAnalyser.disconnect();  
            this.frequencyBarsAnalyser.disconnect();  
            this.volumeAnalyser.disconnect();  */
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
                    if (!self.source){
                        self.recorder = new MediaRecorder(stream) as any;
                        self.recorder.onstop = function(e: any) {console.log("done recording");}
                        self.recorder.ondataavailable = function(e: any) {
                            self.newRecordingFinished(e.data);
                        }
                        let startButton = parent.document.getElementById("startButton");
                        let stopButton = parent.document.getElementById("stopButton");
                        let pauseButton = parent.document.getElementById("pauseButton");
                        startButton.onclick = function(){ self.startRecording() };
                        stopButton.onclick = function(){ self.stopRecording() };
                        pauseButton.onclick = function(){ self.pauseRecording() };
                        self.source = self.audioContext.createMediaStreamSource(stream);
                        self.source.connect(self.waveformAnalyser);
                        self.source.connect(self.frequencyBarsAnalyser);
                        self.source.connect(self.volumeAnalyser);
                    }
                }, function (e: any) {
                    console.log('Error capturing audio.');
                });
            } else {
                console.log('getUserMedia not supported in this browser.');
            }
            this.source = self.source;
            requestAnimationFrame(this.drawAudioStream.bind(this));       
        }

        getVolume(array: Uint8Array) : number {
            if (array){
                let total = 0;
                for (let i = 0; i < array.length; i++){
                    total += array[i];
                }                
                let average = total / array.length;
                return average;
            }
            return -1;
        }

        drawAudioStream() {
            this.waveformAnalyser.getByteTimeDomainData(this.waveformDataArray);
            this.frequencyBarsAnalyser.getByteFrequencyData(this.frequencyBarsDataArray);
            this.volumeAnalyser.getByteFrequencyData(this.volumeDataArray);
            this.micVolume = this.getVolume(this.volumeDataArray);

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
        
        newRecordingFinished(data: any){
            // use the blob from the MediaRecorder as source for the audio tag
            // create audio element
            let scrolldiv = parent.document.getElementById("scrolldiv");
            let recordingtitle = "untitled" + this.numRecordings.toString();
            let recordingtitleinput = parent.document.createElement("input");
            recordingtitleinput.classList.add('recordingtitle');
            recordingtitleinput.value = recordingtitle;
            recordingtitleinput.id = "titleelement-" + this.numRecordings.toString();
            recordingtitleinput.onchange = function(){
                let idNum = recordingtitleinput.id.split("-")[1];
                globalrecordings[parseInt(idNum)]["name"] = recordingtitleinput.value;
                board().recordings = globalrecordings;
            };
            let audioelement = parent.document.createElement("audio");
            audioelement.id = "audioelement-" + this.numRecordings.toString();
            audioelement.controls = true;
            (audioelement as any).src = URL.createObjectURL(data);
            (audioelement as any).play();

            globalrecordings.push({"name": recordingtitle, "audioelement": audioelement});
            this.recordings = globalrecordings;
            //this.recordings.push({"name": recordingtitle, "audioelement": audioelement});
            //this.recordings[recordingtitle] = audioelement; // old
            let hrtag = parent.document.createElement("HR");
            scrolldiv.appendChild(recordingtitleinput);
            scrolldiv.appendChild(audioelement);
            scrolldiv.appendChild(hrtag);
            globalnumRecordings += 1;
            this.numRecordings = globalnumRecordings;
        }

        startRecording(){
            if (this.recorder.state == "paused")
                this.recorder.resume();
            else if (this.recorder.state == "inactive") // inactive, recording, or paused
                this.recorder.start();
                parent.document.getElementById("startButton").style.border = "thick solid #FFFF00";
                parent.document.getElementById("pauseButton").style.border = "";

        }

        pauseRecording(){
            if (this.recorder.state == "recording")
                this.recorder.pause();
                parent.document.getElementById("pauseButton").style.border = "thick solid #FFFF00";
                parent.document.getElementById("startButton").style.border = "";
        }

        resumeRecording(){
            if (this.recorder.state == "paused")
                this.recorder.resume();
        }

        stopRecording(){
            if (this.recorder.state != "inactive")
                this.recorder.stop();
                parent.document.getElementById("startButton").style.border = "";
        }

        countExistingRecordings(){
            let audioelements = parent.document.getElementsByTagName("audio");
            let titleelements = parent.document.getElementsByClassName("recordingtitle");
            if (audioelements.length > 0){
                for (var i = 0; i < audioelements.length; i++){
                    this.recordings.push({"name": titleelements[i].nodeValue, "audioelement": audioelements[i]});
                    this.numRecordings += 1;
                }
            }
            console.log(audioelements.length.toString());
        }

    }

}