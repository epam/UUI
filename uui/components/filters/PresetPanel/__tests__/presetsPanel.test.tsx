import React from 'react';
import {
    renderSnapshotWithContextAsync,
    renderWithContextAsync,
    screen,
    within,
    fireEvent,
    mockAdaptivePanelLayout,
    waitForElementToBeRemoved,
} from '@epam/uui-test-utils';
import { PresetsPanel, PresetsPanelProps } from '../PresetsPanel';
import {
    ColumnsConfig, DataTableState, FiltersConfig, ITablePreset,
} from '@epam/uui-core';

async function openTabMenuAndClickOption(tab: HTMLElement, optionToClick: string) {
    const btn = within(tab).getByRole('button');
    fireEvent.click(btn);
    const dialog = await screen.findByRole('dialog');
    const items = within(dialog).getAllByRole('menuitem');
    const opt = items.map((item) => within(item).queryByText(optionToClick)).find((e) => !!e);
    if (opt) {
        fireEvent.mouseDown(opt);
        fireEvent.click(opt);
    }
}
async function expectPresetTabHasOptions(tab: HTMLElement, expectedOptions: string[]) {
    const btn = within(tab).getByRole('button');
    /** 
     * Dropdown is closing on mousedown event.
     * But testing-library is not firing that event while calling `fireEvent.click(elem)`.
     */
    fireEvent.mouseDown(btn);
    fireEvent.click(btn);
    const dialog = await screen.findByRole('dialog');
    const items = within(dialog).getAllByRole('menuitem');
    expect(items.length).toBe(expectedOptions.length);
    items.forEach((elem, i) => {
        expect(elem).toHaveTextContent(expectedOptions[i]);
    });
}
async function setupPresetsPanel({ hasPresetChanged }: Partial<PresetsPanelProps> = {}) {
    const mocks = {
        createNewPreset: jest.fn(),
        duplicatePreset: jest.fn(),
        updatePreset: jest.fn(),
        deletePreset: jest.fn(),
        choosePreset: jest.fn(),
        getPresetLink: jest.fn(),
    };
    type TestViewStateType = {
        thisIsATest: string;
    };
    type TestFilterType = {
        status: number;
    };
    const columnsConfig: ColumnsConfig = {
        name: { width: 100, isVisible: true, order: 'a' },
        status: { width: 100, isVisible: true, order: 'b' },
    };
    const initialPresets: ITablePreset<TestFilterType, TestViewStateType>[] = [
        {
            id: -1,
            name: 'All items',
            order: 'a',
            isReadonly: true,
        }, {
            id: -2,
            name: 'Items with green status',
            order: 'b',
            filter: { status: 1 },
        }, {
            id: -3,
            name: 'Items with red status',
            order: 'c',
            filter: { status: 2 },
        },
    ];
    const filtersConfig: FiltersConfig<TestFilterType> = {
        status: {
            isVisible: true,
            order: 'c',
        },
    };
    const panelPropsTableState: DataTableState<TestFilterType, TestViewStateType> = {
        filtersConfig,
        columnsConfig,
    };
    const panelProps: PresetsPanelProps = {
        tableState: panelPropsTableState,
        activePresetId: -2,
        choosePreset: mocks.choosePreset,
        createNewPreset: mocks.createNewPreset,
        duplicatePreset: mocks.duplicatePreset,
        hasPresetChanged: hasPresetChanged || jest.fn(),
        updatePreset: mocks.updatePreset,
        deletePreset: mocks.deletePreset,
        getPresetLink: mocks.getPresetLink,
        presets: initialPresets,
        rawProps: {
            'data-testid': 'presets-panel',
        },
    };
    const result = await renderWithContextAsync(<PresetsPanel { ...panelProps } />);
    const tabs = await screen.findAllByRole('tab');
    const dom = {
        tabs,
    };
    return {
        result,
        mocks,
        dom,
    };
}

