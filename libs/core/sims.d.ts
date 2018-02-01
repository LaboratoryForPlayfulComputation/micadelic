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
declare namespace video {
    /**
     * Set video using YouTube URL ID 
     * @param rate
     */
    //% blockId=video_set_video block="set video %string" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::setVideo
    function setVideo(id: string): void;

    /**
     * Change video speed 
     * @param rate
     */
    //% blockId=video_set_speed block="set speed %rate" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::setSpeed
    function setSpeed(rate: number): void;

    /**
     * Get video speed 
     */
    //% blockId=video_get_speed block="get speed" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::getSpeed
    function getSpeed(): number;

    /**
     * Determine if the video is playing 
     */
    //% blockId=video_is_playing block="video is playing" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::isPlaying
    function isPlaying(): boolean;

    /**
     * Determine the current time of the video 
     */
    //% blockId=video_current_time block="current time" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::getCurrentTime
    function getCurrentTime(): number;

    /**
     * Determine the duration of the video 
     */
    //% blockId=video_duration block="video duration" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::getDuration
    function getDuration(): number;

    /**
     * Get the video's current volume 
     */
    //% blockId=video_get_volume block="video volume" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::getVolume
    function getVolume(): number;

    /**
     * Determine if the video is muted 
     */
    //% blockId=video_is_muted block="video is muted" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::isMuted
    function isMuted(): boolean;

    /**
     * Seek to a specific time 
     * @param time
     */
    //% blockId=video_seek block="seek to %time" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::seek
    function seek(time: number): void;

    /**
     * Rewind a specific number of seconds 
     * @param value
     */
    //% blockId=video_rewind block="rewind %value" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::rewind
    function rewind(value: number): void;

    /**
     * Fast forward a specific number of seconds 
     * @param value
     */
    //% blockId=video_fastforward block="fast forward %value" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::fastforward
    function fastforward(value: number): void;

    /**
     * Set volume of the video 
     * @param value
     */
    //% blockId=video_set_volume block="set volume %value" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::setVolume
    function setVolume(value: number): void;

    /**
     * Play video
     */
    //% blockId=video_play block="play video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::play
    function play(): void;

    /**
     * Pause video
     */
    //% blockId=video_pause block="pause video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::pause
    function pause(): void;

    /**
     * Stop video
     */
    //% blockId=video_stop block="stop video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::stop
    function stop(): void;

    /**
     * Mute video
     */
    //% blockId=video_mute block="mute video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::mute
    function mute(): void;

    /**
     * Unmute video
     */
    //% blockId=video_unmute block="unmute video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    //% shim=video::unmute
    function unmute(): void;

}

// Auto-generated. Do not edit. Really.
