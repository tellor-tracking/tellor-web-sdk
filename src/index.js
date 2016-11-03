import formatters from './formatters/index';
import Transport from './transport';
import Store from './store';

class Tellor {
    constructor(formatters, Transport, Store,{appKey, appVersion = '1', url, user}) {
        this.sdk = 'web';
        this.appKey = appKey;
        this.appVersion = appVersion;
        this.url = url;
        this.user = user;

        this.formatters = formatters;

        this.transport = new Transport(this);
        this.store = new Store(this.transport);

        if (window.__ttq !== undefined) {
            window.__ttq.forEach(this.track); // if any events in cache that was created before Tellor initialized, track them
        }
    }

    track(event) {
        const ef = this.formatters.event(event);

        if (ef) this.store.submit(ef);
    }
}


export default {
    init(config = {}) {
        if (!config.appKey || !config.url) {
            return console.warn('You must provide app_key and url');
        }

        window.Tellor = new Tellor(formatters, Transport, Store, config);
    }
};