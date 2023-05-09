import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

export class PresetsPanelDoc extends BaseDocsBlock {
    title = 'Presets Panel';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="presets-panel-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/tables/PresetsPanelBasic.example.tsx" />
            </>
        );
    }
}
