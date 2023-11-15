import React from 'react';
import { BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI3, UUI4, UUI } from '../common';

export class DropdownContainerDoc extends BaseDocsBlock {
    title = 'Dropdown Container';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:DropdownContainerProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/overlays/dropdownContainer.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/overlays/dropdownContainer.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/overlays/dropdownContainer.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dropdownContainer-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/dropdownContainer/Basic.example.tsx" />
                <DocExample title="Focus lock and keyboard navigation" path="./_examples/dropdownContainer/FocusLockAndKeyboardNavigation.example.tsx" />
            </>
        );
    }
}
