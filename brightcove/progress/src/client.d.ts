import { Http } from "./http";
export declare class ProgressPluginClient {
    private iframe;
    private http;
    static readonly PING = "video.progress.ping";
    static readonly GET_PROGRESS = "video.progress.get";
    static readonly SET_PROGRESS = "video.progress.set";
    constructor(iframe: HTMLIFrameElement, http: Http);
    sendProgress(): Promise<void>;
}
