var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="sound.d.ts" />
var pxsim;
(function (pxsim) {
    var analysis;
    (function (analysis) {
        function findFundamentalFreq(buffer, sampleRate) {
            // We use Autocorrelation to find the fundamental frequency.
            // In order to correlate the signal with itself (hence the name of the algorithm), we will check two points 'k' frames away. 
            // The autocorrelation index will be the average of these products. At the same time, we normalize the values.
            // Source: http://www.phy.mty.edu/~suits/autocorrelation.html
            // Assuming the sample rate is 48000Hz, a 'k' equal to 1000 would correspond to a 48Hz signal (48000/1000 = 48), 
            // while a 'k' equal to 8 would correspond to a 6000Hz one, which is enough to cover most (if not all) 
            // the notes we have in the notes.json file.
            var n = 1024, bestR = 0, bestK = -1;
            for (var k = 8; k <= 1000; k++) {
                var sum = 0;
                for (var i = 0; i < n; i++) {
                    sum += ((buffer[i] - 128) / 128) * ((buffer[i + k] - 128) / 128);
                }
                var r = sum / (n + k);
                if (r > bestR) {
                    bestR = r;
                    bestK = k;
                }
                if (r > 0.9) {
                    // Let's assume that this is good enough and stop right here
                    break;
                }
            }
            if (bestR > 0.0025) {
                // The period (in frames) of the fundamental frequency is 'bestK'. Getting the frequency from there is trivial.
                var fundamentalFreq = sampleRate / bestK;
                return fundamentalFreq;
            }
            else {
                // We haven't found a good correlation
                return -1;
            }
        }
        analysis.findFundamentalFreq = findFundamentalFreq;
        function detectPitch() {
            var buffer = new Uint8Array(pxsim.board().waveformAnalyser.fftSize);
            // See initializations in the AudioContent and AnalyserNode sections of the demo.
            pxsim.board().waveformAnalyser.getByteTimeDomainData(buffer);
            var fundalmentalFreq = findFundamentalFreq(buffer, pxsim.board().audioContext.sampleRate);
            if (fundalmentalFreq !== -1) {
                var note = findClosestNote(fundalmentalFreq); // See the 'Finding the right note' section.
                //let cents = findCentsOffPitch(fundalmentalFreq, note.frequency); // See the 'Calculating the cents off pitch' section.
                return note["note"];
            }
            else {
                return "--";
            }
        }
        analysis.detectPitch = detectPitch;
        function findCentsOffPitch(freq, refFreq) {
            // We need to find how far freq is from baseFreq in cents
            var log2 = 0.6931471805599453; // Math.log(2)
            var multiplicativeFactor = freq / refFreq;
            // We use Math.floor to get the integer part and ignore decimals
            var cents = Math.floor(1200 * (Math.log(multiplicativeFactor) / log2));
            return cents;
        }
        analysis.findCentsOffPitch = findCentsOffPitch;
        // 'notes' is an array of objects like { note: 'A4', frequency: 440 }.
        // See initialization in the source code of the demo
        function findClosestNote(freq) {
            // Use binary search to find the closest note
            var notes = pxsim.board().notesArray;
            var low = -1, high = notes.length;
            while (high - low > 1) {
                var pivot = Math.round((low + high) / 2);
                if (notes[pivot]["frequency"] <= freq) {
                    low = pivot;
                }
                else {
                    high = pivot;
                }
            }
            if (Math.abs(notes[high]["frequency"] - freq) <= Math.abs(notes[low]["frequency"] - freq)) {
                return notes[high]; // notes[high] is closer to the frequency we found
            }
            return notes[low];
        }
        analysis.findClosestNote = findClosestNote;
    })(analysis = pxsim.analysis || (pxsim.analysis = {}));
})(pxsim || (pxsim = {}));
/// <reference path="../libs/core/enums.d.ts"/>
var pxsim;
(function (pxsim) {
    var loops;
    (function (loops) {
        /**
         * Repeats the code forever in the background. On each iteration, allows other code to run.
         * @param body the code to repeat
         */
        //% help=functions/forever weight=55 blockGap=8
        //% blockId=device_forever block="forever" 
        function forever(body) {
            pxsim.thread.forever(body);
        }
        loops.forever = forever;
        /**
         * Pause for the specified time in milliseconds
         * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
         */
        //% help=functions/pause weight=54
        //% block="pause (ms) %pause" blockId=device_pause
        function pauseAsync(ms) {
            return Promise.delay(ms);
        }
        loops.pauseAsync = pauseAsync;
    })(loops = pxsim.loops || (pxsim.loops = {}));
})(pxsim || (pxsim = {}));
function logMsg(m) { console.log(m); }
var pxsim;
(function (pxsim) {
    var console;
    (function (console) {
        /**
         * Print out message
         */
        //% 
        function log(msg) {
            logMsg("CONSOLE: " + msg);
            // why doesn't that work?
            pxsim.board().writeSerial(msg + "\n");
        }
        console.log = log;
    })(console = pxsim.console || (pxsim.console = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var messaging;
    (function (messaging) {
        var peer = null;
        var connections = {};
        var script = document.createElement('script');
        script.onload = function () {
            initializePeer();
        };
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/peerjs/0.3.14/peer.js";
        document.head.appendChild(script);
        function updateUserId(id) {
            var userId = parent.document.getElementById("userid");
            userId.value = id.toString();
        }
        function initDataConnectionCallbacks(conn) {
            connections[conn.peer] = conn;
            conn.on('data', function (data) {
                pxsim.board().bus.queue(data["key"], 0x1);
            });
            conn.on('close', function () { connections[conn.peer] = undefined; });
            conn.on('error', function () { connections[conn.peer] = undefined; });
        }
        function initializePeer() {
            /* Create instance of PeerJS */
            peer = new Peer({
                host: 'liminal-jam.herokuapp.com',
                secure: true,
                port: 443,
                key: 'peerjs',
                debug: 3 });
            /* Received user ID from server */
            if (peer)
                peer.on('open', function (id) {
                    if (id)
                        updateUserId(id);
                    else if (peer.id)
                        updateUserId(peer.id);
                });
            else
                initializePeer();
            if (peer)
                peer.on('close', function () { });
            else
                initializePeer();
            if (peer)
                peer.on('disconnected', function () {
                    pxsim.console.log("peer disconnecteeeeeed from server");
                    peer.reconnect();
                });
            else
                initializePeer();
            if (peer)
                peer.on('error', function (err) { });
            else
                initializePeer();
            /* Successfully created data connection */
            if (peer)
                peer.on('connection', function (conn) { initDataConnectionCallbacks(conn); });
            else
                initializePeer();
        }
        /**
         * Peer
         * @param id The value of the marker
         */
        //% blockId=peer_block block="send key %key| value %value| to %id"
        //% blockNamespace=messaging inBasicCategory=true
        //% weight=100
        function send(key, value, id) {
            if (peer) {
                var conn_1 = connections[id];
                if (!conn_1 || !conn_1.open) {
                    conn_1 = peer.connect(id);
                    conn_1.on('open', function () {
                        initDataConnectionCallbacks(conn_1);
                        conn_1.send({ "key": key, "value": value });
                    });
                }
                conn_1.send({ "key": key, "value": value });
            }
            else {
                initializePeer();
                send(key, value, id);
            }
        }
        messaging.send = send;
        /**
         * Allows user to define callbacks for receive event
         * @param key
         */
        //% blockId=peer_receive block="when I receive key %key|do" blockGap=8
        //% blockNamespace=messaging inBasicCategory=true
        //% weight=99    
        function receive(key, handler) {
            pxsim.board().bus.listen(key, 0x1, handler);
        }
        messaging.receive = receive;
    })(messaging = pxsim.messaging || (pxsim.messaging = {}));
})(pxsim || (pxsim = {}));
var pxsim;
(function (pxsim) {
    var notes;
    (function (notes) {
        notes.notesArray = [
            {
                "note": "C0",
                "frequency": 16.05
            },
            {
                "note": "C#0",
                "frequency": 17.01
            },
            {
                "note": "D0",
                "frequency": 18.02
            },
            {
                "note": "D#0",
                "frequency": 19.09
            },
            {
                "note": "E0",
                "frequency": 20.23
            },
            {
                "note": "F0",
                "frequency": 21.43
            },
            {
                "note": "F#0",
                "frequency": 22.7
            },
            {
                "note": "G0",
                "frequency": 24.05
            },
            {
                "note": "G#0",
                "frequency": 25.48
            },
            {
                "note": "A0",
                "frequency": 27
            },
            {
                "note": "A#0",
                "frequency": 28.61
            },
            {
                "note": "B0",
                "frequency": 30.31
            },
            {
                "note": "C1",
                "frequency": 32.11
            },
            {
                "note": "C#1",
                "frequency": 34.02
            },
            {
                "note": "D1",
                "frequency": 36.04
            },
            {
                "note": "D#1",
                "frequency": 38.18
            },
            {
                "note": "E1",
                "frequency": 40.45
            },
            {
                "note": "F1",
                "frequency": 42.86
            },
            {
                "note": "F#1",
                "frequency": 45.41
            },
            {
                "note": "G1",
                "frequency": 48.11
            },
            {
                "note": "G#1",
                "frequency": 50.97
            },
            {
                "note": "A1",
                "frequency": 54
            },
            {
                "note": "A#1",
                "frequency": 57.21
            },
            {
                "note": "B1",
                "frequency": 60.61
            },
            {
                "note": "C2",
                "frequency": 64.22
            },
            {
                "note": "C#2",
                "frequency": 68.04
            },
            {
                "note": "D2",
                "frequency": 72.08
            },
            {
                "note": "D#2",
                "frequency": 76.37
            },
            {
                "note": "E2",
                "frequency": 80.91
            },
            {
                "note": "F2",
                "frequency": 85.72
            },
            {
                "note": "F#2",
                "frequency": 90.82
            },
            {
                "note": "G2",
                "frequency": 96.22
            },
            {
                "note": "G#2",
                "frequency": 101.94
            },
            {
                "note": "A2",
                "frequency": 108
            },
            {
                "note": "A#2",
                "frequency": 114.42
            },
            {
                "note": "B2",
                "frequency": 121.23
            },
            {
                "note": "C3",
                "frequency": 128.43
            },
            {
                "note": "C#3",
                "frequency": 136.07
            },
            {
                "note": "D3",
                "frequency": 144.16
            },
            {
                "note": "D#3",
                "frequency": 152.74
            },
            {
                "note": "E3",
                "frequency": 161.82
            },
            {
                "note": "F3",
                "frequency": 171.44
            },
            {
                "note": "F#3",
                "frequency": 181.63
            },
            {
                "note": "G3",
                "frequency": 192.43
            },
            {
                "note": "G#3",
                "frequency": 203.88
            },
            {
                "note": "A3",
                "frequency": 216
            },
            {
                "note": "A#3",
                "frequency": 228.84
            },
            {
                "note": "B3",
                "frequency": 242.45
            },
            {
                "note": "C4",
                "frequency": 256.87
            },
            {
                "note": "C#4",
                "frequency": 272.14
            },
            {
                "note": "D4",
                "frequency": 288.33
            },
            {
                "note": "D#4",
                "frequency": 305.47
            },
            {
                "note": "E4",
                "frequency": 323.63
            },
            {
                "note": "F4",
                "frequency": 342.88
            },
            {
                "note": "F#4",
                "frequency": 363.27
            },
            {
                "note": "G4",
                "frequency": 384.87
            },
            {
                "note": "G#4",
                "frequency": 407.75
            },
            {
                "note": "A4",
                "frequency": 432
            },
            {
                "note": "A#4",
                "frequency": 457.69
            },
            {
                "note": "B4",
                "frequency": 484.9
            },
            {
                "note": "C5",
                "frequency": 513.74
            },
            {
                "note": "C#5",
                "frequency": 544.29
            },
            {
                "note": "D5",
                "frequency": 576.65
            },
            {
                "note": "D#5",
                "frequency": 610.94
            },
            {
                "note": "E5",
                "frequency": 647.27
            },
            {
                "note": "F5",
                "frequency": 685.76
            },
            {
                "note": "F#5",
                "frequency": 726.53
            },
            {
                "note": "G5",
                "frequency": 769.74
            },
            {
                "note": "G#5",
                "frequency": 815.51
            },
            {
                "note": "A5",
                "frequency": 864
            },
            {
                "note": "A#5",
                "frequency": 915.38
            },
            {
                "note": "B5",
                "frequency": 969.81
            },
            {
                "note": "C6",
                "frequency": 1027.47
            },
            {
                "note": "C#6",
                "frequency": 1088.57
            },
            {
                "note": "D6",
                "frequency": 1153.3
            },
            {
                "note": "D#6",
                "frequency": 1221.88
            },
            {
                "note": "E6",
                "frequency": 1294.54
            },
            {
                "note": "F6",
                "frequency": 1371.51
            },
            {
                "note": "F#6",
                "frequency": 1453.07
            },
            {
                "note": "G6",
                "frequency": 1539.47
            },
            {
                "note": "G#6",
                "frequency": 1631.01
            },
            {
                "note": "A6",
                "frequency": 1728
            },
            {
                "note": "A#6",
                "frequency": 1830.75
            },
            {
                "note": "B6",
                "frequency": 1939.61
            },
            {
                "note": "C7",
                "frequency": 2054.95
            },
            {
                "note": "C#7",
                "frequency": 2177.14
            },
            {
                "note": "D7",
                "frequency": 2306.6
            },
            {
                "note": "D#7",
                "frequency": 2443.76
            },
            {
                "note": "E7",
                "frequency": 2589.07
            },
            {
                "note": "F7",
                "frequency": 2743.03
            },
            {
                "note": "F#7",
                "frequency": 2906.14
            },
            {
                "note": "G7",
                "frequency": 3078.95
            },
            {
                "note": "G#7",
                "frequency": 3262.03
            },
            {
                "note": "A7",
                "frequency": 3456
            },
            {
                "note": "A#7",
                "frequency": 3661.5
            },
            {
                "note": "B7",
                "frequency": 3879.23
            },
            {
                "note": "C8",
                "frequency": 4109.9
            },
            {
                "note": "C#8",
                "frequency": 4354.29
            },
            {
                "note": "D8",
                "frequency": 4613.21
            },
            {
                "note": "D#8",
                "frequency": 4887.52
            },
            {
                "note": "E8",
                "frequency": 5178.15
            },
            {
                "note": "F8",
                "frequency": 5486.06
            },
            {
                "note": "F#8",
                "frequency": 5812.28
            },
            {
                "note": "G8",
                "frequency": 6157.89
            },
            {
                "note": "G#8",
                "frequency": 6524.06
            },
            {
                "note": "A8",
                "frequency": 6912
            },
            {
                "note": "A#8",
                "frequency": 7323.01
            },
            {
                "note": "B8",
                "frequency": 7758.46
            }
        ];
    })(notes = pxsim.notes || (pxsim.notes = {}));
})(pxsim || (pxsim = {}));
/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../typings/globals/peerjs/index.d.ts" />
/// <reference path="../typings/globals/webaudioapi/index.d.ts" />
/// <reference path="sound.d.ts" />
var pxsim;
(function (pxsim) {
    /**
     * This function gets called each time the program restarts
     */
    pxsim.initCurrentRuntime = function () {
        pxsim.runtime.board = new Board();
    };
    /**
     * Gets the current 'board', eg. program state.
     */
    function board() {
        return pxsim.runtime.board;
    }
    pxsim.board = board;
    /**
     * Represents the entire state of the executing program.
     * Do not store state anywhere else!
     */
    var Board = (function (_super) {
        __extends(Board, _super);
        function Board() {
            _super.call(this);
            this.canvas = document.getElementById("visualizer-canvas");
            this.canvasContext = this.canvas.getContext("2d");
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
            this.volumeDataArray = new Uint8Array(this.volumeBuggerLength);
            this.notesArray = pxsim.notes.notesArray;
            this.initAudioStream();
            this.bus = new pxsim.EventBus(pxsim.runtime);
        }
        Board.prototype.initAsync = function (msg) {
            /*this.waveformAnalyser.disconnect();
            this.frequencyBarsAnalyser.disconnect();
            this.volumeAnalyser.disconnect();  */
            return Promise.resolve();
        };
        Board.prototype.initAudioStream = function () {
            if (!navigator.getUserMedia) {
                navigator.getUserMedia = navigator.getUserMedia
                    || navigator.webkitGetUserMedia
                    || navigator.mozGetUserMedia
                    || navigator.msGetUserMedia;
            }
            var self = this;
            if (navigator.getUserMedia) {
                navigator.getUserMedia({ audio: true }, function (stream) {
                    if (!self.source) {
                        self.recorder = new MediaRecorder(stream);
                        self.recorder.onstop = function (e) { pxsim.console.log("done recording"); };
                        self.recorder.ondataavailable = function (e) {
                            pxsim.console.log(e.data);
                            var audio = document.getElementById('audio');
                            // use the blob from the MediaRecorder as source for the audio tag
                            audio.src = URL.createObjectURL(e.data);
                            audio.play();
                        };
                        var startButton = parent.document.getElementById("startButton");
                        var stopButton = parent.document.getElementById("stopButton");
                        startButton.onclick = function () { self.startRecording(); };
                        stopButton.onclick = function () { self.stopRecording(); };
                        self.source = self.audioContext.createMediaStreamSource(stream);
                        self.source.connect(self.waveformAnalyser);
                        self.source.connect(self.frequencyBarsAnalyser);
                        self.source.connect(self.volumeAnalyser);
                    }
                }, function (e) {
                    pxsim.console.log('Error capturing audio.');
                });
            }
            else {
                pxsim.console.log('getUserMedia not supported in this browser.');
            }
            this.source = self.source;
            requestAnimationFrame(this.drawAudioStream.bind(this));
        };
        Board.prototype.getVolume = function (array) {
            if (array) {
                var total = 0;
                for (var i = 0; i < array.length; i++) {
                    total += array[i];
                }
                var average = total / array.length;
                return average;
            }
            return -1;
        };
        Board.prototype.drawAudioStream = function () {
            this.waveformAnalyser.getByteTimeDomainData(this.waveformDataArray);
            this.frequencyBarsAnalyser.getByteFrequencyData(this.frequencyBarsDataArray);
            this.volumeAnalyser.getByteFrequencyData(this.volumeDataArray);
            this.micVolume = this.getVolume(this.volumeDataArray);
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvasContext.lineWidth = 2;
            this.canvasContext.strokeStyle = 'rgb(0, 0, 0)';
            this.canvasContext.beginPath();
            var waveformSliceWidth = this.canvas.width * 1.0 / this.waveformBufferLength;
            var frequencySliceWidth = this.canvas.width * 1.0 / this.frequencyBarsBufferLength;
            var xw = 0;
            for (var i = 0; i < this.waveformBufferLength; i++) {
                var vw = this.waveformDataArray[i] / 128.0;
                var yw = vw * this.canvas.height / 2;
                if (i === 0) {
                    this.canvasContext.moveTo(xw, yw);
                }
                else {
                    this.canvasContext.lineTo(xw, yw);
                }
                xw += waveformSliceWidth;
            }
            var xf = 0;
            var barWidth = (this.canvas.width / this.frequencyBarsBufferLength) * 2.5;
            var barHeight = 0;
            for (var i = 0; i < this.frequencyBarsBufferLength; i++) {
                barHeight = this.frequencyBarsDataArray[i] / 2;
                var barColor = barHeight + 100;
                if (barColor > 255)
                    barColor = 255;
                this.canvasContext.fillStyle = 'rgb(30,30,' + (barColor) + ')';
                this.canvasContext.fillRect(xf, this.canvas.height - barHeight / 2, barWidth, barHeight);
                xf += barWidth + 1;
            }
            this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
            this.canvasContext.stroke();
            requestAnimationFrame(this.drawAudioStream.bind(this));
        };
        Board.prototype.startRecording = function () {
            if (this.recorder.state == "inactive")
                this.recorder.start();
        };
        Board.prototype.pauseRecording = function () {
            if (this.recorder.state == "recording")
                this.recorder.pause();
        };
        Board.prototype.resumeRecording = function () {
            if (this.recorder.state == "paused")
                this.recorder.resume();
        };
        Board.prototype.stopRecording = function () {
            if (this.recorder.state != "inactive")
                this.recorder.stop();
        };
        return Board;
    }(pxsim.BaseBoard));
    pxsim.Board = Board;
})(pxsim || (pxsim = {}));
/// <reference path="sound.d.ts" />
var pxsim;
(function (pxsim) {
    var sound;
    (function (sound) {
        /**
         * Mic Volume
         */
        //% blockId=get_volume block="get mic volume"
        //% blockNamespace=sound inBasicCategory=true
        //% weight=100
        function getVolume() {
            return pxsim.board().micVolume;
        }
        sound.getVolume = getVolume;
        /**
         * Pitch
         */
        //% blockId=get_pitch block="get pitch"
        //% blockNamespace=sound inBasicCategory=true
        //% weight=99    
        function getPitch() {
            return pxsim.analysis.detectPitch();
        }
        sound.getPitch = getPitch;
        /**
     * Record sample
     */
        //% blockId=record_sample block="record sample| %name| %sample"
        //% blockNamespace=sound inBasicCategory=true
        //% sample.fieldEditor="recorder"
        //% sample.fieldOptions.onParentBlock=true
        //% sample.fieldOptions.decompileLiterals=true    
        //% weight=98 
        function recordSample(name, sample) {
        }
        sound.recordSample = recordSample;
        /**
         * Play recorded sample
         */
        //% blockId=play_recorded_sample block="play sample| %name"
        //% blockNamespace=sound inBasicCategory=true
        //% weight=97
        function playRecordedSample(name) {
        }
        sound.playRecordedSample = playRecordedSample;
        /**
         * Loop recorded sample
         */
        //% blockId=loop_recorded_sample block="loop sample| %name"
        //% blockNamespace=sound inBasicCategory=true
        //% weight=96
        function loopRecordedSample(name) {
        }
        sound.loopRecordedSample = loopRecordedSample;
    })(sound = pxsim.sound || (pxsim.sound = {}));
})(pxsim || (pxsim = {}));
