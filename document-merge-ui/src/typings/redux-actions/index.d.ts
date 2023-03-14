declare module 'redux-actions' {
    export type HandleReducer<State, Actions extends any> = {
        [k in keyof Actions]: (state: State, action: ReturnType<Actions[k]>) => State;
    };

    export function handleActions<State, Actions>(
        reducerMap: HandleReducer<State, Actions>,
        initialState: State,
        options?: Options
    ): ReduxCompatibleReducer<State, Actions>;

    export interface Options {
        prefix?: string;
        namespace?: string;
    }

    export type ActionFunction1<T1, R> = (t1: T1) => R;

    export type ReduxCompatibleReducer<State, Payload> = (state: State | undefined, action: Action<Payload>) => State;

    export interface BaseAction {
        type: string;
    }

    export interface Action<Payload> extends BaseAction {
        payload: Payload;
        error?: boolean;
    }

    export function createAction<Payload>(actionType: string): ActionFunction1<Payload, Action<Payload>>;
}
