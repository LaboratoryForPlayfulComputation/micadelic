/// <reference path="sound.d.ts" />

namespace pxsim.analysis {

    export function findFundamentalFreq(buffer: Uint8Array, sampleRate: number) {
        // We use Autocorrelation to find the fundamental frequency.
        
        // In order to correlate the signal with itself (hence the name of the algorithm), we will check two points 'k' frames away. 
        // The autocorrelation index will be the average of these products. At the same time, we normalize the values.
        // Source: http://www.phy.mty.edu/~suits/autocorrelation.html
        // Assuming the sample rate is 48000Hz, a 'k' equal to 1000 would correspond to a 48Hz signal (48000/1000 = 48), 
        // while a 'k' equal to 8 would correspond to a 6000Hz one, which is enough to cover most (if not all) 
        // the notes we have in the notes.json file.
        let n = 1024, bestR = 0, bestK = -1;
        for(let k = 8; k <= 1000; k++){
            let sum = 0;
            
            for(let i = 0; i < n; i++){
                sum += ((buffer[i] - 128) / 128) * ((buffer[i + k] - 128) / 128);
            }
            
            let r = sum / (n + k);
    
            if(r > bestR){
                bestR = r;
                bestK = k;
            }
    
            if(r > 0.9) {
                // Let's assume that this is good enough and stop right here
                break;
            }
        }
        
        if(bestR > 0.0025) {
            // The period (in frames) of the fundamental frequency is 'bestK'. Getting the frequency from there is trivial.
            var fundamentalFreq = sampleRate / bestK;
            return fundamentalFreq;
        }
        else {
            // We haven't found a good correlation
            return -1;
        }
    }
    
    export function detectPitch() : string {
        var buffer = new Uint8Array(board().waveformAnalyser.fftSize);
        // See initializations in the AudioContent and AnalyserNode sections of the demo.
        board().waveformAnalyser.getByteTimeDomainData(buffer); 
        let fundalmentalFreq = findFundamentalFreq(buffer, board().audioContext.sampleRate);
    
        if (fundalmentalFreq !== -1) {
            let note = findClosestNote(fundalmentalFreq); // See the 'Finding the right note' section.
            //let cents = findCentsOffPitch(fundalmentalFreq, note.frequency); // See the 'Calculating the cents off pitch' section.
            return note["note"];
        } else {
            return "--";
        }
    }

    export function findCentsOffPitch(freq : number, refFreq : any) {
        // We need to find how far freq is from baseFreq in cents
        var log2 = 0.6931471805599453; // Math.log(2)
        var multiplicativeFactor = freq / refFreq;
        
        // We use Math.floor to get the integer part and ignore decimals
        var cents = Math.floor(1200 * (Math.log(multiplicativeFactor) / log2));
        return cents;
    }

    // 'notes' is an array of objects like { note: 'A4', frequency: 440 }.
    // See initialization in the source code of the demo
    export function findClosestNote(freq : number) {
        // Use binary search to find the closest note
        let notes = board().notesArray;
        let low = -1, high = notes.length;
        while (high - low > 1) {
            let pivot = Math.round((low + high) / 2);
            if (notes[pivot]["frequency"] <= freq) {
                low = pivot;
            } else {
                high = pivot;
            }
        }
        
        if(Math.abs(notes[high]["frequency"] - freq) <= Math.abs(notes[low]["frequency"] - freq)) {
            return notes[high]; // notes[high] is closer to the frequency we found
        }
        
        return notes[low];
    }

}