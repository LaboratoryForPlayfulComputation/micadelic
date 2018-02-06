/// <reference path="sound.d.ts" />

namespace pxsim.sound {

    if (!(navigator as any).getUserMedia) {
        (navigator as any).getUserMedia = (navigator as any).getUserMedia 
                               || (navigator as any).webkitGetUserMedia 
                               || (navigator as any).mozGetUserMedia 
                               || (navigator as any).msGetUserMedia;    
    }
    
    if ((navigator as any).getUserMedia) {
        (navigator as any).getUserMedia({audio: true}, function (e: any) {
            // what goes here?
        }, function (e: any) {
            alert('Error capturing audio.');
        });
    } else {
        alert('getUserMedia not supported in this browser.');
    }

}