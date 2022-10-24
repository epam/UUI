import * as styles from "./ColumnsConfigurationModal.scss";
import * as React from "react";
//
import { ColumnsConfig, cx, DataColumnProps, DndActorRenderParams, IModal } from "@epam/uui-core";
import { DragHandle } from "@epam/uui-components";
import { ReactComponent as MenuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { ReactComponent as ResetIcon } from '@epam/assets/icons/common/action-update-18.svg';
//
import { Dropdown, DropdownMenuButton, ModalBlocker, ModalFooter, ModalHeader, ModalWindow } from "../../overlays";
import { FlexRow, FlexSpacer, Panel, ScrollBars } from "../../layout";
import { Button, LinkButton } from "../../buttons";
import { Checkbox, SearchInput } from "../../inputs";
import { DropMarker } from "../../dnd";
import { i18n } from '../../../i18n';
//
import { useColumnsConfigurationState } from "@epam/uui-components";
import { PinIconButton } from "./PinIconButton";
import { useCallback } from "react";

const i18nLocal = i18n.tables.columnsConfigurationModal;
const returnByCondition = <T, F>(condition: boolean, ifTrue: T, ifFalse: F) => {
    return condition ? ifTrue : ifFalse;
};

interface IColumnsConfigView<TItem, TId, TFilter> {
    modalProps: IModal<ColumnsConfig>;
    columnsConfig: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
}

export function ColumnsConfigurationModal<TItem, TId, TFilter>(props: IColumnsConfigView<TItem, TId, TFilter>) {
    const { modalProps, columns, columnsConfig, defaultConfig } = props;

    const renderRowContent = (
        props: { dndActorParams: DndActorRenderParams, column: DataColumnProps<TItem, TId>, isDndAllowed: boolean, isPinnedAlways: boolean },
    ) => {
        const {
            column,
            isDndAllowed,
            dndActorParams,
            isPinnedAlways,
        } = props;
        const cfg = columnsConfigLocal[column.key];
        const isSelected = cfg.isVisible;
        const isPinned = cfg.fix || isPinnedAlways;
        const wrapperClasses = cx(
            styles.rowWrapper,
            !isPinned && styles.notPinned,
            isDndAllowed && styles.dndAllowed,
            ...returnByCondition(isDndAllowed, dndActorParams.classNames, []),
        );
        const { onTouchStart, onPointerDown, ...restEventHandlers } = dndActorParams.eventHandlers;
        const wrapperAttrs = {
            className: wrapperClasses,
            ...returnByCondition(isDndAllowed, { ref: dndActorParams.ref }, {}),
            ...returnByCondition(isDndAllowed, restEventHandlers, {}),
        };
        const dragHandleAttrs = {
            className: styles.dragHandleWrapper,
            ...returnByCondition(isDndAllowed, { onTouchStart, onPointerDown }, {}),
        };

        return (
            <div { ...wrapperAttrs }>
                <div className={ styles.rowWrapperContent }>
                    <FlexRow background="white" spacing='6' cx={ styles.title }>
                        <span { ...dragHandleAttrs }><DragHandle cx={ styles.dragHandle } /></span>
                        <Checkbox
                            key={ column.key }
                            label={ column.caption }
                            value={ isSelected }
                            onValueChange={ () => toggleVisibility(column.key) }
                            isDisabled={ column.isAlwaysVisible || !!column.fix }
                        />
                    </FlexRow>
                    <PinIconButton
                        id={ column.key }
                        isPinned={ !!isPinned }
                        canUnpin={ !isPinnedAlways }
                        onTogglePin={ togglePin }
                    />
                </div>
                <DropMarker { ...dndActorParams } />
            </div>
        );
    };

    const {
        // props
        byGroup, isNoData, filterValue, columnsConfigLocal,
        // methods
        reset, apply, checkAll, togglePin, renderRows, uncheckAll, setFilterValue, toggleVisibility,
    } = useColumnsConfigurationState({ columnsConfig, columns, modalProps, defaultConfig, renderRowContent });

    const renderSectionTitle = (title: string, amount: number) => <div className={ styles.sectionTitle }>
        <span className={ styles.title }>{ title }</span>
        <span className={ styles.amount }>{ amount }</span>
    </div>;

    const renderVisible = () => {
        const amountPinned = byGroup.DISPLAYED_PINNED?.itemsFiltered?.length || 0;
        const amountUnPinned = byGroup.DISPLAYED_UNPINNED?.itemsFiltered?.length || 0;
        if (!amountPinned && !amountUnPinned) {
            return null;
        }
        const rowsPinned = renderRows(useColumnsConfigurationState.ColGroup.DISPLAYED_PINNED);
        const rowsUnpinned = renderRows(useColumnsConfigurationState.ColGroup.DISPLAYED_UNPINNED);
        return (
            <>
                { renderSectionTitle(i18nLocal.displayedInTable, amountPinned + amountUnPinned) }
                <div className={ styles.checkboxContainer }>
                    { rowsPinned }
                    { Boolean(amountPinned && amountUnPinned) && <div className={ styles.hDivider } /> }
                    { rowsUnpinned }
                </div>
            </>
        );
    };

    const renderHidden = () => {
        const amountHidden = byGroup.HIDDEN?.itemsFiltered?.length || 0;
        if (!amountHidden) {
            return null;
        }
        return (
            <>
                { renderSectionTitle(i18nLocal.hiddenInTable, amountHidden) }
                <div className={ styles.checkboxContainer }>
                    { renderRows(useColumnsConfigurationState.ColGroup.HIDDEN) }
                </div>
            </>
        );
    };
    const close = useCallback(() =>  modalProps.abort(), [modalProps]);
    return (
        <ModalBlocker blockerShadow="dark" { ...modalProps }>
            <ModalWindow cx={ styles.modal }>
                <ModalHeader title={ i18nLocal.configureColumnsTitle } onClose={ close } />
                <div className={ styles.search }>
                    <SearchInput
                        size="30"
                        value={ filterValue }
                        onValueChange={ setFilterValue }
                        placeholder={ i18nLocal.searchByColumnName }
                    />
                    <Dropdown
                        closeOnTargetClick={ true }
                        renderBody={ () =>
                            <Panel background="white" shadow={ true }>
                                <DropdownMenuButton caption={ i18nLocal.clearAllButton } onClick={ uncheckAll }/>
                                <DropdownMenuButton caption={ i18nLocal.selectAllButton } onClick={ checkAll }/>
                            </Panel>
                        }
                        renderTarget={ props =>
                            <Button
                                cx={ styles.actionsMenu }
                                { ...props }
                                fill="white"
                                icon={ MenuIcon }
                                size="30"
                                color="gray50"
                                isDropdown={ false }
                            />
                        }
                        placement="bottom-end"
                    />
                </div>
                <Panel background="white" cx={ styles.container }>
                    <ScrollBars>
                        { renderVisible() }
                        { renderHidden() }
                        {
                            isNoData &&
                            <div className={ styles.noData }>
                                <div className={ styles.text }>{ i18nLocal.noResultsFound }</div>
                                <div className={ styles.subText }>{ i18nLocal.weCantFindAnyItemMatchingYourRequest }</div>
                            </div>
                        }
                    </ScrollBars>
                </Panel>
                <ModalFooter borderTop >
                    <LinkButton icon={ ResetIcon } caption={ i18nLocal.resetToDefaultButton } color="blue" onClick={ reset } />
                    <FlexSpacer />
                    <Button fill="white" color="gray50" caption={ i18nLocal.cancelButton } onClick={ close } />
                    <Button cx={ styles.actionButton } caption={ i18nLocal.applyButton } color="green" onClick={ apply } />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
