import * as React from 'react';
import { DataRowProps, DataSourceListProps, DataSourceState, DropdownBodyProps, isMobile, PickerFilterConfig, usePrevious, PickerInputBaseProps } from '@epam/uui-core';
import { PickerBodyBaseProps, usePickerInput } from '@epam/uui-components';
import { DataPickerRow, PickerItem, DataPickerBody, DataPickerFooter, PickerInputProps, PickerItemProps, DataPickerRowProps, DataPickerFooterProps, DataPickerBodyProps } from '../pickers';
import { settings } from '../../settings';

const pickerHeight = 300;

type FilterPickerBodyProps<TItem, TId> = DropdownBodyProps & PickerInputBaseProps<TItem, TId> & PickerFilterConfig<any> & {
    showSearch?: boolean;
};

export function FilterPickerBody<TItem, TId>({
    highlightSearchMatches = true,
    ...restProps
}: FilterPickerBodyProps<TItem, TId>) {
    const props = { ...restProps, highlightSearchMatches };

    const shouldShowBody = () => props.isOpen;

    const {
        view,
        getName,
        isSingleSelect,
        getRows,
        dataSourceState,
        getFooterProps,
        getPickerBodyProps,
        getListProps,
        handleDataSourceValueChange,
    } = usePickerInput<TItem, TId, PickerInputProps<TItem, TId>>({ ...props, shouldShowBody });

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

    const getSubtitle = ({ path }: DataRowProps<TItem, TId>, { search }: DataSourceState) => {
        if (!search) return;

        return path
            .map(({ value }) => getName(value))
            .filter(Boolean)
            .join(' / ');
    };

    const renderItem = (item: TItem, rowProps: DataRowProps<TItem, TId>, dsState?: DataSourceState) => {
        const { flattenSearchResults } = view.getConfig();

        return (
            <PickerItem
                title={ getName(item) }
                highlightSearchMatches={ highlightSearchMatches }
                { ...(flattenSearchResults ? { subtitle: getSubtitle(rowProps, dsState) } : {}) }
                dataSourceState={ dsState }
                size={ settings.sizes.filtersPanel.pickerInput.body.default as PickerItemProps<any, any>['size'] }
                { ...rowProps }
            />
        );
    };

    const onSelect = (row: DataRowProps<TItem, TId>) => {
        handleDataSourceValueChange((currentDataSourceState) => ({ ...currentDataSourceState, search: '', selectedId: row.id }));
    };

    const renderRow = (rowProps: DataRowProps<TItem, TId>, dsState: DataSourceState) => {
        if (rowProps.isSelectable && isSingleSelect() && props.editMode !== 'modal') {
            rowProps.onSelect = onSelect;
        }
        return props.renderRow ? (
            props.renderRow(rowProps, dataSourceState)
        ) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                size={ settings.sizes.filtersPanel.pickerInput.body.default as DataPickerRowProps<any, any>['size'] }
                padding="12"
                renderItem={ (item, itemProps) => renderItem(item, itemProps, dsState) }
            />
        );
    };

    const renderFooter = () => {
        const footerProps = getFooterProps();

        return props.renderFooter ? props.renderFooter(footerProps) : <DataPickerFooter { ...footerProps } size={ settings.sizes.filtersPanel.pickerInput.body.default as DataPickerFooterProps<any, any>['size'] } />;
    };

    const renderBody = (bodyProps: DataSourceListProps & Omit<PickerBodyBaseProps, 'rows'>, rows: DataRowProps<TItem, TId>[]) => {
        const renderedDataRows = rows.map((props) => renderRow(props, dataSourceState));
        const maxHeight = isMobile() ? document.documentElement.clientHeight : props.maxBodyHeight || pickerHeight;
        const maxWidth = isMobile() ? undefined : 360;

        return (
            <>
                <DataPickerBody
                    { ...bodyProps }
                    selectionMode={ props.selectionMode }
                    rows={ renderedDataRows }
                    maxHeight={ maxHeight }
                    maxWidth={ maxWidth }
                    searchSize={ settings.sizes.filtersPanel.pickerInput.body.default as DataPickerBodyProps['searchSize'] }
                    editMode="dropdown"
                />
                {renderFooter()}
            </>
        );
    };

    const rows = getRows();

    return renderBody({ ...getPickerBodyProps(rows), ...getListProps(), showSearch: props.showSearch ?? true }, rows);
}
