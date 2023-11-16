import * as React from 'react';
import * as uuiComponents from '@epam/uui-components';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';

export class ControlGroupDoc extends BaseDocsBlock {
    title = 'Control Group';

    override config: TDocConfig = {
        name: 'ControlGroup',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:ControlGroupProps', component: uui.ControlGroup },
            [TSkin.UUI3_loveship]: { type: '@epam/uui-components:ControlGroupProps', component: loveship.ControlGroup },
            [TSkin.UUI4_promo]: { type: '@epam/uui-components:ControlGroupProps', component: promo.ControlGroup },
        },
        doc: (doc: DocBuilder<uuiComponents.ControlGroupProps>) => {
            doc.merge('children', {
                examples: [
                    {
                        name: '<Button/>, <Button/>, <Button/>',
                        value: (
                            <React.Fragment>
                                <uui.Button color="accent" fill="solid" caption="Submit" onClick={ () => {} } />
                                <uui.Button caption="Help" onClick={ () => {} } />
                                <uui.Button color="primary" fill="ghost" caption="Cancel" onClick={ () => {} } />
                            </React.Fragment>
                        ),
                        isDefault: true,
                    }, {
                        name: '<TextInput/>, <TextInput/>, <TextInput/>',
                        value: (
                            <React.Fragment>
                                <uui.TextInput value="Alex" onValueChange={ null } />
                                <uui.TextInput value="Minsk" onValueChange={ null } />
                                <uui.TextInput value="Belarus" onValueChange={ null } />
                            </React.Fragment>
                        ),
                    },
                ],
            });
        },
    };

    renderContent() {
        return (
            <>
                <EditableDocContent fileName="controlGroup-descriptions" />
                {this.renderSectionTitle('Examples')}
                <DocExample title="Basic" path="./_examples/controlGroup/Basic.example.tsx" />
                <DocExample title="Prefix" path="./_examples/controlGroup/Prefix.example.tsx" />
            </>
        );
    }
}
