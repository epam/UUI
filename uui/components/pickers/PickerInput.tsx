import React, { useContext, useImperativeHandle, useMemo, useRef } from 'react';
import {
    DropdownBodyProps, IDropdownToggler, IEditableDebouncer, PickerInputElement, isMobile, Overwrite,
    PickerInputBaseProps, UuiContext, mobilePopperModifier,
} from '@epam/uui-core';
import { PickerTogglerRenderItemParams, PickerTogglerProps, usePickerInput } from '@epam/uui-components';
import { Dropdown } from '../overlays/Dropdown';
import { PickerModal } from './PickerModal';
import { PickerToggler, PickerTogglerMods } from './PickerToggler';
import { PickerBodyMobileView } from './PickerBodyMobileView';
import { DataPickerBody } from './DataPickerBody';
import { DataPickerFooter } from './DataPickerFooter';
import { EditMode, IHasEditMode, SizeMod } from '../types';
import { settings } from '../../settings';
import { Modifier } from 'react-popper';

export interface PickerInputModsOverride {}

interface PickerInputMods extends SizeMod {}

export type PickerInputProps<TItem, TId> = Overwrite<PickerInputMods, PickerInputModsOverride> & IHasEditMode & PickerInputBaseProps<TItem, TId> & {
    /**
     * Render callback for picker toggler selection tag
     * If omitted, default `PickerTogglerTag` component will be rendered
     */
    renderTag?: (props: PickerTogglerRenderItemParams<TItem, TId>) => JSX.Element;

    /** Replaces default 'toggler' - an input to which Picker attaches dropdown */
    renderToggler?: (props: PickerTogglerProps<TItem, TId>) => React.ReactNode;
};

function PickerInputComponent<TItem, TId>(props: PickerInputProps<TItem, TId>, ref: React.ForwardedRef<PickerInputElement>) {
    const context = useContext(UuiContext);

    const popperModifiers: Modifier<any>[] = useMemo(() => [
        {
            name: 'offset',
            options: { offset: [0, 6] },
        }, mobilePopperModifier,
    ], []);

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
        getName,
        getPlaceholder,
        handleSelectionValueChange,
        getTogglerProps,
        getRows,
        handleTogglerSearchChange,
        toggleBodyOpening,
        dataSourceState,
        handleDataSourceValueChange,
        getFooterProps,
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
            size: props.size,
            mode: props.mode ? props.mode : EditMode.FORM,
        };
    };

    const rows = getRows();

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

        return props.renderFooter
            ? props.renderFooter(footerProps)
            : <DataPickerFooter { ...footerProps } size={ props.size || settings.pickerInput.sizes.body.row } />;
    };

    const renderBody = (dropdownProps: DropdownBodyProps) => {
        const bodyHeight = isMobile() ? document.documentElement.clientHeight : props.dropdownHeight || settings.pickerInput.sizes.body.maxHeight;
        const minBodyWidth = props.minBodyWidth || settings.pickerInput.sizes.body.minWidth;

        const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => handlePickerInputKeyboard(rows, e);

        return (
            <PickerBodyMobileView
                title={ props.entityName }
                onClose={ () => toggleBodyOpening(false) }
                cx={ [props.bodyCx, 'uui-picker_input-body-wrapper'] }
                onKeyDown={ onKeyDown }
                width={ dropdownProps.togglerWidth > minBodyWidth ? dropdownProps.togglerWidth : minBodyWidth }
                focusLock={ getSearchPosition() === 'body' }
            >
                <DataPickerBody
                    { ...dropdownProps }
                    { ...getListProps() }
                    showSearch={ getSearchPosition() === 'body' }
                    getName={ getName }
                    value={ dataSourceState }
                    onValueChange={ handleDataSourceValueChange }
                    rows={ rows }
                    maxHeight={ bodyHeight }
                    searchSize={ props.size }
                    selectionMode={ props.selectionMode }
                    renderNotFound={ props.renderNotFound }
                    renderEmpty={ props.renderEmpty }
                    renderRow={ props.renderRow }
                    onKeyDown={ onKeyDown }
                    minCharsToSearch={ props.minCharsToSearch }
                    fixedBodyPosition={ props.fixedBodyPosition }
                    searchDebounceDelay={ props.searchDebounceDelay }
                    rawProps={ props.rawProps?.body }
                    highlightSearchMatches={ props.highlightSearchMatches }
                    flattenSearchResults={ view.getConfig().flattenSearchResults }
                />
                { renderFooter() }
            </PickerBodyMobileView>
        );
    };

    const renderItem = props.renderTag ? props.renderTag : null;
    return (
        <Dropdown
            renderTarget={ (dropdownProps) => {
                const targetProps = getTogglerProps();
                return renderTarget({ ...dropdownProps, ...targetProps, renderItem });
            } }
            renderBody={ (bodyProps) => renderBody(bodyProps) }
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

export const PickerInput = React.forwardRef(PickerInputComponent) as
    <TItem, TId>(props: PickerInputProps<TItem, TId> & { ref?: React.ForwardedRef<PickerInputElement> }) => ReturnType<typeof PickerInputComponent>;
