import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { Button } from '../../buttons';
import { ColumnHeaderDropdown } from '../ColumnHeaderDropdown';
import { mockReactPortalsForSnapshots } from '@epam/uui-test-utils';

describe('ColumnHeaderDropdown', () => {
    it('should be rendered correctly', async () => {
        const portalMock = mockReactPortalsForSnapshots();
        const tree = await renderSnapshotWithContextAsync(
            <ColumnHeaderDropdown
                title=""
                renderTarget={ (props) => <Button caption="Test" { ...props } /> }
                isOpen
                onOpenChange={ jest.fn }
                isSortable
                sortDirection="asc"
                onSort={ jest.fn }
                renderFilter={ () => <div>Picker</div> }
            />,
        );
        portalMock.mockClear();
        expect(tree).toMatchSnapshot();
    });
});
