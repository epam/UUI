import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3, UUI,
} from '../common';

export class PaginatorDoc extends BaseDocsBlock {
    title = 'Paginator';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/widgets/paginator.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/widgets/paginator.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/widgets/paginator.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="paginator-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/paginator/Basic.example.tsx" />
            </>
        );
    }
}
