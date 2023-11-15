import React from 'react';
import { Button, FlexRow, Text } from '@epam/uui';

const textContent = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, pariatur!';

export function SampleContent(props: { isWhiteBg?: boolean }) {
    return (
        <div>
            <Text color={ props.isWhiteBg ? 'secondary' : 'white' }>{textContent}</Text>
            <FlexRow spacing="12">
                <Button caption="Primary Action" color="primary" onClick={ () => {} } />
                <Button caption="Secondary Action" onClick={ () => {} } />
            </FlexRow>
        </div>
    );
}
