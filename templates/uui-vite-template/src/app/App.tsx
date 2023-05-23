import { MainPage } from '../pages/MainPage';
import { Route } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import css from './App.module.scss';

export const App = () => {
    return (
        <div className={css.app}>
            <Route component={AppHeader} />
            <Route path="/" component={MainPage} />
            <footer></footer>
        </div>
    );
};
