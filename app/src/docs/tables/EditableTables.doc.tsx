import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';
import css from '../styles.module.scss';

export class EditableTablesDoc extends BaseDocsBlock {
    title = 'Editable Tables';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="editable-tables-descriptions" />
                {this.renderSectionTitle('Examples')}

                <DocExample cx={ css.appBg } title="Editable Table" path="./_examples/tables/EditableTable.example.tsx" />

                <DocExample cx={ css.appBg } title="Table with copying" path="./_examples/tables/TableWithCopying.example.tsx" />
            </>
        );
    }
}
