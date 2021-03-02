import React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ModalFooter, ModalFooterProps } from '../Modals';
import { DefaultContext} from '../../../docs';
import { FlexRow } from '../../layout';
import { Text } from '../../typography';
import { Button } from '../../buttons';

const ModalFooterDoc = new DocBuilder<ModalFooterProps>({ name: 'ModalFooter', component: ModalFooter })
    .prop('background', { examples: ['white', 'gray5', 'none'] })
    .prop('padding', { examples: ['6', '12', '24'] })
    .prop('children', {
        examples: [
            {
                isDefault: true,
                value: <React.Fragment>
                <FlexRow vPadding='12' spacing='6'>
                    <FlexRow>
                        <Text size="30" font='sans'>Modal footer text in children props</Text>
                    </FlexRow>
                    <FlexRow spacing='6'>
                        <Button onClick={ () => {} } color='green' caption='Ok'/>
                        <Button onClick={ () => {} } fill='none' color='gray50' caption='Cancel'/>
                    </FlexRow>
                </FlexRow>
                </React.Fragment>,
                name: 'Caption with buttons',
            },
        ],
    })
    .withContexts(DefaultContext);

export = ModalFooterDoc;