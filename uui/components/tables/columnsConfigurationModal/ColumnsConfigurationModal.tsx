import styles from './ColumnsConfigurationModal.module.scss';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';

import { ColumnsConfig, cx, DataColumnProps, IModal } from '@epam/uui-core';
import { Accordion, ColumnsConfigurationRowProps, IconContainer, useColumnsConfiguration } from '@epam/uui-components';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/navigation-more_vert-outline.svg';
import { ReactComponent as ResetIcon } from '@epam/assets/icons/navigation-refresh-outline.svg';
import { ReactComponent as ExpandedIcon } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import { ReactComponent as CollapsedIcon } from '@epam/assets/icons/navigation-chevron_right-outline.svg';

import { FlexRow, FlexSpacer, Panel, ScrollBars } from '../../layout';
import { Button, LinkButton } from '../../buttons';
import { Dropdown, DropdownMenuBody, DropdownMenuButton, ModalBlocker, ModalFooter, ModalHeader, ModalWindow, Tooltip } from '../../overlays';
import { Text } from '../../typography';
import { CountIndicator } from '../../widgets';
import { SearchInput } from '../../inputs';

import { i18n as uuiI18n } from '../../../i18n';
import { ColumnRow } from './ColumnRow';

export interface ColumnsConfigurationModalProps<TItem, TId, TFilter> extends IModal<ColumnsConfig> {
    columnsConfig?: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
    renderItem?: (column: DataColumnProps<TItem, TId, TFilter>) => React.ReactNode;
    getSearchFields?: (column: DataColumnProps<TItem, TId, TFilter>) => string[];
}

const renderGroupTitle = (title: string, amount: number) => (
    <FlexRow size="24" padding="24" columnGap="6" cx={ styles.groupTitle }>
        <Text cx={ styles.groupTitleText } fontWeight="600" lineHeight="24" fontSize="14">
            {title}
        </Text>
        <CountIndicator caption={ amount } color="neutral" size="18" />
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
        return (
            <>
                {renderGroupTitle(i18n.displayedSectionTitle, totalAmountOfVisibleColumns)}
                <SubGroup renderItem={ props.renderItem } title={ i18n.pinnedToTheLeftSubgroupTitle } items={ groupedColumns.displayedPinnedLeft } />
                {hasDividerBelowPinnedLeft && <div className={ styles.hDivider } />}
                <SubGroup renderItem={ props.renderItem } title={ i18n.notPinnedSubgroupTitle } items={ groupedColumns.displayedUnpinned } />
                {hasDividerAbovePinnedRight && <div className={ styles.hDivider } />}
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
            <ModalWindow cx={ styles.modal } height="95dvh" maxHeight="95dvh">
                <ModalHeader title={ i18n.configureColumnsTitle } onClose={ close } />
                <FlexRow padding="24" borderBottom={ true } columnGap="12" cx={ styles.searchArea }>
                    <SearchInput size="30" value={ searchValue } onValueChange={ setSearchValue } placeholder={ i18n.searchPlaceholder } />
                    <Dropdown
                        closeOnTargetClick={ true }
                        renderBody={ () => (
                            <DropdownMenuBody minWidth={ 100 }>
                                <DropdownMenuButton caption={ i18n.clearAllButton } onClick={ uncheckAll } />
                                <DropdownMenuButton caption={ i18n.selectAllButton } onClick={ checkAll } />
                            </DropdownMenuBody>
                        ) }
                        renderTarget={ (props) => <Button { ...props } fill="none" icon={ MenuIcon } size="30" color="secondary" isDropdown={ false } /> }
                    />
                </FlexRow>
                <Panel background="surface-main" cx={ styles.mainPanel }>
                    <ScrollBars>
                        {renderVisible()}
                        {renderHidden()}
                        {isNoData && (
                            <FlexRow cx={ styles.noData }>
                                <Text fontSize="24" lineHeight="30" color="primary" fontWeight="600">
                                    {i18n.noResultsFound.text}
                                </Text>
                                <Text fontSize="16" lineHeight="24" color="primary">
                                    {i18n.noResultsFound.subText}
                                </Text>
                            </FlexRow>
                        )}
                    </ScrollBars>
                </Panel>
                <ModalFooter borderTop>
                    <LinkButton icon={ ResetIcon } caption={ i18n.resetToDefaultButton } onClick={ reset } />
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
            <FlexRow cx={ styles.groupItems } size="30">
                {items.map((c) => (
                    <ColumnRow column={ c } key={ c.key } renderItem={ renderItem } />
                ))}
            </FlexRow>
        );
        if (isCollapsible) {
            const renderTitle = (isOpened: boolean) => {
                const toggleIcon = isOpened ? ExpandedIcon : CollapsedIcon;
                return (
                    <span className={ cx(styles.subgroupTitle) }>
                        <IconContainer size={ 18 } icon={ toggleIcon } flipY={ false } />
                        { title }
                    </span>
                );
            };
            return (
                <Accordion value={ isExpanded } onValueChange={ setIsExpanded } renderTitle={ renderTitle } cx={ styles.subgroupAccordion }>
                    { content }
                </Accordion>
            );
        }
        return content;
    }
    return null;
}
