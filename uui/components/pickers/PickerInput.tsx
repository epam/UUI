import React, { useImperativeHandle, useRef } from 'react';
import { PickerTogglerRenderItemParams, PickerBodyBaseProps, PickerInputBaseProps, PickerTogglerProps, usePickerInput } from '@epam/uui-components';
import { Dropdown } from '../overlays/Dropdown';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { DataRowProps, DataSourceListProps, DataSourceState, DropdownBodyProps, IDropdownToggler, IEditableDebouncer, PickerInputElement, isMobile } from '@epam/uui-core';
import { PickerModal } from './PickerModal';
import { PickerToggler, PickerTogglerMods } from './PickerToggler';
import { MobileDropdownWrapper } from './MobileDropdownWrapper';
import { DataPickerBody } from './DataPickerBody';
import { DataPickerRow, DataPickerRowProps } from './DataPickerRow';
import { DataPickerFooter } from './DataPickerFooter';
import { PickerItem, PickerItemProps } from './PickerItem';
import { settings } from '../../settings';

export type PickerInputProps<TItem, TId> = SizeMod & IHasEditMode & PickerInputBaseProps<TItem, TId> & {
    /**
     * Render callback for picker toggler selection tag
     * If omitted, default `PickerTogglerTag` component will be rendered
     */
    renderTag?: (props: PickerTogglerRenderItemParams<TItem, TId>) => JSX.Element;
};

