import * as React from 'react';
import { EditableDocContent, BaseDocsBlock } from '../../common';

export class ThemesDoc extends BaseDocsBlock {
    title = 'Themes';
    renderContent() {
        return (
            <EditableDocContent fileName="theming-intro" />
        );
    }
}
