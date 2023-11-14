import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../common';

export class ThemingDoc extends BaseDocsBlock {
    title = 'Theming';
    renderContent() {
        return (
            <EditableDocContent fileName="theming-intro" />
        );
    }
}
