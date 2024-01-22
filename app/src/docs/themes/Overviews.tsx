import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../common';

export class Overviews extends BaseDocsBlock {
    title = 'Overviews';

    renderContent() {
        return (
            <EditableDocContent fileName="theming-intro" />
        );
    }
}
