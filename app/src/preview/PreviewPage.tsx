import { Page } from '../common';
import React, { lazy, Suspense } from 'react';

const ComponentPreviewWrapper = lazy(() => import('./componentPreview/ComponentPreview'));

export function PreviewPage() {
    return (
        <Page renderHeader={ () => null }>
            <Suspense fallback={ null }>
                <ComponentPreviewWrapper />
            </Suspense>
        </Page>
    );
}
