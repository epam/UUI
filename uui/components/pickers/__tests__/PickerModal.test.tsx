import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { PickerModalTestObject, delay, fireEvent, prettyDOM, renderSnapshotWithContextAsync, screen, setupComponentForTest, waitFor } from '@epam/uui-test-utils';
import { PickerModal, PickerModalProps } from '../PickerModal';
import { languageLevels, mockDataSource, mockDataSourceAsync, mockSmallDataSource, mockSmallDataSourceAsync, mockTreeLikeDataSourceAsync, TestItemType } from './mocks';
import { Button, Modals } from '@epam/uui-components';
import { CascadeSelection, UuiContext, useAsyncDataSource } from '@epam/uui-core';
import { act } from 'react-dom/test-utils';

jest.mock('react-popper', () => ({
    ...jest.requireActual('react-popper'),
    Popper: function PopperMock({ children }: any) {
        return children({
            ref: jest.fn,
            update: jest.fn(),
            style: {},
            arrowProps: { ref: jest.fn },
            placement: 'bottom-start',
            isReferenceHidden: false,
        });
    },
}));

const onValueChangeMock = jest.fn();

async function setupPickerModalForTest<TItem = TestItemType, TId = number>(params: Partial<PickerModalProps<TItem, TId>>) {
    const { result, mocks, setProps } = await setupComponentForTest<PickerModalProps<TItem, TId>>(
        (): PickerModalProps<TItem, TId> => {
            console.log('recreate dataSources');
            if (params.selectionMode === 'single') {
                return Object.assign({
                    dataSource: mockDataSourceAsync,
                    disableClear: false,
                    searchPosition: 'input',
                    getName: (item: TestItemType) => item.level,
                    initialValue: params.initialValue as TId,
                    selectionMode: 'single',
                }, params) as PickerModalProps<TItem, TId>;
            }

            return Object.assign({
                dataSource: mockDataSourceAsync,
                disableClear: false,
                searchPosition: 'input',
                getName: (item: TestItemType) => item.level,
                initialValue: params.initialValue as number[],
                selectionMode: 'multi',
            }, params) as PickerModalProps<TItem, TId>;
        },
        (props) => {
            const [initialValue, onValueChange] = useState<any>(props.initialValue);
    
            // const dataSource = useAsyncDataSource(
            //     {
            //         getId: ({ id }) => id, 
            //         api: async () => {
            //             await delay(100);
            //             return languageLevels;
            //         },
            //     },
            //     [],
            // );
            const context = useContext(UuiContext);

            const handleModalOpening = useCallback(() => {
                context.uuiModals
                    .show((modalProps) => {
                        console.log('dataSource 1', props.dataSource);
                        return (
                            <PickerModal
                                { ...modalProps }
                                { ...props }
                                dataSource={ props.dataSource }
                                initialValue={ initialValue }
                            />
                        );
                    })
                    .then((newSelection) => {
                        onValueChange(newSelection as any);
                        onValueChangeMock(newSelection);
                    })
                    .catch(() => {});
            }, [context.uuiModals, initialValue]);

            return (
                <>
                    <Button onClick={ handleModalOpening }></Button>
                    <Modals />
                </>
            );
        },
    );
    const toggler = screen.queryByRole('button') as HTMLElement;

    return {
        setProps,
        result,
        mocks,
        dom: { toggler, container: result.container, target: result.container.firstElementChild as HTMLElement },
    };
}

