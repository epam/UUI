import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../common';

export class MicroFrontendsDoc extends BaseDocsBlock {
    title = 'Micro-Frontends Support';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='microfrontends-intro' />
            </>
        );
    }
}
