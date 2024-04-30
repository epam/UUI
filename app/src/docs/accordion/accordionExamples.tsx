import { Button, FlexRow, FlexSpacer, Text } from '@epam/uui';
import * as React from 'react';

const LONG_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
mollit anim id est laborum.`;

const MEDIUM_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur.`;

export const accordionExamples = [
    {
        name: 'Simple text 14px',
        value: (
            <Text fontSize="14">{LONG_TEXT}</Text>
        ),
        isDefault: true,
    }, {
        name: 'Simple text 12px',
        value: (
            <Text fontSize="12">{LONG_TEXT}</Text>
        ),
    }, {
        name: 'Simple text 12px - medium length',
        value: (
            <Text fontSize="12">{MEDIUM_TEXT}</Text>
        ),
    }, {
        name: 'Marked up content',
        value: (
            <React.Fragment>
                <Text size="36">{LONG_TEXT}</Text>
                <FlexRow columnGap="6">
                    <FlexSpacer />
                    <Button color="secondary" caption="Cancel" onClick={ () => {} } />
                    <Button color="primary" caption="Accept" onClick={ () => {} } />
                </FlexRow>
            </React.Fragment>
        ),
    },
];
