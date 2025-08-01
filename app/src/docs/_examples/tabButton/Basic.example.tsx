import React, { useState } from 'react';
import { TabButton, FlexRow, FlexCell, TabButtonProps } from '@epam/uui';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

const routes = ['Main', 'Home', 'Tools', 'Options'];

export default function BasicTabButtonExample(props: ExampleProps) {
    const [value, onValueChange] = useState('Home');
    const sizes = getAllPropValues('size', false, props) as TabButtonProps['size'][];

    return (
        <FlexCell grow={ 1 }>
            { sizes.map((size) => (
                <FlexRow key={ size } borderBottom>
                    { routes.map((route) => (
                        <TabButton
                            key={ route }
                            caption={ route }
                            isActive={ value === route }
                            onClick={ () => onValueChange(route) }
                            count={ route === 'Tools' ? 18 : undefined } // pseudocode - random number, to show the count badge
                            withNotify={ route === 'Options' } // pseudocode - to show the notification mark
                            size={ size }
                        />
                    )) }
                </FlexRow>
            )) }
        </FlexCell>
    );
}
