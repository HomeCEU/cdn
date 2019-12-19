import {fromEvent}          from "rxjs";
import {filter, first, map} from "rxjs/operators";

declare const videojs: any;

export class ProgressPlugin {
    static readonly PING          = 'video.progress.ping';
    static readonly PONG          = 'video.progress.pong';
    static readonly GET_PROGRESS  = 'video.progress.get';
    static readonly SEND_PROGRESS = 'video.progress.set';
    progress                      = 0;

    constructor(private player: any) {
        player.on("loadedmetadata", async () => {
            console.log(player);
            this.progress = await this.getProgress();
            // If video position is greater than zero, than start playback at that point.
            if (this.progress > 0) {
                player.currentTime(this.progress);
                player.play();
            }
        });

        // +++ Increment the cookie +++
        // Listen for when the current playback position has changed. This should be every 15-250 milliseconds.
        player.on("timeupdate", () => {
            let progress = player.currentTime();
            // When the integer value changes, then update the cookie
            if (Math.round(progress) > this.progress) {
                this.progress = Math.round(progress) - 2;
                this.trackProgress();
            }
        });

        // +++ Reset the cookie +++
        // When video playback reaches the end, then reset the cookie value to zero
        player.on("ended", () => {
            console.log(player.currentTime());
            this.progress = 100;
            this.trackProgress();
        });

        window.top.postMessage({
            event: ProgressPlugin.PING
        }, '*');
    }

    trackProgress() {
        window.top.postMessage({
            event: ProgressPlugin.SEND_PROGRESS,
            data : this.progress
        }, '*');
    }

    async getProgress(): Promise<number> {
        window.top.postMessage({
            event: ProgressPlugin.GET_PROGRESS
        }, '*');
        return await fromEvent(window, 'message')
            .pipe(filter((event: any) => event.data.event === ProgressPlugin.GET_PROGRESS))
            .pipe(first())
            .pipe(map(event => event.data.data))
            .toPromise();
    }


}

videojs.registerPlugin('progress', function (options) {
    let pluginHandler = new ProgressPlugin(this);
});
