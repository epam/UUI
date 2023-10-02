import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI3, UUI4,
} from '../common';

export class MultiSwitchDoc extends BaseDocsBlock {
    title = 'MultiSwitch';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:MultiSwitchProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/inputs/multiSwitch.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/inputs/multiSwitch.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="multiSwitch-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/multiSwitch/Basic.example.tsx" />
            </>
        );
    }
}
