export class ObjectMap<Key extends { equals: (obj: Key) => boolean }, Value> extends Map<Key, Value> {
    map = new Map<Key, Value>();
    constructor() {
        super();
    }

    get(key: Key): Value {
        return this.map.get(this.getExistedKey(key));
    }

    set(key: Key, value: Value) {
        this.map.set(this.getExistedKey(key) || key, value);
        return this;
    }

    delete(key: Key): boolean {
        return this.map.delete(this.getExistedKey(key));
    }

    private getExistedKey(key: Key) {
        for (const existKey of this.map.keys()) {
            if (existKey.equals(key)) {
                return existKey;
            }
        }
    }
}
