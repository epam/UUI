import * as React from 'react';
import { EditableDocContent, BaseDocsBlock, DocExample } from '../../common';

export class MicroFrontendsDoc extends BaseDocsBlock {
    title = 'Micro-Frontends Support';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='microfrontends-intro' />

                <DocExample
                    title='Basic'
                    path='./examples/microfrontends/MicroFrontends.example.tsx'
                />
            </>
        );
    }
}
