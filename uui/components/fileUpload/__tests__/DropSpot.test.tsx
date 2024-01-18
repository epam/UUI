import React from 'react';
import { DropSpot } from '../DropSpot';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('DropSpot', () => {
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(<DropSpot onUploadFiles={ jest.fn } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with props', async () => {
        const tree = await renderSnapshotWithContextAsync(<DropSpot onUploadFiles={ jest.fn } infoText="Test info" />);
        expect(tree).toMatchSnapshot();
    });
});
