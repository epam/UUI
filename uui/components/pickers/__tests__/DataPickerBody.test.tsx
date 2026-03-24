import React from 'react';
import { renderHook, renderSnapshotWithContextAsync, renderWithContextAsync, waitFor, within } from '@epam/uui-test-utils';
import { ArrayDataSource } from '@epam/uui-core';
import { DataPickerBody, DataPickerBodyProps } from '../DataPickerBody';
import { i18n } from '../../../i18n';

type LanguageLevel = { id: number; level: string };
const languageLevels = [
    { id: 2, level: 'A1' }, { id: 3, level: 'A1+' }, { id: 4, level: 'A2' }, { id: 5, level: 'A2+' }, { id: 6, level: 'B1' }, { id: 7, level: 'B1+' }, { id: 8, level: 'B2' }, { id: 9, level: 'B2+' }, { id: 10, level: 'C1' }, { id: 11, level: 'C1+' }, { id: 12, level: 'C2' },
];

const mockDataSource = new ArrayDataSource({
    items: languageLevels,
});

describe('DataPickerBody', () => {
    const hookResult = renderHook(
        () => mockDataSource.useView({}, () => {}, {}),
    );
    const view = hookResult.result.current;
    const rows = view.getVisibleRows();
    const requiredProps: DataPickerBodyProps<LanguageLevel, number> = {
        value: { topIndex: 0 },
        onValueChange: jest.fn(),
        getName: (item) => item.level,
        rows: rows,
    };

    it('should be rendered with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(<DataPickerBody { ...requiredProps } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered without rows', async () => {
        const tree = await renderSnapshotWithContextAsync(<DataPickerBody { ...requiredProps } rows={ [] } renderEmpty={ () => <div>Not found</div> } />);
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <DataPickerBody
                { ...requiredProps }
                showSearch="auto"
                maxHeight={ 800 }
                searchSize="48"
                rows={ rows }
                onKeyDown={ jest.fn }
                rowsCount={ 7 }
                totalCount={ 11 }
                scheduleUpdate={ jest.fn }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should update announcer div when empty list shows default no-records message', async () => {
        const { container } = await renderWithContextAsync(
            <DataPickerBody
                { ...requiredProps }
                rows={ [] }
                showSearch
                rowsCount={ 0 }
                value={ { topIndex: 0, search: 'no-match' } }
            />,
        );

        await waitFor(() => {
            expect(within(container).getByRole('status')).toHaveTextContent(i18n.dataPickerBody.noRecordsMessage);
        });
    });

    it('should update announcer div to match custom renderEmpty text', async () => {
        const { container } = await renderWithContextAsync(
            <DataPickerBody
                { ...requiredProps }
                rows={ [] }
                renderEmpty={ () => <div>Custom empty message</div> }
            />,
        );

        await waitFor(() => {
            expect(within(container).getByRole('status')).toHaveTextContent('Custom empty message');
        });
    });

    it('should clear announcer when list has rows', async () => {
        const { container, rerender } = await renderWithContextAsync(
            <DataPickerBody
                { ...requiredProps }
                rows={ [] }
                renderEmpty={ () => <div>Was empty</div> }
            />,
        );

        const emptyStatusAnnouncer = within(container).getByRole('status');

        await waitFor(() => {
            expect(emptyStatusAnnouncer).toHaveTextContent('Was empty');
        });

        rerender(
            <DataPickerBody { ...requiredProps } rows={ rows } />,
        );

        await waitFor(() => {
            expect(emptyStatusAnnouncer).toHaveTextContent('');
        });
    });
});
