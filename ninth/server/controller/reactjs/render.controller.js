
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter, Switch } from "react-router-dom";
import MainRouter from "../../../client/routerclient";
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from "../../../client/reducer/rootReducer";
import rootSaga from "../../../client/saga/rootSaga";
import { Provider } from 'react-redux';
import path from "path";

export default async function receive(req, res) {

  const title = "Hello";

  const context = {};

  const sagaMiddleware = createSagaMiddleware();
  let initialState = {};
  const store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware));
  const preloadedState = store.getState();

  // không dùng stream
  const component = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <Switch>
          <MainRouter />
        </Switch>
      </StaticRouter>
    </Provider>
  );

  //render ra file
  //trên productionpath.resolve(__dirname, "dist/public")
  try {
    res.sendFile(path.resolve(__dirname, "public/index.html"), { title: title, component: component, preloadedState: preloadedState });
  } catch (err) {
    console.error(err);
  }
  //dùng text string thường
  // const html = `
  //   <!doctype html>
  //     <html>
  //     <head>
  //       <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //       <meta http-equiv="X-UA-Compatible" content="ie=edge">
  //       <link rel="stylesheet" href="/static/client.css">
  //       <title>${title}</title>
  //     </head>
  //     <body>
  //       <div id="root">${component}</div>
  //       <script>
  //         window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
  //       </script>
  //       <script src="/static/15.js"></script>
  //       <script src="/static/client.js"></script>
  //       <script src="/static/vendors-node_modules_babel_polyfill_lib_index_js-node_modules_react-redux_es_index_js-node_mo-c3075c.js"></script>
  //     </body>
  //     </html>`;

  //res.status(200).wrtite(html);

  //dùng stream
  // const componentStream = ReactDOMServer.renderToNodeStream(
  //   <Provider store={store}>
  //     <div className="AppMenu">
  //       <div className="AppMenu-step">

  //       </div>
  //       <div className="AppMenu-action">
  //         <StaticRouter location={req.url} context={context}>
  //           <Switch>
  //             <MainRouter />
  //           </Switch>
  //         </StaticRouter>
  //       </div>
  //     </div>
  //   </Provider>
  // );



  //const appString = <App store={store} history={createMemoryHistory()} routes={routes} />;
  let sagaresult = await sagaMiddleware.run(rootSaga);//.toPromise();
  //console.log("sagaresult", sagaresult);

  //khoong dùng stream
  //res.status(200).send(html);

  //dùng stream - để trang load nhanh hơn, kết hợp với hàm hydrate
  //header
  // const htmlStart = `
  // <!doctype html>
  //   <html>
  //   <head>
  //     <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //     <meta http-equiv="X-UA-Compatible" content="ie=edge">
  //     <link rel="stylesheet" href="/static/client.css">
  //     <title>${title}</title>
  //   </head>
  //   <body>
  //     <div id="root">`;
  // res.write(htmlStart);

  // //body
  // componentStream.pipe(res, { end: false });

  // //footer
  // const htmlEnd = `
  // </div>
  //     <script>
  //       window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
  //     </script>
  //     <script src="/static/client.js"></script>
  //     <script src="/static/runtime.js"></script>
  //     <script src="/static/vendor.js"></script>
  //     <!--<script src="/static/15.js"></script>-->
  //     <!-- <script src="/static/vendors-node_modules_babel_polyfill_lib_index_js-node_modules_react-redux_es_index_js-node_mo-c3075c.js"></script> -->
  //   </body>
  //   </html>`;

  // componentStream.on("end", () => {
  //   res.write(htmlEnd);

  //   res.end();
  // });

  // sagaMiddleware.run(rootSaga).toPromise().then(() => {
  //   console.log("saga server", "run");
  //   //res.status(200).send(html);
  // }).catch((e) => {
  //   console.log("saga server error", e.message);
  //   //res.status(500).send(e.message);
  // });
}