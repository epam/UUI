'use client';

import React from 'react';
import { Text } from '@epam/uui';
import {
    ButtonExample,
    InputExample,
    LoaderExample,
    IconExample,
    AccordionExample,
} from '../../components/lib';
import { withErrorHandle } from '../../components/withErrorHandle';

const Components = () => {
    return (
        <div className={'withGap'}>
            <Text
                size='42'
                fontSize='24'
            >
                Demo example with list of components
            </Text>
            <ButtonExample />
            <InputExample />
            <LoaderExample />
            <IconExample />
            <AccordionExample />
        </div>
    );
};

export default withErrorHandle(Components);
