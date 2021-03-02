import * as React from 'react';
import { DocBuilder } from '@epam/uui-docs';
import { ModalFooter, ModalFooterProps } from '../Modals';
import { DefaultContext} from '../../../docs';
import { FlexRow } from '../../layout';
import { Text } from '../../typography';
import { Button } from '../../buttons';

const ModalFooterDoc = new DocBuilder<ModalFooterProps>({ name: 'ModalFooter', component: ModalFooter })
    .prop('background', { examples: ['white', 'night50', 'none']})
    .prop('borderTop', { examples: [true]})
    .prop('padding', { examples: ['6', '12', '24'] })
    .prop('children', {
        examples: [
            {
                isDefault: true,
                value: <React.Fragment>
                <FlexRow vPadding='12'>
                    <FlexRow>
                        <Text size="30" font='sans'>Modal footer text in children props</Text>
                    </FlexRow>
                    <FlexRow>
                        <Button onClick={ () => {} } color='grass' caption='Ok'/>
                        <Button onClick={ () => {} } fill='none' color='night400' caption='Cancel'/>
                    </FlexRow>
                </FlexRow>
                </React.Fragment>,
                name: 'Caption with buttons',
            },
        ],
    })
    .withContexts(DefaultContext);

export = ModalFooterDoc;