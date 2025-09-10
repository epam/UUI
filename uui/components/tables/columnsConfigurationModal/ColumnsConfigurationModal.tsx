import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import { ColumnsConfig, cx, DataColumnProps, IModal } from '@epam/uui-core';
import { Accordion, ColumnsConfigurationRowProps, IconContainer, useColumnsConfiguration } from '@epam/uui-components';

import { FlexRow, FlexSpacer, Panel, ScrollBars } from '../../layout';
import { Button, LinkButton } from '../../buttons';
import { Dropdown, DropdownMenuBody, DropdownMenuButton, ModalBlocker, ModalFooter, ModalHeader, ModalWindow, Tooltip } from '../../overlays';
import { Text } from '../../typography';
import { CountIndicator } from '../../widgets';
import { SearchInput } from '../../inputs';
import { ColumnRow } from './ColumnRow';

import { i18n as uuiI18n } from '../../../i18n';
import { settings } from '../../../settings';

import css from './ColumnsConfigurationModal.module.scss';
import { DataTableProps } from '../DataTable';

export interface ColumnsConfigurationModalProps<TItem, TId, TFilter> extends Pick<DataTableProps<TItem, TId>, 'columnGroups'>, IModal<ColumnsConfig> {
    columnsConfig?: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
    renderItem?: (column: DataColumnProps<TItem, TId, TFilter>) => React.ReactNode;
    getSearchFields?: (column: DataColumnProps<TItem, TId, TFilter>) => string[];
}

const renderGroupTitle = (title: string, amount: number) => (
    <FlexRow
        cx={ css.group }
    >
        <Text
            size="none"
            cx={ css.groupTitle }
        >
            {title}
        </Text>
        <CountIndicator
            caption={ amount }
            color="neutral"
            size={ settings.dataTable.sizes.columnsConfigurationModal.countIndicator }
        />
        <FlexSpacer />
    </FlexRow>
);

