import { PromiseStorageService } from '@service';
import { createAction, handleActions } from 'redux-actions';
import { TYPES } from '@data';
import { combineReducers, Store } from 'redux';

export const CachePromiseMethod = (target, propertyKey: string, propertyDescriptor: PropertyDescriptor) => {
    const requestFunction = propertyDescriptor.value;
    propertyDescriptor.value = cachePromiseFunction.call(target, requestFunction);
};

export const CachePromiseProperty = (target, propertyKey: string) => {
    let valueClosure = null;

    const setter = (requestFunction) => {
        valueClosure = cachePromiseFunction(requestFunction);
    };

    Object.defineProperty(target, propertyKey, {
        get: () => valueClosure,
        set: setter,
    });
};

const cachePromiseFunction = function (requestFunction) {
    return function (...args: any[]) {
        const promiseStorageService = DIContainer.get<PromiseStorageService>(TYPES.PROMISE_STORAGE_SERVICE);

        const paramId = JSON.stringify(args);
        const cachePromise = promiseStorageService.getPromise(requestFunction, paramId);
        if (cachePromise) {
            return cachePromise;
        }
        const promise = requestFunction
            .call(this, ...args)
            .then((data) => {
                promiseStorageService.unsetPromise(requestFunction, paramId);
                return data;
            })
            .catch((error) => {
                promiseStorageService.unsetPromise(requestFunction, paramId);
                throw error;
            });
        promiseStorageService.setPromise(requestFunction, paramId, promise);
        return promise;
    };
};

type Target = { new(...arg): ({} & any); prototype: {} }
const reducersData = {};
const TYPE_NAME = 'NDM';
export const scopeDecorator = (scopeName: string) => (target: Target):Target  => {
        const createTypeName = (property: string) => {
            const propertyName = property[0].toUpperCase() + property.slice(1);
            return TYPE_NAME + '/' + target.name + '/' + 'set' + propertyName;
        };

        return class extends target {
            constructor(...arg) {
                super(arg);

                const store = DIContainer.get<Store>(TYPES.STORE);

                const initialState = {};
                const handlers = {};

                Object.entries(this).forEach(([property, initialValue]) => {
                    initialState[property] = initialValue;
                    const typeName = createTypeName(property);
                    const action = createAction<typeof initialValue>(typeName);
                    handlers[typeName] = (state, action) => {
                        const newState = { ...state };
                        newState[property] = action.payload;
                        return newState;
                    };
                    Object.defineProperty(this, property, {
                        get: () => store.getState()[scopeName][property],
                        set: (value: typeof initialValue) => store.dispatch(action(value)),
                    });
                });
                reducersData[scopeName] = handleActions(handlers, initialState);
                const newRootReducer = combineReducers({
                    ...reducersData,
                });
                store.replaceReducer(newRootReducer);
            }
        };
    };
