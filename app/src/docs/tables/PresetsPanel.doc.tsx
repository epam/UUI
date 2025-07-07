import * as React from 'react';
import { EditableDocContent, DocExample, BaseDocsBlock } from '../../common';

import css from '../styles.module.scss';

export class PresetsPanelDoc extends BaseDocsBlock {
    title = 'Presets Panel';
    renderContent() {
        return (
            <>
                <EditableDocContent fileName="presets-panel-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample cx={ css.appBg } title="Basic" path="./_examples/tables/PresetsPanelBasic.example.tsx" />
                <DocExample cx={ css.appBg } title="Custom onCopyLink handler" path="./_examples/tables/PresetsPanelOnCopyLink.example.tsx" />
            </>
        );
    }
}
