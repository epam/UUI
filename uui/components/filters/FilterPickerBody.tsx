import * as React from 'react';
import {
    DropdownBodyProps,
    isMobile,
    PickerFilterConfig,
    usePrevious,
    PickerInputBaseProps,
    DataSourceState,
} from '@epam/uui-core';
import { handleDataSourceKeyboard, usePickerApi, useShowSelected } from '@epam/uui-components';
import { DataPickerBody, DataPickerFooter } from '../pickers';
import { settings } from '../../settings';
import { useState } from 'react';

const pickerHeight = 300;

type FilterPickerBodyProps<TItem, TId> = DropdownBodyProps & PickerInputBaseProps<TItem, TId> & PickerFilterConfig<any> & {
    showSearch?: boolean;
};

export function FilterPickerBody<TItem, TId>({
    highlightSearchMatches = true,
    ...restProps
}: FilterPickerBodyProps<TItem, TId>) {
    const props = { ...restProps, highlightSearchMatches };

    const [dsState, setDsState] = useState<DataSourceState>({
        focusedIndex: 0,
        topIndex: 0,
        visibleCount: 20,
        checked: [],
    });

    const { showSelected, setShowSelected } = useShowSelected({ dataSourceState: dsState });

    const {
        view,
        getName,
        dataSourceState,
        getListProps,
        handleDataSourceValueChange,
        clearSelection,
    } = usePickerApi<TItem, TId>({ ...props, dataSourceState: dsState, setDataSourceState: setDsState, showSelectedOnly: showSelected });

    const prevValue = usePrevious(props.value);
    const prevOpened = usePrevious(props.isOpen);

    React.useLayoutEffect(() => {
        if (prevOpened === props.isOpen && props.isOpen
            && prevValue !== props.value && props.value !== props.emptyValue
            && props.selectionMode === 'single'
        ) {
            props.onClose();
        }
    }, [props.value]);

    const renderFooter = () => {
        const footerProps = {
            view,
            showSelected: {
                value: showSelected,
                onValueChange: setShowSelected,
            },
            clearSelection,
            selectionMode: props.selectionMode,
            selection: props.value,
            search: dataSourceState.search,
        };

        return props.renderFooter
            ? props.renderFooter(footerProps)
            : <DataPickerFooter { ...footerProps } size={ settings.pickerInput.sizes.body.row } />;
    };

    const renderBody = () => {
        const rows = view.getVisibleRows();
        const maxHeight = isMobile() ? document.documentElement.clientHeight : props.maxBodyHeight || pickerHeight;
        const maxWidth = isMobile() ? undefined : 360;

        const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => handleDataSourceKeyboard({
            value: dataSourceState,
            onValueChange: handleDataSourceValueChange,
            listView: view,
            searchPosition: 'body',
            rows,
        }, e);

        return (
            <>
                <DataPickerBody
                    { ...getListProps() }
                    selectionMode={ props.selectionMode }
                    rows={ rows }
                    maxHeight={ maxHeight }
                    maxWidth={ maxWidth }
                    searchSize={ settings.pickerInput.sizes.body.row }
                    showSearch={ props.showSearch ?? true }
                    getName={ getName }
                    value={ dataSourceState }
                    onValueChange={ handleDataSourceValueChange }
                    renderRow={ props.renderRow }
                    onKeyDown={ onKeyDown }
                    minCharsToSearch={ props.minCharsToSearch }
                    searchDebounceDelay={ props.searchDebounceDelay }
                    rawProps={ props.rawProps?.body }
                    highlightSearchMatches={ props.highlightSearchMatches }
                    flattenSearchResults={ view.getConfig().flattenSearchResults }
                />
                {renderFooter()}
            </>
        );
    };

    return renderBody();
}
