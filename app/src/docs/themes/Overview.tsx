import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../common';

export class ThemingOverview extends BaseDocsBlock {
    title = 'Overview';

    renderContent() {
        return (
            <EditableDocContent fileName="theming-intro" />
        );
    }
}
