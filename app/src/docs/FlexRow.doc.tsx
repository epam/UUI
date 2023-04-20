import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI4, UUI3,
} from '../common';

export class FlexRowDoc extends BaseDocsBlock {
    title = 'FlexRow';

    getPropsDocPath() {
        return {
            [UUI4]: './app/src/docs/_props/epam-promo/components/layout/FlexItems/flexRow.props.tsx',
            [UUI3]: './app/src/docs/_props/loveship/components/layout/FlexItems/flexRow.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="flexRow-description" />

                {this.renderSectionTitle('Examples')}
                <DocExample path="./_examples/common/Card.example.tsx" />
            </>
        );
    }
}
