import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import moment from 'moment';
import createApolloClient from 'apolloClient';
import App from './components/App';
import LocalStorageProvider from './components/LocalStorageProvider';
import './style/index.sass';

moment.locale('de');

const render = (AppComponent) => {
    const root = createRoot(document.getElementById('app'));

    root.render((
        <LocalStorageProvider>
            {(localStorageRef) => (
                <ApolloProvider client={createApolloClient(localStorageRef)}>
                    <BrowserRouter>
                        <AppComponent />
                    </BrowserRouter>
                </ApolloProvider>
            )}
        </LocalStorageProvider>
    ));
};

render(App);

if (module.hot) {
    module.hot.accept();
}
