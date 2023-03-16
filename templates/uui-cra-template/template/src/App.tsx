import React from 'react';
import { MainPage } from './pages/MainPage';
import { Route } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import css from './App.module.scss';

console.log('Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello');
console.log('Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello');
console.log('Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello');
console.log('Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello');
console.log('Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello');
console.log('Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello-Hello');
export const App = () => {
    return (
        <div className={ css.app }>
            <Route component={ AppHeader } />
            <main>
                <Route path="/" exact component={ MainPage } />
            </main>
            <footer></footer>
        </div>
    );
}
