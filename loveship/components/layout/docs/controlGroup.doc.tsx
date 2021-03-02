import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ControlGroup } from '../ControlGroup';
import { ResizableContext, DefaultContext } from '../../../docs';
import { Button, TextInput } from '../../../components';
import { ControlGroupProps } from '@epam/uui-components';

const controlGroupDoc = new DocBuilder<ControlGroupProps>({ name: 'ControlGroup', component: ControlGroup })
    .prop('children', { examples: [
        {
            name: '<Button/>, <Button/>, <Button/>',
            value: (
                <React.Fragment>
                    <Button color='grass' caption='Submit'/>
                    <Button caption='Help'/>
                    <Button fill='none' color='carbon' caption='Cancel'/>
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
    .withContexts(DefaultContext, ResizableContext);

export = controlGroupDoc;