/// <reference path="sound.d.ts" />

namespace pxsim.sound {

    /**
     * Mic Volume
     */
    //% blockId=get_volume block="get mic volume"
    //% blockNamespace=sound inBasicCategory=true
    //% weight=100
    export function getVolume() : number { 
        console.log(board().micVolume.toString());
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
     * Play recorded sample
     */
    //% blockId=play_recorded_sample block="play sample| %name"
    //% blockNamespace=sound inBasicCategory=true
    //% weight=97
    export function playRecordedSample(name: string) : void {
        for (var r = 0; r < board().recordings.length; r++){
            let recording = board().recordings[r];
            if (recording["name"] == name){
                let audioelement = recording["audioelement"];
                if (audioelement)
                    audioelement.play();
            }
        }
    }

    /**
     * Loop recorded sample
     */
    //% blockId=loop_recorded_sample block="loop sample| %name"
    //% blockNamespace=sound inBasicCategory=true
    //% weight=96
    export function loopRecordedSample(name: string) : void {
    }

}