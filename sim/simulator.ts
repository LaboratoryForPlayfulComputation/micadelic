/// <reference path="../node_modules/pxt-core/typings/globals/bluebird/index.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../typings/globals/peerjs/index.d.ts" />
/// <reference path="video.d.ts" />

namespace pxsim {

    /**
     * This function gets called each time the program restarts
     */
    initCurrentRuntime = () => {
        runtime.board = new Board();
    };

    /**
     * Gets the current 'board', eg. program state.
     */
    export function board() : Board {
        return runtime.board as Board;
    }

    /**
     * Represents the entire state of the executing program.
     * Do not store state anywhere else!
     */
    export class Board extends pxsim.BaseBoard {
        public bus: EventBus;
        
        constructor() {
            super();
            this.bus = new EventBus(runtime);           
        }
        
        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
            video.resetVideo();         
            return Promise.resolve();
        }       
        
    }
}