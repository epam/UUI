import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class useTableStateDoc extends BaseDocsBlock {
    title = 'useTableState hook';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="useTableState-descriptions" />
                {this.renderSectionTitle('Examples')}

                <DocExample title="Filtration with Presets" path="./_examples/tables/useTableState/useTableState.example.tsx" />
                <DocExample title="Disable URL storing and handle state manually" path="./_examples/tables/useTableState/useTableStateWithIEditable.example.tsx" />
            </>
        );
    }
}
