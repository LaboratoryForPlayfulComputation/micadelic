/// <reference path="../sim/sound.d.ts" />
/// <reference path="../libs/core/enums.d.ts" />
/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts" />
/// <reference path="../typings/globals/peerjs/index.d.ts" />
/// <reference path="../typings/globals/webaudioapi/index.d.ts" />
declare namespace pxsim.analysis {
    function findFundamentalFreq(buffer: Uint8Array, sampleRate: number): number;
    function detectPitch(): string;
    function findCentsOffPitch(freq: number, refFreq: any): number;
    function findClosestNote(freq: number): any;
}
declare namespace pxsim.loops {
    /**
     * Repeats the code forever in the background. On each iteration, allows other code to run.
     * @param body the code to repeat
     */
    function forever(body: RefAction): void;
    /**
     * Pause for the specified time in milliseconds
     * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
     */
    function pauseAsync(ms: number): Promise<void>;
}
declare function logMsg(m: string): void;
declare namespace pxsim.console {
    /**
     * Print out message
     */
    function log(msg: string): void;
}
declare namespace pxsim.messaging {
    /**
     * Peer
     * @param id The value of the marker
     */
    function send(key: string, value: number, id: string): void;
    /**
     * Allows user to define callbacks for receive event
     * @param key
     */
    function receive(key: string, handler: RefAction): void;
}
declare namespace pxsim.notes {
    let notesArray: {
        "note": string;
        "frequency": number;
    }[];
}
declare namespace pxsim {
    /**
     * Gets the current 'board', eg. program state.
     */
    function board(): Board;
    /**
     * Represents the entire state of the executing program.
     * Do not store state anywhere else!
     */
    class Board extends pxsim.BaseBoard {
        bus: EventBus;
        canvas: HTMLCanvasElement;
        canvasContext: CanvasRenderingContext2D;
        audioContext: AudioContext;
        source: any;
        waveformAnalyser: AnalyserNode;
        waveformBufferLength: number;
        waveformDataArray: Uint8Array;
        frequencyBarsAnalyser: AnalyserNode;
        frequencyBarsBufferLength: number;
        frequencyBarsDataArray: Uint8Array;
        volumeAnalyser: AnalyserNode;
        volumeBuggerLength: number;
        volumeDataArray: Uint8Array;
        micVolume: number;
        notesArray: any;
        constructor();
        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void>;
        initAudioStream(): void;
        getVolume(array: Uint8Array): number;
        drawAudioStream(): void;
    }
}
declare namespace pxsim.sound {
    /**
     * Mic Volume
     */
    function getVolume(): number;
    /**
     * Pitch
     */
    function getPitch(): string;
}
