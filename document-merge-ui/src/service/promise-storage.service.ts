import { injectable } from 'inversify';

export interface PromiseStorageService {
    getPromise(func, params: string): Promise<any> | null;
    setPromise(func, params: string, promise: Promise<any>): void;
    unsetPromise(func, params: string): void;
}

@injectable()
export class PromiseStorageServiceImpl implements PromiseStorageService {
    private promiseCache: Map<any, Map<string, Promise<any>>>;

    constructor() {
        this.promiseCache = new Map<any, Map<string, Promise<any>>>();
    }

    getPromise(func, params: string): Promise<any> {
        if (this.promiseCache.get(func)) {
            return this.promiseCache.get(func).get(params);
        }
    }

    setPromise(func, params: string, promise: Promise<any>): void {
        if (!this.promiseCache.get(func)) {
            this.promiseCache.set(func, new Map<string, Promise<any>>());
        }
        this.promiseCache.get(func).set(params, promise);
    }

    unsetPromise(func, params: string): void {
        this.promiseCache.get(func).delete(params);
    }
}
