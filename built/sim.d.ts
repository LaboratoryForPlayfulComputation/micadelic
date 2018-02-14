/// <reference path="../libs/core/enums.d.ts" />
/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts" />
/// <reference path="../typings/globals/peerjs/index.d.ts" />
/// <reference path="../typings/globals/webaudioapi/index.d.ts" />
/// <reference path="../sim/sound.d.ts" />
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
        waveformAnalyser: AnalyserNode;
        frequencyBarsAnalyser: AnalyserNode;
        source: any;
        waveformBufferLength: number;
        waveformDataArray: Uint8Array;
        frequencyBarsBufferLength: number;
        frequencyBarsDataArray: Uint8Array;
        constructor();
        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void>;
        initAudioStream(): void;
        drawAudioStream(): void;
    }
}
declare namespace pxsim.sound {
}
