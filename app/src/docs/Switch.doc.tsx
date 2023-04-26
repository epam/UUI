import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4, UUI,
} from '../common';

export class SwitchDoc extends BaseDocsBlock {
    title = 'Switch';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/switch.props.ts',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/switch.props.ts',
            [UUI]: './app/src/docs/_props/uui/components/inputs/switch.props.ts',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="switch-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/switch/Basic.example.tsx" />
            </>
        );
    }
}
