import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';
import css from '../styles.module.scss';

export class TablesOverviewDoc extends BaseDocsBlock {
    title = 'Tables overview';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tables-overview-descriptions" />
                {this.renderSectionTitle('Examples')}

                <DocExample cx={ css.appBg } title="Async Table" path="./_examples/tables/AsyncTable.example.tsx" />

                <DocExample cx={ css.appBg } title="Lazy Table" path="./_examples/tables/LazyTable.example.tsx" />

                <DocExample cx={ css.appBg } title="Array Table" path="./_examples/tables/ArrayTable.example.tsx" />

                <DocExample cx={ css.appBg } title="Tree Table" path="./_examples/tables/TreeTable.example.tsx" />

                <DocExample cx={ css.appBg } title="Column size and content align configuration" path="./_examples/tables/StyledColumns.example.tsx" />

                <DocExample cx={ css.appBg } title="Condensed view" path="./_examples/tables/CondensedView.example.tsx" />
            </>
        );
    }
}
