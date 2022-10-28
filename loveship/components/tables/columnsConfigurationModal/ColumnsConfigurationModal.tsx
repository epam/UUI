import * as styles from "./ColumnsConfigurationModal.scss";
import * as React from "react";
import { useCallback, useMemo } from "react";
//
import { ColumnsConfig, DataColumnProps, IModal } from "@epam/uui-core";
import { useColumnsConfiguration } from "@epam/uui-components";
import { ReactComponent as MenuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { ReactComponent as ResetIcon } from '@epam/assets/icons/common/action-update-18.svg';
//
import {
    FlexRow, FlexSpacer, Panel, ScrollBars, Button, LinkButton, SearchInput,
    Dropdown, DropdownMenuButton, ModalBlocker, ModalFooter, ModalHeader, ModalWindow, Badge, Text,
} from "../../../.";
import { i18n } from '../../../i18n';
import { ColumnRow } from "./ColumnRow";

const i18nLocal = i18n.tables.columnsConfigurationModal;

interface IColumnsConfigView<TItem, TId, TFilter> extends IModal<ColumnsConfig> {
    columnsConfig?: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
}

const renderGroupTitle = (title: string, amount: number) => <FlexRow padding="24" spacing="6" cx={ styles.groupTitle }>
    <Text font="sans-semibold" lineHeight="24" fontSize="14">{ title }</Text>
    <Badge caption={ amount } color="night300" size="18" />
</FlexRow>;

export function ColumnsConfigurationModal<TItem, TId, TFilter>(props: IColumnsConfigView<TItem, TId, TFilter>) {
    const { columns, columnsConfig, defaultConfig, ...modalProps } = props;
    const {
        // props
        groupedColumns, searchValue, columnsConfigUnsaved,
        // methods
        reset, checkAll, uncheckAll, setSearchValue,
    } = useColumnsConfiguration({ columnsConfig, columns, defaultConfig });
    const apply = useCallback(() => modalProps.success(columnsConfigUnsaved), [columnsConfigUnsaved, modalProps]);
    const close = useCallback(() =>  modalProps.abort(), [modalProps]);
    const isNoData = useMemo(() => Object.values(groupedColumns).every(v => !v.length), [groupedColumns]);
    const renderVisible = () => {
        const amountPinned = groupedColumns.displayedPinned.length;
        const amountUnPinned = groupedColumns.displayedUnpinned.length;
        if (!amountPinned && !amountUnPinned) {
            return null;
        }
        const hasDivider = Boolean(amountPinned && amountUnPinned);
        return (
            <>
                { renderGroupTitle(i18nLocal.displayedInTable, amountPinned + amountUnPinned) }
                { !!amountPinned && <FlexRow cx={ styles.groupItems }>
                    { groupedColumns.displayedPinned.map(c => <ColumnRow column={ c } key={ c.key } />) }
                </FlexRow>
                }
                {
                    hasDivider && <div className={ styles.hDivider } />
                }
                { !!amountUnPinned && <FlexRow cx={ styles.groupItems }>
                    { groupedColumns.displayedUnpinned.map(c => <ColumnRow column={ c } key={ c.key } />) }
                </FlexRow>
                }
            </>
        );
    };
    const renderHidden = () => {
        const amountHidden = groupedColumns.hidden.length;
        if (!amountHidden) {
            return null;
        }
        return (
            <>
                { renderGroupTitle(i18nLocal.hiddenInTable, amountHidden) }
                <FlexRow cx={ styles.groupItems }>
                    { groupedColumns.hidden.map(c => <ColumnRow column={ c } key={ c.key } />) }
                </FlexRow>
            </>
        );
    };
    return (
        <ModalBlocker blockerShadow="dark" { ...modalProps }>
            <ModalWindow height="700">
                <ModalHeader title={ i18nLocal.configureColumnsTitle } onClose={ close } />
                <FlexRow padding="24" borderBottom={ true } spacing="12" cx={ styles.searchArea }>
                    <SearchInput
                        size="30"
                        value={ searchValue }
                        onValueChange={ setSearchValue }
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
                                color="night500"
                                isDropdown={ false }
                            />
                        }
                    />
                </FlexRow>
                <Panel background="white" cx={ styles.mainPanel }>
                    <ScrollBars>
                        { renderVisible() }
                        { renderHidden() }
                        {
                            isNoData && (
                                <FlexRow cx={ styles.noData }>
                                    <Text fontSize='18' lineHeight='30' color='night800' font='sans-semibold'>{ i18nLocal.noResultsFound }</Text>
                                    <Text fontSize='16' lineHeight='24' font='sans' color='night800'>{ i18nLocal.weCantFindAnyItemMatchingYourRequest }</Text>
                                </FlexRow>
                            )
                        }
                    </ScrollBars>
                </Panel>
                <ModalFooter borderTop >
                    <LinkButton icon={ ResetIcon } caption={ i18nLocal.resetToDefaultButton } color="sky" onClick={ reset } />
                    <FlexSpacer />
                    <Button fill="white" color="night500" caption={ i18nLocal.cancelButton } onClick={ close } />
                    <Button caption={ i18nLocal.applyButton } color="sky" onClick={ apply } />
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}
