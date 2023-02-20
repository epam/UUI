import * as React from 'react';
import { EditableDocContent, BaseDocsBlock, UUI3 } from '../../common';

export class VisualExamplesDoc extends BaseDocsBlock {
    title = 'Visual Examples';

    renderContent() {
        return (
            <>
                <EditableDocContent key="visualExamples-for-designers" fileName="visualExamples-for-designers" />
            </>
        );
    }
}
