import { Store, legacy_createStore as createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import { logger } from '../middleware';
import { RootState } from '@reducer';

export function configureStore(initialState?: RootState): Store<RootState> {
    const middlewares = [logger];

    const store = createStore((state) => state, initialState as any, composeWithDevTools(applyMiddleware(...middlewares))) as Store<RootState>;

    return store;
}

export const store = configureStore();
