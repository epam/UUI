import * as React from 'react';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class PickerListDoc extends BaseDocsBlock {
    title = 'PickerList';

    override config: TDocConfig = {
        name: 'PickerList',
        contexts: [TDocContext.Default, TDocContext.Resizable, TDocContext.Form],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui:PickerListProps', component: uui.PickerList },
            [TSkin.UUI3_loveship]: { type: '@epam/uui:PickerListProps', component: loveship.PickerList },
            [TSkin.UUI4_promo]: { type: '@epam/uui:PickerListProps', component: promo.PickerList },
        },
        doc: (doc: DocBuilder<uui.PickerListProps<any, any>>) => {
            doc.merge('value', {
                examples: [
                    { name: 'undefined', value: undefined },
                    { name: '1', value: 1 },
                    { name: '[1, 2]', value: [1, 2] },
                    { name: '{ id: 1, name: "Test"}', value: { id: 1, name: 'Test' } },
                    { name: '[{ id: 1, name: "Test"}]', value: [{ id: 1, name: 'Test' }] },
                ],
            });
            doc.merge('placeholder', { defaultValue: 'Please select' });
            doc.merge('defaultIds', {
                examples: [
                    { value: ['en', 'ru'], name: 'Languages' },
                    { value: ['500096', '625144', '2759794'], name: 'Locations' },
                    { value: [1, 2, 3, 4], name: 'Language Levels' },
                ],
            });
            doc.merge('renderModalToggler', {
                examples: [{ name: 'Custom Button', value: (props) => <uui.LinkButton { ...props } caption="Custom Button" /> }],
            });
            doc.merge('filter', {
                examples: [{ name: "{ country: 'UK' }", value: { country: 'UK' } }],
                remountOnChange: true,
            });
            doc.merge('noOptionsMessage', {
                examples: [
                    {
                        value: (
                            <uui.FlexRow spacing="12">
                                <uui.Text>No results found</uui.Text>
                                <uui.Button onClick={ () => {} } size="24" caption="Search" />
                            </uui.FlexRow>
                        ),
                        name: '<Text/><Button/>',
                    },
                ],
            });
        },
    };

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
