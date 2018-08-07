/// <reference path="sound.d.ts" />

namespace pxsim.sound {

    /**
     * Mic Volume
     */
    //% blockId=get_volume block="get mic volume"
    //% blockNamespace=sound inBasicCategory=true
    //% weight=100
    export function getVolume() : number { 
        return board().micVolume;
    }

    /**
     * Pitch
     */
    //% blockId=get_pitch block="get pitch"
    //% blockNamespace=sound inBasicCategory=true
    //% weight=99    
    export function getPitch() : string {
        return analysis.detectPitch();
    }

        /**
     * Record sample
     */
    //% blockId=record_sample block="record sample| %name| %sample"
    //% blockNamespace=samples inBasicCategory=true
    //% sample.fieldEditor="recorder"
    //% sample.fieldOptions.onParentBlock=true
    //% sample.fieldOptions.decompileLiterals=true    
    //% weight=98 
    export function recordSample(name: string, sample: string) : void {
    }

    /**
     * Play recorded sample
     */
    //% blockId=play_recorded_sample block="play sample| %name"
    //% blockNamespace=samples inBasicCategory=true
    //% weight=97
    export function playRecordedSample(name: string) : void {
    }

    /**
     * Loop recorded sample
     */
    //% blockId=loop_recorded_sample block="loop sample| %name"
    //% blockNamespace=samples inBasicCategory=true
    //% weight=96
    export function loopRecordedSample(name: string) : void {
    }

}