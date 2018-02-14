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

}