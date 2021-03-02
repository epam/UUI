import * as React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common/docs';

export class FlexItemsDoc extends BaseDocsBlock {
    title = 'Flex Items';

    renderContent() {
        return (
            <>
                <EditableDocContent fileName='flex-descriptions' />

                { this.renderSectionTitle('Panel') }
                <EditableDocContent fileName='panel-description' />

                { this.renderSectionTitle('FlexRow') }
                <EditableDocContent fileName='flexRow-description' />

                { this.renderSectionTitle('FlexCell') }
                <EditableDocContent fileName='flexCell-description' />

                { this.renderSectionTitle('FlexSpacer') }
                <EditableDocContent fileName='flexSpacer-description' />

                { this.renderSectionTitle('Examples') }
                <DocExample
                    path='./examples/flexItems/Basic.example.tsx'
                />
            </>
        );
    }
}