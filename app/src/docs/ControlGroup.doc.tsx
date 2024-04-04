import * as React from 'react';
import * as uuiComponents from '@epam/uui-components';
import * as uui from '@epam/uui';
import * as loveship from '@epam/loveship';
import * as promo from '@epam/promo';
import * as electric from '@epam/electric';
import { DocBuilder, TDocConfig, TDocContext, TSkin } from '@epam/uui-docs';
import { BaseDocsBlock, DocExample, EditableDocContent } from '../common';
import { ReactComponent as menuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';

export class ControlGroupDoc extends BaseDocsBlock {
    title = 'Control Group';

    static override config: TDocConfig = {
        name: 'ControlGroup',
        contexts: [TDocContext.Default, TDocContext.Form, TDocContext.Resizable],
        bySkin: {
            [TSkin.UUI]: { type: '@epam/uui-components:ControlGroupProps', component: uui.ControlGroup },
            [TSkin.Loveship]: { type: '@epam/uui-components:ControlGroupProps', component: loveship.ControlGroup },
            [TSkin.Promo]: { type: '@epam/uui-components:ControlGroupProps', component: promo.ControlGroup },
            [TSkin.Electric]: { type: '@epam/uui-components:ControlGroupProps', component: electric.ControlGroup },
        },
        doc: (doc: DocBuilder<uuiComponents.ControlGroupProps>) => {
            doc.merge('children', {
                examples: [
                    {
                        name: 'Preset',
                        value: (
                            <uui.ControlGroup>
                                <uui.Button size="36" caption="Preset" fill="none" onClick={ () => {} } />
                                <uui.Dropdown
                                    renderBody={ () => {
                                        return (
                                            <uui.Panel background="surface-main" shadow={ true }>
                                                <uui.DropdownMenuButton caption="Duplicate" onClick={ () => {} } />
                                                <uui.DropdownMenuButton caption="Rename" onClick={ () => {} } />
                                                <uui.DropdownMenuButton caption="Delete" onClick={ () => {} } />
                                            </uui.Panel>
                                        );
                                    } }
                                    renderTarget={ (props) => <uui.Button { ...props } fill="none" icon={ menuIcon } size="36" isDropdown={ false } /> }
                                    placement="bottom-end"
                                />
                            </uui.ControlGroup>
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
