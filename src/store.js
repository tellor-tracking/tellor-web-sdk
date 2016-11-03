export default class Store {
    constructor(transport) {
        this.transport = transport;
        this.q = [];
    }

    submit(params) {
        // TODO add to local storage for cache
        this.q.push({params});
        this.transport.run();
    }

    get() {
        return this.q;
    }

    remove(item) {
        // TODO remove from local storage for cache
        const i = this.q.indexOf(item);
        if (i) this.q.splice(i, 1);
    }
}