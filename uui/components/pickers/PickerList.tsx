import React from 'react';
import { DataRowProps, IClickable, IDisableable, IHasCaption, IHasPlaceholder, Overwrite } from '@epam/uui-core';
import { PickerListBaseProps, PickerModalOptions, usePickerList } from '@epam/uui-components';
import { SizeMod } from '../types';
import { Text } from '../typography';
import { PickerListItem } from './PickerListItem';
import { PickerModal } from './PickerModal';
import { LinkButton } from '../buttons';
import css from './PickerList.module.scss';
import cx from 'classnames';

export interface PickerListModsOverride {}

interface PickerListMods extends SizeMod {}

export type PickerListProps<TItem, TId> = Overwrite<PickerListMods, PickerListModsOverride> &
IHasPlaceholder &
PickerModalOptions<TItem, TId> & {
    renderModalToggler?(props: IClickable & IHasCaption & IDisableable, selection: DataRowProps<TItem, TId>[]): React.ReactNode;
    noOptionsMessage?: React.ReactNode;
} & PickerListBaseProps<TItem, TId>;

export function PickerList<TItem, TId>(props: PickerListProps<TItem, TId>) {
    const {
        context,
        view,
        onlySelectedView,
        getName,
        getEntityName,
        appendLastSelected,
        getSelectedIdsArray,
        buildRowsList,
        getMaxDefaultItems,
        dataSourceState,
        getModalTogglerCaption,
    } = usePickerList<TItem, TId, PickerListProps<TItem, TId>>(props);

    const defaultRenderRow = (row: DataRowProps<TItem, TId>) => {
        return <PickerListItem getName={ (item) => getName(item) } { ...row } key={ row.rowKey } />;
    };

    const handleShowPicker = () => {
        context.uuiModals
            .show((modalProps) => (
                <PickerModal<TItem, TId>
                    { ...modalProps }
                    { ...props }
                    caption={ props.placeholder || `Please select ${getEntityName() ? getEntityName() : ''}` }
                    initialValue={ props.value as any }
                    selectionMode={ props.selectionMode }
                    valueType={ props.valueType }
                />
            ))
            .then((value: any) => {
                appendLastSelected([...getSelectedIdsArray(value)]);
                props.onValueChange(value);
            })
            .catch(() => {});
    };

    const defaultRenderToggler = (props: IClickable) => <LinkButton caption="Show all" { ...props } />;

    const viewProps = view.getListProps();
    const selectedRows = onlySelectedView.getVisibleRows();
    const rows = buildRowsList();
    const showPicker = viewProps.totalCount == null || viewProps.totalCount > getMaxDefaultItems();
    const renderToggler = props.renderModalToggler || defaultRenderToggler;
    const renderRow = props.renderRow || defaultRenderRow;

    return (
        <div className={ cx('uui-picker-list', css.root) }>
            {!rows.length
                && (props.noOptionsMessage || (
                    <Text color="secondary" size={ props.size }>
                        No options available
                    </Text>
                ))}
            {rows.map((row) => renderRow({ ...row, isDisabled: props.isDisabled }, dataSourceState))}
            {showPicker
                && renderToggler(
                    {
                        onClick: handleShowPicker,
                        caption: getModalTogglerCaption(viewProps.totalCount, view.getSelectedRowsCount()),
                        isDisabled: props.isDisabled,
                    },
                    selectedRows,
                )}
        </div>
    );
}
