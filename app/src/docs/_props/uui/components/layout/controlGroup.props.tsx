import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ControlGroup, Button, TextInput } from '@epam/uui';
import { DefaultContext, ResizableContext } from '../../docs';
import { ControlGroupProps } from '@epam/uui-components';

const controlGroupDoc = new DocBuilder<ControlGroupProps>({ name: 'ControlGroup', component: ControlGroup })
    .prop('children', {
        examples: [
            {
                name: '<Button/>, <Button/>, <Button/>',
                value: (
                    <React.Fragment>
                        <Button color="accent" caption="Submit" onClick={ () => {} } />
                        <Button caption="Help" onClick={ () => {} } />
                        <Button fill="none" color="secondary" caption="Cancel" onClick={ () => {} } />
                    </React.Fragment>
                ),
                isDefault: true,
            }, {
                name: '<TextInput/>, <TextInput/>, <TextInput/>',
                value: (
                    <React.Fragment>
                        <TextInput value="Alex" onValueChange={ null } />
                        <TextInput value="Minsk" onValueChange={ null } />
                        <TextInput value="Belarus" onValueChange={ null } />
                    </React.Fragment>
                ),
            },
        ],
    })
    .withContexts(DefaultContext, ResizableContext);

export default controlGroupDoc;
