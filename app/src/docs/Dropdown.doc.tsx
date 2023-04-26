import * as React from 'react';
import {
    EditableDocContent, DocExample, BaseDocsBlock, UUI3, UUI4,
} from '../common';

export class DropdownDoc extends BaseDocsBlock {
    title = 'Dropdown';
    getPropsDocPath() {
        return {
            [UUI3]: './app/src/docs/_props/loveship/components/overlays/dropdown.props.tsx',
            [UUI4]: './app/src/docs/_props/epam-promo/components/overlays/dropdown.props.tsx',
        };
    }

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="dropdown-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/dropdown/Basic.example.tsx" />

                <DocExample title="Dropdown Open/Close modifiers" path="./_examples/dropdown/CloseOpenModifiers.example.tsx" />

                <DocExample title="Set delay for dropdown body opening or closing" path="./_examples/dropdown/DelayForOpenAndClose.example.tsx" />

                <DocExample title="Handle dropdown state by yourself" path="./_examples/dropdown/HandleStateByYourself.example.tsx" />

                <DocExample title="Close dropdown from body" path="./_examples/dropdown/CloseFromBody.example.tsx" />
            </>
        );
    }
}
