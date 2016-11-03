export default class Transport {

    constructor(tellor) {
        this.tellor = tellor;
        this.runInterval = 10000;
        this.apiEndPoint = '/track';
        this.standardParams = this._formatStandardParams();
        setInterval(this.run.bind(this), this.runInterval);
    }


    run() {
        const trackItems = this.tellor.store.get();
        trackItems.forEach(this._XHRGet.bind(this));
    };

    _XHRGet(trackItem) {
        const store = this.tellor.store;

        try {
            const xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

            xhr.open('GET', `${this.tellor.url}${this.apiEndPoint}?${this.standardParams}&${trackItem.params}`, true);

            xhr.onreadystatechange = function() {
                if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
                    store.remove(trackItem);
                } else if (this.readyState === 4) {
                    console.error('Failed to track', trackItem);
                }
            };

            xhr.send();
        } catch (e) {
            store.remove(trackItem);
        }
    };

    _formatStandardParams() {
        const t = this.tellor;
        let s = `sdk=${t.sdk}&app_key=${t.appKey}&app_version=${t.appVersion}`;
        if (t.user && t.user.id) s += `userId=${t.user.id}`;
        if (t.user && t.user.id && t.user.name) s += `userId=${t.user.name}`;

        return s;
    }
}