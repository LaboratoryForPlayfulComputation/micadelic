/// <reference path="video.d.ts" />

namespace pxsim.video {

    let player = null as any;

    var script = document.createElement('script');
    script.onload = function () {
        (window as any).onYouTubeIframeAPIReady = function() {
            let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;  
            let heightOffset = 40;          
            let widthOffset = 15;          
            player = new YT.Player('video-placeholder', {
                width: w - widthOffset,
                height: h - heightOffset,
                videoId: '6v2L2UGZJAM',
                playerVars: {
                    color: 'white',
                },
                events: {
                    onReady: initializePlayer
                }
            });    
        }
    };
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
        
    window.addEventListener("resize", resizeVideo);

    function resizeVideo(){
        if (player){
            let iframe = player.getIframe();
            let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            let heightOffset = 40;          
            let widthOffset = 15;              
            iframe.setAttribute("width", w - widthOffset);
            iframe.setAttribute("height", h - heightOffset);
        }
    }

    function initializePlayer(){
    }

    export function resetVideo(){
        if (player){
            player.seekTo(0);
            player.pauseVideo();
            player.unMute();
        }
    }

    /**
    * Set video using YouTube URL ID 
     * @param rate
     */
    //% blockId=video_set_video block="set video %string" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function setVideo(id: string) {
        player.cueVideoById(id);
    }

    /**
    * Change video speed 
     * @param rate
     */
    //% blockId=video_set_speed block="set speed %rate" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function setSpeed(rate: number) {
        player.setPlaybackRate(rate);
    }

    /**
    * Get video speed 
     */
    //% blockId=video_get_speed block="get speed" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function getSpeed(): number {
        return player.getPlaybackRate();
    }    

    /**
    * Determine if the video is playing 
     */
    //% blockId=video_is_playing block="video is playing" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function isPlaying(): boolean {
        if (player.getPlayerState() == 1)
            return true;
        else
            return false;
    }

    /**
    * Determine the current time of the video 
     */
    //% blockId=video_current_time block="current time" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function getCurrentTime(): number {
        return player.getCurrentTime();
    }

    /**
    * Determine the duration of the video 
     */
    //% blockId=video_duration block="video duration" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function getDuration(): number {
        return player.getDuration();
    }

    /**
    * Get the video's current volume 
     */
    //% blockId=video_get_volume block="video volume" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function getVolume(): number {
        return player.getVolume();
    }

    /**
    * Determine if the video is muted 
     */
    //% blockId=video_is_muted block="video is muted" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function isMuted(): boolean {
        return player.isMuted();
    }

    /**
    * Seek to a specific time 
     * @param time
     */
    //% blockId=video_seek block="seek to %time" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function seek(time: number) {
        player.seekTo(time);
    }    

    /**
    * Rewind a specific number of seconds 
     * @param value
     */
    //% blockId=video_rewind block="rewind %value" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function rewind(value: number) {
        let time = player.getCurrentTime();
        player.seekTo(time - value);
    }  

    /**
    * Fast forward a specific number of seconds 
     * @param value
     */
    //% blockId=video_fastforward block="fast forward %value" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function fastforward(value: number) {
        let time = player.getCurrentTime();
        player.seekTo(time + value);
    }  

    /**
    * Set volume of the video 
     * @param value
     */
    //% blockId=video_set_volume block="set volume %value" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function setVolume(value: number) {
        player.setVolume(value);
    }  

    /**
    * Play video
     */
    //% blockId=video_play block="play video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function play() {
        player.playVideo();
    }  

    /**
    * Pause video
     */
    //% blockId=video_pause block="pause video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function pause() {
        player.pauseVideo();
    }

    /**
    * Stop video
     */
    //% blockId=video_stop block="stop video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function stop() {
        player.stopVideo();
    }

    /**
    * Mute video
     */
    //% blockId=video_mute block="mute video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function mute() {
        player.mute();
    }

    /**
    * Unmute video
     */
    //% blockId=video_unmute block="unmute video" blockGap=8
    //% weight=98
    //% blockNamespace=video inBasicCategory=true
    export function unmute() {
        player.unMute();
    }

}