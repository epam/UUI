import React from 'react';
import { LandingPage } from './landing';
import { Route, Routes } from 'react-router';
import { DocumentsPage } from './documents';
import { DemoPage } from './demo';
import { SandboxPage } from './sandbox/SandboxPage';

function App() {
    return (
        <Routes>
            <Route path="/" Component={ LandingPage } />
            <Route path="/documents" Component={ DocumentsPage } />
            <Route path="/demo" Component={ DemoPage } />
            <Route path="/sandbox" Component={ SandboxPage } />
        </Routes>
    );
}

export default App;
