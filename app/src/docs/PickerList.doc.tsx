import * as React from 'react';
import {
    BaseDocsBlock, DocExample, EditableDocContent, TDocsGenType, UUI, UUI3, UUI4,
} from '../common';

export class PickerListDoc extends BaseDocsBlock {
    title = 'PickerList';

    override getDocsGenType = (): TDocsGenType => ('@epam/uui:PickerListProps');

    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/pickers/pickerList.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/pickers/pickerList.props.tsx',
            [UUI]: './app/src/docs/_props/uui/components/pickers/pickerList.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="pickerList-description" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/pickerList/Basic.example.tsx" />
            </>
        );
    }
}
