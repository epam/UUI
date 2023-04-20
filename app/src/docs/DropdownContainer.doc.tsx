import React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, UUI3, UUI4,
} from '../common';

export class DropdownContainerDoc extends BaseDocsBlock {
    title = 'Dropdown Container';

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/overlays/dropdownContainer.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/overlays/dropdownContainer.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dropdownContainer-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/dropdownContainer/Basic.example.tsx" />
            </>
        );
    }
}
