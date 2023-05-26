import './index.scss';
//
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';

function initApp() {
    const root = createRoot(window.document.getElementById('root') as Element);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}

initApp();
