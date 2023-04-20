import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/test-utils';
import { Button } from '../../buttons';
import { ColumnHeaderDropdown } from '../ColumnHeaderDropdown';
import { mockReactPortalsForSnapshots } from '@epam/test-utils';

mockReactPortalsForSnapshots();

describe('ColumnHeaderDropdown', () => {
    it('should be rendered correctly', async () => {
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
        expect(tree).toMatchSnapshot();
    });
});
