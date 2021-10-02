import React from "react";
import ReactDOM from "react-dom";
import '@babel/polyfill';
import MainRouter from "./routerclient";
import { BrowserRouter, Switch } from "react-router-dom";
import '../client/assets/css/client.css';
import createSagaMiddleware from 'redux-saga';
import rootSaga from "./saga/rootSaga";
import rootReducer from "./reducer/rootReducer";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, preloadedState, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

class Client extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <MainRouter />
                </Switch>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Client />
    </Provider>,
    document.getElementById("root"));