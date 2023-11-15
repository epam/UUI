import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

import css from '../styles.module.scss';

export class useTableStateDoc extends BaseDocsBlock {
    title = 'useTableState hook';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="useTableState-descriptions" />
                {this.renderSectionTitle('Examples')}

                <DocExample cx={ css.appBg } title="Filtration with Presets" path="./_examples/tables/useTableState/useTableState.example.tsx" />
                <DocExample cx={ css.appBg } title="Disable URL storing and handle state manually" path="./_examples/tables/useTableState/useTableStateWithIEditable.example.tsx" />
            </>
        );
    }
}
