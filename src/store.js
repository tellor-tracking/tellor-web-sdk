export default class Store {
    constructor(transport) {
        this.transport = transport;
        this._LSId = '__ttc__';
        this.q = this._getLocalStorageCache();
    }

    submit(params) {
        const item = this._create(params);
        this._addToLocalStorage(item);
        this.q.push(item);
        this.transport.run();
    }

    get() {
        return this.q.filter(item => !item.isLocked);
    }

    remove(item) {
        const i = this.q.indexOf(item);
        if (i > -1) this.q.splice(i, 1);
        this._removeFromLocalStorage(item);
    }

    lockItem(item) {
        item.isLocked = true;
    }

    unlockItem(item) {
        item.isLocked = false;
    }


    _create(params) {
        return {
            params,
            id: Date.now() + Math.random().toFixed()
        };
    }

    _getLocalStorageCache() {
        try {
            return JSON.parse(localStorage.getItem(this._LSId)) || [];
        } catch (e) {
            return [];
        }
    }

    _addToLocalStorage(item) {
        const cache = this._getLocalStorageCache();
        cache.push(item);

        localStorage.setItem(this._LSId, JSON.stringify(cache));
    }

    _removeFromLocalStorage(item) {
        const cache = this._getLocalStorageCache();

        const newCache = cache.filter(i => i.id != item.id);
        localStorage.setItem(this._LSId, JSON.stringify(newCache));
    }
}
