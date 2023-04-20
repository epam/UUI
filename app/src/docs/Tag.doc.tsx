import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4 } from '../common';

export class TagDoc extends BaseDocsBlock {
    title = 'Tag';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/widgets/tag.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/widgets/tag.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="tag-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/tag/Basic.example.tsx" />
                <DocExample title="Size" path="./_examples/tag/Size.example.tsx" />
            </>
        );
    }
}