export function ColumnsConfigurationModal<TItem, TId, TFilter>(props: ColumnsConfigurationModalProps<TItem, TId, TFilter>) {
    const i18n = uuiI18n.tables.columnsConfigurationModal;

    const { columns, columnsConfig: initialColumnsConfig, defaultConfig, ...modalProps } = props;
    const {
        groupedColumns, searchValue, columnsConfig, reset, checkAll, uncheckAll, setSearchValue, hasAnySelectedColumns,
    } = useColumnsConfiguration({
        initialColumnsConfig,
        columns,
        defaultConfig,
        getSearchFields: props.getSearchFields,
        columnGroups: props.columnGroups,
    });
    const apply = useCallback(() => modalProps.success(columnsConfig), [columnsConfig, modalProps]);
    const close = useCallback(() => modalProps.abort(), [modalProps]);
    const isNoData = useMemo(() => Object.values(groupedColumns).every((v) => !v.length), [groupedColumns]);

    const renderVisible = () => {
        const amountPinnedLeft = groupedColumns.displayedPinnedLeft.length;
        const amountPinnedRight = groupedColumns.displayedPinnedRight.length;
        const amountUnPinned = groupedColumns.displayedUnpinned.length;
        const totalAmountOfVisibleColumns = amountPinnedLeft + amountUnPinned + amountPinnedRight;

        if (!totalAmountOfVisibleColumns) {
            return null;
        }
        const hasDividerBelowPinnedLeft = !!(amountPinnedLeft && amountUnPinned);
        const hasDividerAbovePinnedRight = !!(amountPinnedRight && amountUnPinned);
        const divider = (
            <FlexRow
                size={ null }
                cx={ css.hDivider }
            />
        );

        return (
            <>
                {renderGroupTitle(i18n.displayedSectionTitle, totalAmountOfVisibleColumns)}
                <SubGroup renderItem={ props.renderItem } title={ i18n.pinnedToTheLeftSubgroupTitle } items={ groupedColumns.displayedPinnedLeft } />
                {hasDividerBelowPinnedLeft && divider}
                <SubGroup renderItem={ props.renderItem } title={ i18n.notPinnedSubgroupTitle } items={ groupedColumns.displayedUnpinned } />
                {hasDividerAbovePinnedRight && divider}
                <SubGroup renderItem={ props.renderItem } title={ i18n.pinnedToTheRightSubgroupTitle } items={ groupedColumns.displayedPinnedRight } />
            </>
        );
    };
    const renderHidden = () => {
        const items = groupedColumns.hidden;
        const title = renderGroupTitle(i18n.hiddenSectionTitle, items.length);
        if (!items.length) {
            return null;
        }
        return (
            <>
                { title }
                <SubGroup renderItem={ props.renderItem } items={ items } />
            </>
        );
    };

    const applyButton = <Button caption={ i18n.applyButton } isDisabled={ !hasAnySelectedColumns } color="primary" onClick={ apply } />;

    return (
        <ModalBlocker { ...modalProps }>
            <ModalWindow cx={ [css.root, 'uui-columns-config-modal'] } height="95dvh" maxHeight="95dvh">
                <ModalHeader title={ i18n.configureColumnsTitle } onClose={ close } />
                <FlexRow
                    borderBottom={ true }
                    cx={ css.searchArea }
                >
                    <SearchInput
                        size={ settings.dataTable.sizes.columnsConfigurationModal.searchInput }
                        value={ searchValue }
                        onValueChange={ setSearchValue }
                        placeholder={ i18n.searchPlaceholder }
                    />
                    <Dropdown
                        closeOnTargetClick={ true }
                        renderBody={ () => (
                            <DropdownMenuBody minWidth={ 100 }>
                                <DropdownMenuButton caption={ i18n.clearAllButton } onClick={ uncheckAll } />
                                <DropdownMenuButton caption={ i18n.selectAllButton } onClick={ checkAll } />
                            </DropdownMenuBody>
                        ) }
                        renderTarget={ (props) => (
                            <Button
                                { ...props }
                                fill="none"
                                icon={ settings.dataTable.icons.columnsConfigurationModal.menuIcon }
                                size={ settings.dataTable.sizes.columnsConfigurationModal.menuButton }
                                color="secondary"
                                isDropdown={ false }
                            />
                        ) }
                    />
                </FlexRow>
                <Panel background="surface-main" cx={ css.mainPanel }>
                    <ScrollBars>
                        {renderVisible()}
                        {renderHidden()}
                        {isNoData && (
                            <FlexRow cx={ css.noData }>
                                <Text cx={ css.noDataTitle }>
                                    {i18n.noResultsFound.title}
                                </Text>
                                <Text cx={ css.noDataSubTitle }>
                                    {i18n.noResultsFound.subTitle}
                                </Text>
                            </FlexRow>
                        )}
                    </ScrollBars>
                </Panel>
                <ModalFooter borderTop>
                    <LinkButton
                        icon={ settings.dataTable.icons.columnsConfigurationModal.resetIcon }
                        caption={ i18n.resetToDefaultButton }
                        onClick={ reset }
                    />
                    <FlexSpacer />
                    <Button fill="none" color="secondary" caption={ i18n.cancelButton } onClick={ close } />
                    {!hasAnySelectedColumns ? (
                        <Tooltip content={ i18n.enableAtLeastOneColumnMessage } placement="top-end" color="critical">
                            {applyButton}
                        </Tooltip>
                    ) : (
                        applyButton
                    )}
                </ModalFooter>
            </ModalWindow>
        </ModalBlocker>
    );
}

function SubGroup(props: { items: ColumnsConfigurationRowProps[]; renderItem: (column: DataColumnProps) => React.ReactNode; title?: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const { title, items, renderItem } = props;
    const isCollapsible = !!title;

    if (items.length) {
        const content = (
            <FlexRow
                cx={ css.groupItems }
                size={ settings.dataTable.sizes.columnsConfigurationModal.columnRow }
            >
                {items.map((c) => (
                    <ColumnRow column={ c } key={ c.key } renderItem={ renderItem } />
                ))}
            </FlexRow>
        );
        if (isCollapsible) {
            const renderTitle = (isOpened: boolean) => {
                const toggleIcon = settings.dataTable.icons.columnsConfigurationModal[isOpened ? 'expandedIcon' : 'collapsedIcon'];
                return (
                    <FlexRow
                        cx={ cx(css.subgroup) }
                    >
                        <IconContainer
                            icon={ toggleIcon }
                        />
                        <Text
                            size="none"
                            color="tertiary"
                            cx={ css.subgroupTitle }
                        >
                            { title }
                        </Text>
                    </FlexRow>
                );
            };
            return (
                <Accordion
                    value={ isExpanded }
                    onValueChange={ setIsExpanded }
                    renderTitle={ renderTitle }
                    cx={ css.subgroupAccordion }
                >
                    { content }
                </Accordion>
            );
        }
        return content;
    }
    return null;
}
