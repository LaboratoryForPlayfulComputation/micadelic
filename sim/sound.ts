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

}