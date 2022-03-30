import React from 'react';
import { LinkButton } from '@epam/promo';
import { EmbeddedWidget } from 'loveship';

const MicroFrontendHostExample: React.FC = () => {
    return (
        <EmbeddedWidget publicUrl='' widgetName='uuiDemoWidget' props={{}} />
    );
}

/**
 * We register this widget and wrap it with necessary components (Router, ContextProvider, etc) here: /app/src/index.tsx:70
 */
export const MicroFrontendWidgetExample: React.FC = () => {
    return (
        <div>Hello World!</div>
    );
}

export default MicroFrontendHostExample;
