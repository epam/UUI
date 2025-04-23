import React from 'react';
import { Text } from '../Text';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('Text', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<Text>Test</Text>);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <Text color="primary" size="48" fontSize="24" lineHeight="30" onClick={ jest.fn } rawProps={ { style: { marginRight: '12' } } }>Test</Text>,
        );
        expect(tree).toMatchSnapshot();
    });
});
