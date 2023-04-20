import React from 'react';
import { Anchor, IconContainer, Text } from '@epam/promo';
import { ReactComponent as ReactIcon } from '../../../icons/react.svg';
import { ReactComponent as TypescriptIcon } from '../../../icons/typescript-icon.svg';

export default function BasicExample() {
    return (
        <div>
            <Text>Opens in a new window (target _blank)</Text>
            <Anchor rawProps={{ 'aria-label': 'ReactJS' }} href={`https://reactjs.org/`} target="_blank">
                <IconContainer icon={ReactIcon} />
            </Anchor>
            <Text>Opens in the same window</Text>
            <Anchor rawProps={{ 'aria-label': 'TypeScript' }} href={`https://www.typescriptlang.org/`}>
                <IconContainer icon={TypescriptIcon} />
            </Anchor>
        </div>
    );
}
