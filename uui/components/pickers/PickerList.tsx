import React from 'react';
import cx from 'classnames';
import { DataRowProps, IClickable, IDisableable, IHasCaption, IHasPlaceholder, Overwrite } from '@epam/uui-core';
import { PickerListBaseProps, PickerModalOptions, usePickerList } from '@epam/uui-components';
import { SizeMod } from '../types';
import { Text } from '../typography';
import { PickerListRow } from './PickerListRow';
import { PickerModal } from './PickerModal';
import { LinkButton } from '../buttons';

import css from './PickerList.module.scss';

export interface PickerListModsOverride {}

interface PickerListMods extends SizeMod {}

export type PickerListProps<TItem, TId> = Overwrite<PickerListMods, PickerListModsOverride> &
IHasPlaceholder & PickerModalOptions<TItem, TId> & PickerListBaseProps<TItem, TId> & {
    renderModalToggler?(props: IClickable & IHasCaption & IDisableable, selection: DataRowProps<TItem, TId>[]): React.ReactNode;
    noOptionsMessage?: React.ReactNode;
};

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
        getModalTogglerCaption,
    } = usePickerList<TItem, TId, PickerListProps<TItem, TId>>(props);

    const defaultListRenderRow = (row: DataRowProps<TItem, TId>) => {
        return <PickerListRow getName={ (item) => getName(item) } { ...row } key={ row.rowKey } />;
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
    const renderRow = props.renderListRow || defaultListRenderRow;

    return (
        <div className={ cx('uui-picker-list', css.root) }>
            {!rows.length
                && (props.noOptionsMessage || (
                    <Text color="secondary" size={ props.size }>
                        No options available
                    </Text>
                ))}
            {rows.map((row) => renderRow({ ...row, isDisabled: props.isDisabled }))}
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
