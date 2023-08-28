import React from 'react';
import { Anchor, FlexRow, IconContainer, Panel, Text } from '@epam/uui';
import { ReactComponent as ReactIcon } from '../../../icons/react.svg';
import { ReactComponent as TypescriptIcon } from '../../../icons/typescript-icon.svg';

export default function BasicExample() {
    return (
        <Panel style={ { padding: '4px' } }>
            <Text>Opens in a new window (target _blank)</Text>
            <FlexRow>
                <Anchor rawProps={ { 'aria-label': 'ReactJS' } } href="https://reactjs.org/" target="_blank">
                    <IconContainer icon={ ReactIcon } />
                </Anchor>
            </FlexRow>
            <Text>Opens in the same window</Text>
            <FlexRow>
                <Anchor rawProps={ { 'aria-label': 'TypeScript' } } href="https://www.typescriptlang.org/">
                    <IconContainer icon={ TypescriptIcon } />
                </Anchor>
            </FlexRow>
        </Panel>
    );
}