describe('PresetsPanel', () => {
    it('should render with minimum props', async () => {
        const component = await renderSnapshotWithContextAsync(
            <PresetsPanel
                activePresetId={ 1 }
                choosePreset={ jest.fn() }
                createNewPreset={ jest.fn() }
                tableState={ {} }
                hasPresetChanged={ jest.fn() }
                duplicatePreset={ jest.fn() }
                deletePreset={ jest.fn() }
                updatePreset={ jest.fn() }
                getPresetLink={ jest.fn() }
                presets={ [] }
            />,
        );
        expect(component).toMatchSnapshot();
    });

    it('should render presets panel with all tabs and options', async () => {
        const {
            dom: { tabs },
        } = await setupPresetsPanel();
        // 1. check that it's rendered and active element is correct
        expect(tabs.length).toBe(3);
        expect(tabs[0]).toHaveTextContent('All items');
        expect(tabs[1]).toHaveTextContent('Items with green status');
        expect(tabs[1]).toHaveClass('activePreset');
        expect(tabs[2]).toHaveTextContent('Items with red status');
        const addPresetBtn = screen.queryByText('Add Preset');
        expect(addPresetBtn).toBeInTheDocument();
        // 2. check that menu of each tab contains correct options
        await expectPresetTabHasOptions(tabs[0], ['Duplicate', 'Copy Link']);
        await expectPresetTabHasOptions(tabs[1], [
            'Rename', 'Duplicate', 'Copy Link', 'Delete',
        ]);
        await expectPresetTabHasOptions(tabs[2], [
            'Duplicate', 'Copy Link', 'Delete',
        ]);
    });

    it('should create new preset using "Add preset" button', async () => {
        const { mocks } = await setupPresetsPanel();
        const addPresetBtn = screen.queryByText('Add Preset');

        fireEvent.click(addPresetBtn);
        expect(screen.queryByText('Add Preset')).not.toBeInTheDocument();
        const presetInput = screen.queryByRole('textbox');
        expect(presetInput).toBeInTheDocument();
        fireEvent.change(presetInput, { target: { value: 'New preset' } });
        const [first, second] = await within(presetInput.parentElement).findAllByRole('button');
        expect(first).toHaveClass('uui-icon-accept');
        expect(second).toHaveClass('uui-icon-cancel');
        fireEvent.click(first);
        expect(mocks.createNewPreset).toHaveBeenCalledWith('New preset');
        await waitForElementToBeRemoved(() => screen.queryByRole('textbox'));
    });

    it('should create new preset using "Duplicate" button', async () => {
        const {
            mocks,
            dom: { tabs },
        } = await setupPresetsPanel();
        await openTabMenuAndClickOption(tabs[1], 'Duplicate');
        expect(mocks.duplicatePreset).toHaveBeenCalledWith({
            filter: { status: 1 },
            id: -2,
            name: 'Items with green status',
            order: 'b',
        });
    });

    it('should delete preset using "Delete" button', async () => {
        const {
            mocks,
            dom: { tabs },
        } = await setupPresetsPanel();
        await openTabMenuAndClickOption(tabs[1], 'Delete');
        expect(mocks.deletePreset).toHaveBeenCalledWith({
            filter: { status: 1 },
            id: -2,
            name: 'Items with green status',
            order: 'b',
        });
    });

    it('should rename preset using "Rename" button', async () => {
        const {
            mocks,
            dom: { tabs },
        } = await setupPresetsPanel();
        await openTabMenuAndClickOption(tabs[1], 'Rename');
        const input = await screen.findByRole('textbox');
        expect(input).toHaveValue('Items with green status');
        const [first, second] = await within(input.parentElement).findAllByRole('button');
        expect(first).toHaveClass('uui-icon-accept');
        expect(second).toHaveClass('uui-icon-cancel');
        fireEvent.change(input, { target: { value: 'This is new name' } });
        fireEvent.click(first);
        expect(mocks.updatePreset).toHaveBeenCalledWith({
            filter: { status: 1 },
            id: -2,
            name: 'This is new name',
            order: 'b',
        });
        await waitForElementToBeRemoved(() => screen.queryByRole('textbox'));
    });

    it('should copy link using "Copy Link" button', async () => {
        const {
            mocks,
            dom: { tabs },
        } = await setupPresetsPanel();
        await openTabMenuAndClickOption(tabs[1], 'Copy Link');
        expect(mocks.getPresetLink).toHaveBeenCalledWith({
            filter: { status: 1 },
            id: -2,
            name: 'Items with green status',
            order: 'b',
        });
    });

    it('should choose another preset by click on it', async () => {
        const {
            mocks,
            dom: { tabs },
        } = await setupPresetsPanel();
        fireEvent.click(tabs[2]);
        expect(mocks.choosePreset).toHaveBeenCalledWith({
            filter: { status: 2 },
            id: -3,
            name: 'Items with red status',
            order: 'c',
        });
    });

    it('should mark modified preset with special css class and extra options should become available', async () => {
        const {
            dom: { tabs },
        } = await setupPresetsPanel({
            hasPresetChanged: (preset: ITablePreset) => preset.id === -2,
        });
        expect(tabs[1]).toHaveClass('uui-has-right-icon');
        await expectPresetTabHasOptions(tabs[1], [
            'Save in current', 'Save as new', 'Discard all changes', 'Rename', 'Duplicate', 'Copy Link', 'Delete',
        ]);
    });

    it('should save modified preset', async () => {
        const {
            mocks,
            dom: { tabs },
        } = await setupPresetsPanel({
            hasPresetChanged: (preset: ITablePreset) => preset.id === -2,
        });
        await openTabMenuAndClickOption(tabs[1], 'Save in current');
        expect(mocks.updatePreset).toHaveBeenCalledWith({
            columnsConfig: {
                name: {
                    isVisible: true,
                    order: 'a',
                    width: 100,
                },
                status: {
                    isVisible: true,
                    order: 'b',
                    width: 100,
                },
            },
            filtersConfig: {
                status: {
                    isVisible: true,
                    order: 'c',
                },
            },
            id: -2,
            name: 'Items with green status',
            order: 'b',
        });
    });

    it('should save modified preset as current', async () => {
        const {
            mocks,
            dom: { tabs },
        } = await setupPresetsPanel({
            hasPresetChanged: (preset: ITablePreset) => preset.id === -2,
        });
        await openTabMenuAndClickOption(tabs[1], 'Save in current');
        expect(mocks.updatePreset).toHaveBeenCalledWith({
            columnsConfig: {
                name: {
                    isVisible: true,
                    order: 'a',
                    width: 100,
                },
                status: {
                    isVisible: true,
                    order: 'b',
                    width: 100,
                },
            },
            filtersConfig: {
                status: {
                    isVisible: true,
                    order: 'c',
                },
            },
            id: -2,
            name: 'Items with green status',
            order: 'b',
        });
    });

    it('should save modified preset as new', async () => {
        const {
            mocks,
            dom: { tabs },
        } = await setupPresetsPanel({
            hasPresetChanged: (preset: ITablePreset) => preset.id === -2,
        });
        await openTabMenuAndClickOption(tabs[1], 'Save as new');
        const presetInput = screen.queryByRole('textbox');
        expect(presetInput).toBeInTheDocument();
        fireEvent.change(presetInput, { target: { value: 'New preset' } });
        const [first, second] = await within(presetInput.parentElement).findAllByRole('button');
        expect(first).toHaveClass('uui-icon-accept');
        expect(second).toHaveClass('uui-icon-cancel');
        fireEvent.click(first);
        expect(mocks.createNewPreset).toHaveBeenCalledWith('New preset');
        await waitForElementToBeRemoved(() => screen.queryByRole('textbox'));
    });

    it('should cancel saving modified preset as new', async () => {
        const {
            dom: { tabs },
        } = await setupPresetsPanel({
            hasPresetChanged: (preset: ITablePreset) => preset.id === -2,
        });
        await openTabMenuAndClickOption(tabs[1], 'Save as new');
        const presetInput = screen.queryByRole('textbox');
        expect(presetInput).toBeInTheDocument();
        fireEvent.change(presetInput, { target: { value: 'New preset' } });
        const [first, second] = await within(presetInput.parentElement).findAllByRole('button');
        expect(first).toHaveClass('uui-icon-accept');
        expect(second).toHaveClass('uui-icon-cancel');
        fireEvent.click(second);
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('should render presets panel with hidden items in collapsed container (the active item is not hidden)', async () => {
        mockAdaptivePanelLayout({
            isAdaptivePanelRoot: (elem) => {
                const p = elem.parentElement?.parentElement;
                if (p && p.getAttribute('data-testid') === 'presets-panel') {
                    return true;
                }
            },
            width: 50,
            itemWidth: 15,
        });
        const {
            dom: { tabs },
        } = await setupPresetsPanel();
        expect(tabs.length).toBe(1);

        const btn = screen.queryByText('2 more');
        fireEvent.click(btn);

        const items = screen.queryAllByRole('menuitem');
        expect(items.length).toBe(2);
        expect(items[0]).toHaveTextContent('All items');
        expect(items[1]).toHaveTextContent('Items with red status');
    });
});
