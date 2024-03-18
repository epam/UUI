import React from 'react';
import * as promo from '@epam/promo';
import * as loveship from '@epam/loveship';
import { Button, FlexRow, Text } from '@epam/uui';
import { IPropSamplesCreationContext } from '@epam/uui-docs';

export const childrenLoveshipOrPromo = (
    ctx: IPropSamplesCreationContext<loveship.DropdownContainerProps | promo.DropdownContainerProps>,
) => {
    const color = ctx.getSelectedProps().color;
    return [
        { name: 'Basic', value: (<ChildrenExample isWhiteBg={ color === 'white' || !color } />), isDefault: true },
    ];
};

export const childrenUui = [
    { name: 'Basic', value: <ChildrenExample isWhiteBg={ true } />, isDefault: true },
];

const textContent = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, pariatur!';
function ChildrenExample(props: { isWhiteBg?: boolean }) {
    return (
        <div>
            <Text color={ props.isWhiteBg ? 'secondary' : 'white' }>{textContent}</Text>
            <FlexRow columnGap="12">
                <Button caption="Primary Action" color="primary" onClick={ () => {} } />
                <Button caption="Secondary Action" onClick={ () => {} } />
            </FlexRow>
        </div>
    );
}
