import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { EditableDocContent, DocExample, BaseDocsBlock, TSkin } from '../common';
import * as loveshipDocs from './_props/loveship/docs';
import * as promoDocs from './_props/epam-promo/docs';
import { TDocConfig } from '../common/docs/docBuilderGen/types';

export class AccordionDoc extends BaseDocsBlock {
    title = 'Accordion';

    override config: TDocConfig = {
        name: 'Accordion',
        bySkin: {
            [TSkin.UUI3_loveship]: { type: '@epam/uui:AccordionProps', component: loveship.Accordion, doc: (doc) => doc.withContexts(loveshipDocs.ResizableContext) },
            [TSkin.UUI4_promo]: { type: '@epam/uui:AccordionProps', component: promo.Accordion, doc: (doc) => doc.withContexts(promoDocs.ResizableContext) },
            [TSkin.UUI]: { type: '@epam/uui:AccordionProps', component: uui.Accordion },
        },
        doc: (doc: DocBuilder<uui.AccordionProps>) => {
            const LONG_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.`;
            doc.merge('children', {
                examples: [
                    {
                        name: 'Simple text 14px',
                        value: (
                            <uui.Text fontSize="14">{LONG_TEXT}</uui.Text>
                        ),
                        isDefault: true,
                    }, {
                        name: 'Simple text 12px',
                        value: (
                            <uui.Text fontSize="12">{LONG_TEXT}</uui.Text>
                        ),
                    }, {
                        name: 'Marked up content',
                        value: (
                            <React.Fragment>
                                <uui.Text size="36" font="regular">{LONG_TEXT}</uui.Text>
                                <uui.FlexRow spacing="6">
                                    <uui.FlexSpacer />
                                    <uui.Button color="secondary" caption="Cancel" onClick={ () => {} } />
                                    <uui.Button color="primary" caption="Accept" onClick={ () => {} } />
                                </uui.FlexRow>
                            </React.Fragment>
                        ),
                    },
                ],
            });
            doc.merge('title', { examples: [{ value: 'Accordion title', isDefault: true }, 'Additional info'] });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="accordion-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/accordion/Basic.example.tsx" />
                <DocExample title="Handle Accordion state by yourself" path="./_examples/accordion/HandleStateByYourself.example.tsx" />
                <DocExample title="Custom accordion" path="./_examples/accordion/Custom.example.tsx" />
            </>
        );
    }
}
