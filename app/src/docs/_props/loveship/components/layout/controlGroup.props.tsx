import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ControlGroup } from '@epam/loveship';
import { DefaultContext, FormContext, ResizableContext } from '../../docs';
import { Button, TextInput } from '@epam/loveship';
import { ControlGroupProps } from '@epam/uui-components';

const controlGroupDoc = new DocBuilder<ControlGroupProps>({ name: 'ControlGroup', component: ControlGroup })
    .prop('children', { examples: [
        {
            name: '<Button/>, <Button/>, <Button/>',
            value: (
                <React.Fragment>
                    <Button color='grass' caption='Submit' onClick={ () => null } />
                    <Button caption='Help' onClick={ () => null } />
                    <Button fill='none' color='night500' caption='Cancel' onClick={ () => null } />
                </React.Fragment>
            ),
            isDefault: true,
        },
        {
            name: '<TextInput/>, <TextInput/>, <TextInput/>',
            value: (
                <React.Fragment>
                    <TextInput value='Alex' onValueChange={ null }/>
                    <TextInput value='Minsk' onValueChange={ null }/>
                    <TextInput value='Belarus' onValueChange={ null }/>
                </React.Fragment>
            ),
        },
    ] })
    .withContexts(DefaultContext, FormContext, ResizableContext);

export default controlGroupDoc;
