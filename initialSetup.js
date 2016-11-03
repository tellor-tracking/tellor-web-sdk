var Tellor = Tellor || {};
Tellor.track = function(a) {window.__ttq = window.__ttq || []; window.__ttq.push(a);};

(function() {
    var config = {
        url: 'url', // required
        appKey: 'appKey', // required
        appVersion: 'appVersion', // optional
        user: {
            id: 'id', // required if want to track user
            name: 'name' // optional, but id must be provided if name is
        }
    };

    var d = document, ts = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    ts.type = 'text/javascript';
    ts.async = true;
    ts.defer = true;
    ts.src = config.url + '/tellor.js';
    ts.onload = function() {Tellor.init(config)};
    s.parentNode.insertBefore(ts, s);
})();


