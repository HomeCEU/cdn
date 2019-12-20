import {Http} from "./http";

declare const ProgressPluginClient: any;
let progress   = 0;
let http: Http = {
    async getProgress() {
        console.log('Getting Progress', progress);
        return progress;
    },
    async setProgress(value) {
        progress = value;
        console.log('Setting Progress', value);
    }
};
document.addEventListener('DOMContentLoaded', () => {
    let iframe = document.querySelector('iframe');
    console.log(iframe);
    let client = new ProgressPluginClient(iframe ? iframe.contentWindow : window, http);
});
