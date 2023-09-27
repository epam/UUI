import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4, UUI, TUuiTsDoc,
} from '../common';

export class BlockerDoc extends BaseDocsBlock {
    title = 'Blocker';

    override getUuiTsDoc = (): TUuiTsDoc => ('@epam/uui-components:BlockerProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/layout/blocker.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/blocker.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/layout/blocker.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="blocker-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/blocker/Basic.example.tsx" />

                <DocExample title="Advanced" path="./_examples/blocker/Advanced.example.tsx" />
            </>
        );
    }
}
