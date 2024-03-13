import React from 'react';
import * as uui from '@epam/uui';
import * as promo from '@epam/promo';
import * as loveship from '@epam/loveship';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../../common';
import { childrenLoveshipOrPromo, childrenUui } from './dropdownContainerExamples';

export class DropdownContainerDoc extends BaseDocsBlock {
    title = 'Dropdown Container';

    static override config: TDocConfig = {
        name: 'DropdownContainer',
        bySkin: {
            [TSkin.Loveship]: {
                type: '@epam/loveship:DropdownContainerProps',
                component: loveship.DropdownContainer,
                doc: (doc: DocBuilder<loveship.DropdownContainerProps>) => {
                    doc.merge('children', { examples: childrenLoveshipOrPromo });
                },
            },
            [TSkin.Promo]: {
                type: '@epam/promo:DropdownContainerProps',
                component: promo.DropdownContainer,
                doc: (doc: DocBuilder<promo.DropdownContainerProps>) => {
                    doc.merge('children', { examples: childrenLoveshipOrPromo });
                },
            },
            [TSkin.UUI]: {
                type: '@epam/uui:DropdownContainerProps',
                component: uui.DropdownContainer,
                doc: (doc: DocBuilder<uui.DropdownContainerProps>) => {
                    doc.merge('children', { examples: childrenUui });
                },
            },
            [TSkin.Electric]: {
                type: '@epam/uui:DropdownContainerProps',
                component: electric.DropdownContainer,
                doc: (doc: DocBuilder<uui.DropdownContainerProps>) => {
                    doc.merge('children', { examples: childrenUui });
                },
            },
        },
        doc: (doc: DocBuilder<loveship.DropdownContainerProps | promo.DropdownContainerProps | uui.DropdownContainerProps>) => {
            doc.merge('as', { editorType: 'MultiUnknownEditor', examples: ['span', 'b', 'i', 'p'] });
            doc.merge('shards', { editorType: 'JsonEditor' });
            doc.merge('focusLock', { examples: [{ value: false, isDefault: true }, true] });
            doc.merge('width', { examples: ['auto', 100, 500], editorType: 'NumEditor' });
            doc.merge('maxWidth', { examples: ['auto', 100, 500], editorType: 'NumEditor' });
            doc.merge('maxHeight', { examples: ['auto', 100, 500], editorType: 'NumEditor' });
            doc.merge('lockProps', { editorType: 'JsonEditor' });
            doc.merge('arrowProps', {
                editorType: 'MultiUnknownEditor',
                examples: [{ name: '{ ref: { current: null }, style: {} }', value: { ref: { current: null }, style: {} } }],
            });
        },
    };

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