describe('PickerModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();    
    });
    
    it('should be rendered correctly', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerModal
                key="test"
                valueType="id"
                dataSource={ mockSmallDataSource }
                getName={ (item) => item?.name ?? '' }
                success={ jest.fn }
                abort={ jest.fn }
                zIndex={ 1 }
                selectionMode="single"
                initialValue={ null }
                isActive
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should be rendered correctly with maximum props', async () => {
        const tree = await renderSnapshotWithContextAsync(
            <PickerModal
                key="test"
                valueType="id"
                dataSource={ mockDataSource }
                success={ jest.fn }
                abort={ jest.fn }
                zIndex={ 1 }
                selectionMode="multi"
                initialValue={ [] }
                isActive
                getName={ (item) => item?.level ?? '' }
                filter={ { level: 'A1' } }
                sorting={ { direction: 'desc', field: 'level' } }
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should open body', async () => {
        const { dom, result } = await setupPickerModalForTest({
            selectionMode: 'single',
            dataSource: mockSmallDataSourceAsync,
            getName: ({ name }) => name,
        });

        fireEvent.click(dom.toggler);

        await waitFor(async () => 
            expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

        expect(result.baseElement).toMatchSnapshot();
    });
    
    describe('[selectionMode single]', () => {
        it('[valueType id] should select', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'single',
            });

            // should not be selected if modal was closed and items were not selected
            fireEvent.click(dom.toggler);
            expect(screen.getByRole('modal')).toBeInTheDocument();
            const optionC2_1 = await screen.findByText('C2');
            fireEvent.click(optionC2_1);
            
            await PickerModalTestObject.closeModal();
            expect(screen.queryByRole('modal')).not.toBeInTheDocument();

            fireEvent.click(dom.toggler);
            expect(screen.getByRole('modal')).toBeInTheDocument();
    
            await waitFor(async () => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            expect(await PickerModalTestObject.findSelectedOption({ editMode: 'modal' })).toBeUndefined();
            
            // should be selected and found after next opening the modal
            const optionC2 = await screen.findByText('C2');
            fireEvent.click(optionC2);
            
            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });

            expect(screen.queryByRole('modal')).not.toBeInTheDocument();

            fireEvent.click(dom.toggler);
            expect(screen.getByRole('modal')).toBeInTheDocument();
    
            await waitFor(async () => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            const checkedOption = await PickerModalTestObject.findSelectedOption({ editMode: 'modal' });
            expect(checkedOption).toEqual('C2');
        });
        
        it('[valueType entity] should select', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'single',
                valueType: 'entity',
                getName: ({ level }) => level, 
            });

            // should not be selected if modal was closed and items were not selected
            fireEvent.click(dom.toggler);
            expect(screen.getByRole('modal')).toBeInTheDocument();
            const optionC2_1 = await screen.findByText('C2');
            fireEvent.click(optionC2_1);
            
            await PickerModalTestObject.closeModal();
            expect(screen.queryByRole('modal')).not.toBeInTheDocument();

            fireEvent.click(dom.toggler);
            expect(screen.getByRole('modal')).toBeInTheDocument();
    
            await waitFor(async () => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            expect(await PickerModalTestObject.findSelectedOption({ editMode: 'modal' })).toBeUndefined();
            
            // should be selected and found after next opening the modal
            const optionC2 = await screen.findByText('A1');
            fireEvent.click(optionC2);
            const checkedOption = await PickerModalTestObject.findSelectedOption({ editMode: 'modal' });
            expect(checkedOption).toEqual('A1');

            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });

            expect(screen.queryByRole('modal')).not.toBeInTheDocument();
            // ?? the same about valueType = entity for selectionMode = multi
            // console.log('---------------------- open modal ----------------------');
            fireEvent.click(dom.toggler);
            expect(screen.getByRole('modal')).toBeInTheDocument();
    
            await waitFor(async () => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            const checkedOption1 = await PickerModalTestObject.findSelectedOption({ editMode: 'modal' });
            expect(checkedOption1).toEqual('A1');
        });
        
        it.each<[CascadeSelection]>(
            [[false], [true], ['implicit'], ['explicit']],
        )
        ('should pick single element with cascadeSelection = %s', async (cascadeSelection) => {
            const { dom } = await setupPickerModalForTest({
                getName: ({ name }) => name,
                selectionMode: 'single',
                cascadeSelection,
                dataSource: mockTreeLikeDataSourceAsync,
            });
            fireEvent.click(dom.toggler);
            expect(screen.getByRole('modal')).toBeInTheDocument();

            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            // Check parent
            await PickerModalTestObject.clickOptionByText('Parent 2', { editMode: 'modal' });

            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });

            expect(onValueChangeMock).toHaveBeenLastCalledWith(2);
        });
    });

    describe('[selectionMode multi]', () => {
        it('[valueType id] should select & clear option', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'multi',
            });

            // should not be selected if modal was closed and items were not selected
            fireEvent.click(dom.toggler);
            expect(screen.getByRole('modal')).toBeInTheDocument();
            await PickerModalTestObject.clickOptionCheckbox('A1', { editMode: 'modal' });
            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });
            expect(onValueChangeMock).toHaveBeenLastCalledWith([2]);

            fireEvent.click(dom.toggler);
            await PickerModalTestObject.clickOptionCheckbox('A1+', { editMode: 'modal' });

            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });

            expect(onValueChangeMock).toHaveBeenLastCalledWith([2, 3]);

            fireEvent.click(dom.toggler);
            
            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            expect(await PickerModalTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(['A1', 'A1+']);
            
            await PickerModalTestObject.clickOptionCheckbox('A1+', { editMode: 'modal' });
            expect(await PickerModalTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(['A1']);
        });
        
        it('should pick single element with cascadeSelection = false', async () => {
            const { dom } = await setupPickerModalForTest({
                selectionMode: 'multi',
                cascadeSelection: false,
                dataSource: mockTreeLikeDataSourceAsync,
                getName: ({ name }) => name,
            });
            fireEvent.click(dom.toggler);
            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            expect(await PickerModalTestObject.hasOptions({ editMode: 'modal' })).toBeTruthy();
            await PickerModalTestObject.clickOptionCheckbox('Parent 2', { editMode: 'modal' });

            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });

            expect(onValueChangeMock).toHaveBeenLastCalledWith([2]);
            fireEvent.click(dom.toggler);
              
            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            expect(await PickerModalTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(['Parent 2']);
            expect(await PickerModalTestObject.findUncheckedOptions({ editMode: 'modal' })).toEqual(['Parent 1', 'Parent 3']);
        });
        
        it.each<[CascadeSelection]>(
            [[true], ['explicit']],
        )
        ('should pick multiple elements with cascadeSelection = %s', async (cascadeSelection) => {
            const { dom } = await setupPickerModalForTest({
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection,
                dataSource: mockTreeLikeDataSourceAsync,
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.hasOptions({ editMode: 'modal' })).toBeTruthy();
            // Check parent
            await PickerModalTestObject.clickOptionCheckbox('Parent 2', { editMode: 'modal' });
            // Unfold parent
            await PickerModalTestObject.clickOptionUnfold('Parent 2', { editMode: 'modal' });
            
            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });

            // Test if checkboxes are checked/unchecked
            expect(onValueChangeMock).toHaveBeenLastCalledWith([2, 2.1, 2.2, 2.3]);

            fireEvent.click(dom.toggler);
            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            await PickerModalTestObject.clickOptionUnfold('Parent 2', { editMode: 'modal' });
            expect(await PickerModalTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerModalTestObject.findUncheckedOptions({ editMode: 'modal' })).toEqual(['Parent 1', 'Parent 3']);

            // // Check child
            await PickerModalTestObject.clickOptionCheckbox('Child 2.2', { editMode: 'modal' });            
            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });

            // // Test if checkboxes are checked/unchecked
            expect(onValueChangeMock).toHaveBeenLastCalledWith([2.1, 2.3]);
            fireEvent.click(dom.toggler);
            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            await PickerModalTestObject.clickOptionUnfold('Parent 2', { editMode: 'modal' });
            expect(await PickerModalTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerModalTestObject.findUncheckedOptions({ editMode: 'modal' })).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
        });
        
        it('should pick single element with cascadeSelection = implicit', async () => {
            const { dom } = await setupPickerModalForTest({
                getName: ({ name }) => name,
                selectionMode: 'multi',
                cascadeSelection: 'implicit',
                dataSource: mockTreeLikeDataSourceAsync,
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.hasOptions({ editMode: 'modal' })).toBeTruthy();

            // Check parent
            await PickerModalTestObject.clickOptionCheckbox('Parent 2', { editMode: 'modal' });
            // Unfold parent
            await PickerModalTestObject.clickOptionUnfold('Parent 2', { editMode: 'modal' });
            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });
            expect(onValueChangeMock).toHaveBeenLastCalledWith([2]);

            fireEvent.click(dom.toggler);
            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));
        
            await PickerModalTestObject.clickOptionUnfold('Parent 2', { editMode: 'modal' });
            expect(await PickerModalTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(['Parent 2', 'Child 2.1', 'Child 2.2', 'Child 2.3']);
            expect(await PickerModalTestObject.findUncheckedOptions({ editMode: 'modal' })).toEqual(['Parent 1', 'Parent 3']);

            // Check child
            await PickerModalTestObject.clickOptionCheckbox('Child 2.2', { editMode: 'modal' });
            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });
            // Test if checkboxes are checked/unchecked
            expect(onValueChangeMock).toHaveBeenLastCalledWith([2.1, 2.3]);

            fireEvent.click(dom.toggler);
            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            await PickerModalTestObject.clickOptionUnfold('Parent 2', { editMode: 'modal' });
            expect(await PickerModalTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(['Child 2.1', 'Child 2.3']);
            expect(await PickerModalTestObject.findUncheckedOptions({ editMode: 'modal' })).toEqual(['Parent 1', 'Parent 2', 'Child 2.2', 'Parent 3']);
        });
        
        it('should select all', async () => {
            const { dom } = await setupPickerModalForTest({
                initialValue: [],
                selectionMode: 'multi',
            });

            fireEvent.click(dom.toggler);
            expect(await PickerModalTestObject.hasOptions({ editMode: 'modal' })).toBeTruthy();

            await PickerModalTestObject.clickSelectAllOptions({ editMode: 'modal' });
            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });
            expect(onValueChangeMock).toHaveBeenLastCalledWith([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

            fireEvent.click(dom.toggler);
            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            expect(await PickerModalTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual(
                ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'],
            );

            await PickerModalTestObject.clickClearAllOptions({ editMode: 'modal' });
            await act(async () => {
                await PickerModalTestObject.clickSelectItems();
            });

            fireEvent.click(dom.toggler);
            await waitFor(() => 
                expect(PickerModalTestObject.getOptions({ busy: false, editMode: 'modal' }).length).toBeGreaterThan(0));

            expect(await PickerModalTestObject.findCheckedOptions({ editMode: 'modal' })).toEqual([]);
        });
    });
});
