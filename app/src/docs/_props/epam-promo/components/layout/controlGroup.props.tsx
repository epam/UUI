import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ControlGroup } from '@epam/promo';
import { DefaultContext, FormContext, ResizableContext } from '../../docs';
import { Button, TextInput } from '@epam/promo';
import { ControlGroupProps } from '@epam/uui-components';

const controlGroupDoc = new DocBuilder<ControlGroupProps>({ name: 'ControlGroup', component: ControlGroup })
    .prop('children', {
        examples: [
            {
                name: '<Button/>, <Button/>, <Button/>',
                value: (
                    <React.Fragment>
                        <Button color="green" caption="Submit" onClick={ () => {} } />
                        <Button caption="Help" onClick={ () => {} } />
                        <Button fill="none" color="gray50" caption="Cancel" onClick={ () => {} } />
                    </React.Fragment>
                ),
                isDefault: true,
            },
            {
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
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default controlGroupDoc;
