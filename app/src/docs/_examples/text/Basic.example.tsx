import React from 'react';
import { Button, FlexRow, Text, TextInput } from '@epam/uui';
import css from './Styles.module.scss';

export default function BasicExample() {
    return (
        <div className={ css.wrapper }>
            <FlexRow cx={ css.container } columnGap="6">
                <Text size="48">Text of 48 size</Text>
                <TextInput size="48" value="Input text" onValueChange={ () => {} } />
                <Button size="48" caption="Caption" />
            </FlexRow>
            <FlexRow cx={ css.container } columnGap="6">
                <Text size="42">Text of 42 size</Text>
                <TextInput size="42" value="Input text" onValueChange={ () => {} } />
                <Button size="42" caption="Caption" />
            </FlexRow>
            <FlexRow cx={ css.container } columnGap="6">
                <Text size="36">Text of 36 size(Default)</Text>
                <TextInput size="36" value="Input text" onValueChange={ () => {} } />
                <Button size="36" caption="Caption" />
            </FlexRow>
            <FlexRow cx={ css.container } columnGap="6">
                <Text size="30">Text of 30 size</Text>
                <TextInput size="30" value="Input text" onValueChange={ () => {} } />
                <Button size="30" caption="Caption" />
            </FlexRow>
            <FlexRow cx={ css.container } columnGap="6">
                <Text size="24">Text of 24 size</Text>
                <TextInput size="24" value="Input text" onValueChange={ () => {} } />
                <Button size="24" caption="Caption" />
            </FlexRow>
            <FlexRow columnGap="6">
                <Text size="18">Text of 18 size</Text>
                <Button size="18" caption="Caption" />
            </FlexRow>
        </div>
    );
}