function PickerInputComponent<TItem, TId>({ highlightSearchMatches = true, ...props }: PickerInputProps<TItem, TId>, ref: React.ForwardedRef<PickerInputElement>) {
    const toggleModalOpening = () => {
        const { renderFooter, rawProps, ...restProps } = props;
        context.uuiModals
            .show((modalProps) => (
                <PickerModal<TItem, TId>
                    { ...restProps }
                    rawProps={ rawProps?.body }
                    { ...modalProps }
                    caption={ getPlaceholder() }
                    initialValue={ props.value as any }
                    renderRow={ renderRow }
                    selectionMode={ props.selectionMode }
                    valueType={ props.valueType }
                />
            ))
            .then((newSelection) => {
                handleSelectionValueChange(newSelection);
            })
            .catch(() => {});
    };

    const {
        view,
        context,
        popperModifiers,
        getName,
        getPlaceholder,
        handleSelectionValueChange,
        getTogglerProps,
        getRows,
        handleTogglerSearchChange,
        toggleBodyOpening,
        dataSourceState,
        getFooterProps,
        getPickerBodyProps,
        getListProps,
        shouldShowBody,
        getSearchPosition,
        closePickerBody,
        openPickerBody,
        handlePickerInputKeyboard,
    } = usePickerInput<TItem, TId, PickerInputProps<TItem, TId>>({ ...props, toggleModalOpening });

    const dropdownRef = useRef(null);

    useImperativeHandle(ref, () => {
        if (dropdownRef.current) {
            dropdownRef.current.closePickerBody = closePickerBody;
            dropdownRef.current.openPickerBody = openPickerBody;
        }

        return dropdownRef.current;
    }, [closePickerBody, openPickerBody]);

    const getTogglerMods = (): PickerTogglerMods => {
        return {
            size: props.size as PickerTogglerMods['size'],
            mode: props.mode ? props.mode : EditMode.FORM,
        };
    };

    const renderTarget = (targetProps: IDropdownToggler & PickerTogglerProps<TItem, TId>) => {
        const renderTargetFn = props.renderToggler || ((props) => <PickerToggler { ...props } />);

        return (
            <IEditableDebouncer
                value={ targetProps.value }
                onValueChange={ handleTogglerSearchChange }
                debounceDelay={ props.searchDebounceDelay }
                render={ (editableProps) => renderTargetFn({
                    ...getTogglerMods(),
                    ...targetProps,
                    ...editableProps,
                    onKeyDown: (e) => handlePickerInputKeyboard(rows, e, editableProps.value),
                }) }
            />
        );
    };

    const renderFooter = () => {
        const footerProps = getFooterProps();

        return props.renderFooter ? props.renderFooter(footerProps) : <DataPickerFooter { ...footerProps } size={ props.size } />;
    };

    const getRowSize = () => {
        if (isMobile()) {
            return settings.sizes.pickerInput.rowSize.mobile;
        }

        return props.editMode === 'modal' ? settings.sizes.pickerInput.rowSize.modal : props.size;
    };

    const getSubtitle = ({ path }: DataRowProps<TItem, TId>, { search }: DataSourceState) => {
        if (!search) return;

        return path
            .map(({ value }) => getName(value))
            .filter(Boolean)
            .join(' / ');
    };

    const renderRowItem = (item: TItem, rowProps: DataRowProps<TItem, TId>, dsState: DataSourceState) => {
        const { flattenSearchResults } = view.getConfig();

        return (
            <PickerItem
                title={ getName(item) }
                size={ getRowSize() as PickerItemProps<any, any>['size'] }
                dataSourceState={ dsState }
                highlightSearchMatches={ highlightSearchMatches }
                { ...(flattenSearchResults ? { subtitle: getSubtitle(rowProps, dataSourceState) } : {}) }
                { ...rowProps }
            />
        );
    };

    const renderRow = (rowProps: DataRowProps<TItem, TId>, dsState: DataSourceState) => {
        return props.renderRow ? (
            props.renderRow(rowProps, dsState)
        ) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                size={ getRowSize() as DataPickerRowProps<any, any>['size'] }
                padding={ (props.editMode === 'modal' ? settings.sizes.pickerInput.rowSize.padding.modal : settings.sizes.pickerInput.rowSize.padding.default) as DataPickerRowProps<any, any>['padding'] }
                renderItem={ (item, itemProps) => renderRowItem(item, itemProps, dsState) }
            />
        );
    };

    const renderBody = (bodyProps: DropdownBodyProps & DataSourceListProps & Omit<PickerBodyBaseProps, 'rows'>, rows: DataRowProps<TItem, TId>[]) => {
        const renderedDataRows = rows.map((row) => renderRow(row, dataSourceState));
        const bodyHeight = isMobile() ? document.documentElement.clientHeight : props.dropdownHeight || settings.sizes.pickerInput.height;
        const minBodyWidth = props.minBodyWidth || settings.sizes.pickerInput.width;

        return (
            <MobileDropdownWrapper
                title={ props.entityName }
                onClose={ () => toggleBodyOpening(false) }
                cx={ [props.bodyCx] }
                onKeyDown={ bodyProps.onKeyDown }
                width={ bodyProps.togglerWidth > minBodyWidth ? bodyProps.togglerWidth : minBodyWidth }
                focusLock={ getSearchPosition() === 'body' }
            >
                <DataPickerBody
                    { ...bodyProps }
                    rows={ renderedDataRows }
                    maxHeight={ bodyHeight }
                    searchSize={ props.size }
                    editMode="dropdown"
                    selectionMode={ props.selectionMode }
                    renderNotFound={
                        props.renderNotFound
                            ? () =>
                                props.renderNotFound({
                                    search: dataSourceState.search,
                                    onClose: () => toggleBodyOpening(false),
                                })
                            : undefined
                    }
                />
                { renderFooter() }
            </MobileDropdownWrapper>
        );
    };

    const rows = getRows();
    const renderItem = props.renderTag ? props.renderTag : null;

    return (
        <Dropdown
            renderTarget={ (dropdownProps) => {
                const targetProps = getTogglerProps();
                return renderTarget({ ...dropdownProps, ...targetProps, renderItem });
            } }
            renderBody={ (bodyProps) => renderBody({ ...bodyProps, ...getPickerBodyProps(rows), ...getListProps() }, rows) }
            value={ shouldShowBody() }
            onValueChange={ !props.isDisabled && toggleBodyOpening }
            placement={ props.dropdownPlacement }
            modifiers={ popperModifiers }
            closeBodyOnTogglerHidden={ !isMobile() }
            portalTarget={ props.portalTarget }
            ref={ dropdownRef }
        />
    );
}

export const PickerInput = React.forwardRef(PickerInputComponent) as <TItem, TId>(
    props: PickerInputProps<TItem, TId>,
    ref: React.ForwardedRef<PickerInputElement>
) => JSX.Element;
