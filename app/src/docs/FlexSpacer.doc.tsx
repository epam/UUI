import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common/docs';

export class FlexSpacerDoc extends BaseDocsBlock {
    title = 'FlexSpacer';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="flexSpacer-description" />

                {this.renderSectionTitle('Examples')}
                <DocExample path="./_examples/flexItems/FlexSpacer.example.tsx" />
            </>
        );
    }
}
