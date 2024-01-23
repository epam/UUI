import React from 'react';
import { renderSnapshotWithContextAsync } from '@epam/uui-test-utils';
import { PickerToggler } from '../PickerToggler';

describe('PickerToggler', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerToggler
                pickerMode="single"
                searchPosition="none"
                closePickerBody={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerToggler
                pickerMode="multi"
                onClick={ jest.fn }
                onKeyDown={ jest.fn }
                value={ null }
                onValueChange={ jest.fn }
                size="48"
                maxItems={ 6 }
                getName={ (item) => item }
                selectedRowsCount={ 1 }
                selection={ [
                    {
                        id: 'test',
                        index: 1,
                        rowKey: 'test',
                        value: 'test',
                    },
                ] }
                onBlur={ jest.fn }
                onClear={ jest.fn }
                searchPosition="none"
                closePickerBody={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });
});
