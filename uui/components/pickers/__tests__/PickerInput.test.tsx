import React, { ReactNode } from 'react';
import { ArrayDataSource } from '@epam/uui-core';
import { renderSnapshotWithContextAsync, setupComponentForTest, screen, fireEvent } from "@epam/test-utils";
import { PickerInput } from '../PickerInput';

type TestItemType = {
    id: number,
    level: string,
};

const languageLevels: TestItemType[] = [
    { "id": 2, "level": "A1" },
    { "id": 3, "level": "A1+" },
    { "id": 4, "level": "A2" },
    { "id": 5, "level": "A2+" },
    { "id": 6, "level": "B1" },
    { "id": 7, "level": "B1+" },
    { "id": 8, "level": "B2" },
    { "id": 9, "level": "B2+" },
    { "id": 10, "level": "C1" },
    { "id": 11, "level": "C1+" },
    { "id": 12, "level": "C2" },
];

const mockDataSource = new ArrayDataSource({
    items: languageLevels,
});

type PickerInputComponentProps = React.ComponentProps<typeof PickerInput<TestItemType, number>>;

async function setupPickerInputForTest(params: Partial<PickerInputComponentProps>) {
    const {
        result,
        mocks,
    } = await setupComponentForTest<PickerInputComponentProps>(
        (context): PickerInputComponentProps => {
            if (params.selectionMode === 'single') {
                return {
                    value: params.value as number,
                    selectionMode: params.selectionMode,
                    onValueChange: jest.fn().mockImplementation((newValue) => context.current.setProperty('value', newValue)),
                    dataSource: mockDataSource,
                    disableClear: false,
                    searchPosition: 'input',
                    getName: item => item.level,
                };
            }
            return {
                value: params.value as number[],
                selectionMode: params.selectionMode,
                onValueChange: jest.fn().mockImplementation((newValue) => context.current.setProperty('value', newValue)),
                dataSource: mockDataSource,
                disableClear: false,
                searchPosition: 'input',
                getName: item => item.level,
            };
        },
        (props) => (<PickerInput { ...props } />),
    );
    const input = screen.queryByRole('textbox');

    return {
        result,
        mocks,
        dom: { input },
    };
}

describe('PickerInput', () => {
    it('should render with minimum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerInput
                value={ null }
                onValueChange={ jest.fn }
                selectionMode="single"
                dataSource={ mockDataSource }
                disableClear
                searchPosition="input"
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerInput
                value={ [1, 2] }
                onValueChange={ jest.fn }
                selectionMode="multi"
                dataSource={ mockDataSource }
                size="48"
                maxItems={ 20 }
                editMode="modal"
                valueType={ 'id' }
                getName={ item => item.level }
                autoFocus
                placeholder="Test placeholder"
                filter={ (item: any) => item.level === 'A1' }
                sorting={ { direction: 'desc', field: 'level' } }
                searchPosition="body"
                minBodyWidth={ 900 }
                renderNotFound={ ({ search, onClose = jest.fn }) => <div
                    onClick={ onClose }>{ `No found ${ search }` }</div> }
                renderFooter={ props => <div>{ props as unknown as ReactNode }</div> }
                cascadeSelection
                dropdownHeight={ 48 }
                minCharsToSearch={ 4 }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('[selectionMode multi] should select & clear several options', async () => {
        const {
            dom,
            mocks,
        } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'multi',
        });
        expect(dom.input.getAttribute('placeholder').trim()).toEqual('Please select');
        fireEvent.click(dom.input);
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
        const [cb1, cb2] = screen.getAllByRole('checkbox');
        fireEvent.click(cb1);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith([2]);
        fireEvent.click(cb2);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith([2, 3]);
        expect(cb1).toBeChecked();
        expect(cb2).toBeChecked();
        fireEvent.click(window.document.body);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryAllByRole('button')).toHaveLength(3); // 2 tags and 1 clear button
        const a1 = screen.getByText('A1');
        const a1Clear = a1.nextElementSibling;
        const a1plus = screen.getByText('A1+');
        const a1plusClear = a1plus.nextElementSibling;
        fireEvent.click(a1Clear);
        expect(screen.queryAllByRole('button')).toHaveLength(2); // 1 tag and 1 clear button
        fireEvent.click(a1plusClear);
        expect(screen.queryAllByRole('button')).toHaveLength(0);
    });


    it('[selectionMode single] should select & clear option', async () => {
        const {
            dom,
            mocks,
        } = await setupPickerInputForTest({
            value: undefined,
            selectionMode: 'single',
        });
        expect(dom.input.getAttribute('placeholder').trim()).toEqual('Please select');
        fireEvent.click(dom.input);
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
        const optionC2 = screen.getByText('C2');
        fireEvent.click(optionC2);
        expect(mocks.onValueChange).toHaveBeenLastCalledWith(12);
        fireEvent.click(window.document.body);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText('C2')).toBeInTheDocument();
        const clear = screen.getByRole('button');
        fireEvent.click(clear);
        expect(screen.queryByText('C2')).not.toBeInTheDocument();
    });
});
