import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

import css from '../styles.module.scss';

export class FiltersPanelDoc extends BaseDocsBlock {
    title = 'Filters Panel';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="filters-panel-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample cx={ css.appBg } title="Basic" path="./_examples/tables/FiltersPanelBasic.example.tsx" />
            </>
        );
    }
}
