import React from 'react';
import { LandingPage } from './landing';
import { Route } from 'react-router';
import { DocumentsPage } from './documents';
import { DemoPage } from './demo';
import { SandboxPage } from './sandbox/SandboxPage';

class App extends React.Component<any, any> {
    render() {
        return (
            <>
                <Route path='/' exact={ true } component={ LandingPage } />
                <Route path='/documents' component={ DocumentsPage } />
                <Route path='/demo' component={ DemoPage } />
                <Route path='/sandbox' component={ SandboxPage } />
            </>
        );
    }
}

export default App;
