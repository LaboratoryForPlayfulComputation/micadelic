// Auto-generated from simulator. Do not edit.
declare namespace loops {
    /**
     * Repeats the code forever in the background. On each iteration, allows other code to run.
     * @param body the code to repeat
     */
    //% help=functions/forever weight=55 blockGap=8
    //% blockId=device_forever block="forever"
    //% shim=loops::forever
    function forever(body: () => void): void;

    /**
     * Pause for the specified time in milliseconds
     * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
     */
    //% help=functions/pause weight=54
    //% block="pause (ms) %pause" blockId=device_pause
    //% shim=loops::pauseAsync promise
    function pause(ms: number): void;

}
declare namespace console {
    /**
     * Print out message
     */
    //%
    //% shim=console::log
    function log(msg: string): void;

}
declare namespace messaging {
    /**
     * Peer
     * @param id The value of the marker
     */
    //% blockId=peer_block block="send key %key| value %value| to %id"
    //% blockNamespace=messaging inBasicCategory=true
    //% weight=100
    //% shim=messaging::send
    function send(key: string, value: number, id: string): void;

    /**
     * Allows user to define callbacks for receive event
     * @param key 
     */
    //% blockId=peer_receive block="when I receive key %key|do" blockGap=8
    //% blockNamespace=messaging inBasicCategory=true
    //% weight=99
    //% shim=messaging::receive
    function receive(key: string, handler: () => void): void;

}
declare namespace samples {
    /**
     * Record sample
     */
    //% blockId=record_sample block="record sample| %name| %sample"
    //% blockNamespace=samples inBasicCategory=true
    //% sample.fieldEditor="recorder"
    //% sample.fieldOptions.onParentBlock=true
    //% sample.fieldOptions.decompileLiterals=true    
    //% weight=98
    //% shim=samples::recordSample
    function recordSample(name: string, sample: string): void;

    /**
     * Play recorded sample
     */
    //% blockId=play_recorded_sample block="play sample| %name"
    //% blockNamespace=samples inBasicCategory=true
    //% weight=97
    //% shim=samples::playRecordedSample
    function playRecordedSample(name: string): void;

    /**
     * Loop recorded sample
     */
    //% blockId=loop_recorded_sample block="loop sample| %name"
    //% blockNamespace=samples inBasicCategory=true
    //% weight=96
    //% shim=samples::loopRecordedSample
    function loopRecordedSample(name: string): void;

}
declare namespace sound {
    /**
     * Mic Volume
     */
    //% blockId=get_volume block="get mic volume"
    //% blockNamespace=sound inBasicCategory=true
    //% weight=100
    //% shim=sound::getVolume
    function getVolume(): number;

    /**
     * Pitch
     */
    //% blockId=get_pitch block="get pitch"
    //% blockNamespace=sound inBasicCategory=true
    //% weight=99
    //% shim=sound::getPitch
    function getPitch(): string;

}

// Auto-generated. Do not edit. Really.
