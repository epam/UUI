import { MainPage } from '../pages/MainPage';
import { Route } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import css from './App.module.scss';
import { createBrowserHistory } from 'history';
import { ContextProvider } from '@epam/uui-core';
import { ErrorHandler } from '@epam/promo';
import { Modals, Snackbar } from '@epam/uui-components';
import { Router } from 'react-router-dom';
import { TAppContext, loadAppContext } from './helpers/appContext';
import { TApi, apiDefinition } from './helpers/apiDefinition';

const history = createBrowserHistory();

export function App() {
    return (
        <Router history={history}>
            <ContextProvider<TApi, TAppContext>
                onInitCompleted={() => {}}
                history={history}
                apiDefinition={apiDefinition}
                loadAppContext={loadAppContext}
            >
                <ErrorHandler>
                    <div className={css.app}>
                        <Route component={AppHeader} />
                        <Route path="/" component={MainPage} />
                        <footer></footer>
                    </div>
                    <Snackbar />
                    <Modals />
                </ErrorHandler>
            </ContextProvider>
        </Router>
    );
}
