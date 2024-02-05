import React from 'react';
import { ConfirmationModal } from '../ConfirmationModal';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';

describe('ConfirmationModal', () => {
    it('should be rendered correctly without body', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <ConfirmationModal
                caption="Test"
                key="test-key"
                success={ (result) => jest.fn(result) }
                abort={ jest.fn }
                isActive
                zIndex={ 1 }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <ConfirmationModal
                caption="Test"
                key="test-key"
                success={ (result) => jest.fn(result) }
                abort={ jest.fn }
                isActive
                zIndex={ 1 }
                bodyContent={ <div>Test content</div> }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
