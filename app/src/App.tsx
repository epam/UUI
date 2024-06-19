import React from 'react';
import { LandingPage } from './landing';
import { Outlet, Route, Routes } from 'react-router';
import { DocumentsPage } from './documents';
import { DemoPage } from './demo';
import { SandboxPage } from './sandbox/SandboxPage';
import { PreviewPage } from './preview/previewPage';
import { AppTheme } from './helpers/appTheme';
import { Snackbar } from '@epam/uui';
import { Modals, PortalRoot, useDocumentDir } from '@epam/uui-components';
import { DragGhost } from '@epam/uui-core';
import { getCurrentTheme } from './helpers';

function App() {
    return (
        <Routes>
            <Route Component={ AppLayout }>
                <Route path="/" Component={ LandingPage } />
                <Route path="/documents" Component={ DocumentsPage } />
                <Route path="/demo" Component={ DemoPage } />
                <Route path="/sandbox" Component={ SandboxPage } />
                <Route path="/preview" Component={ PreviewPage } />
            </Route>
        </Routes>
    );
}

function AppLayout() {
    const theme = getCurrentTheme();
    const dir = useDocumentDir();

    return (
        <AppTheme key={ `${theme}-${dir}` }>
            <Outlet />
            <Snackbar />
            <Modals />
            <DragGhost />
            <PortalRoot />
        </AppTheme>
    );
}

export default App;
