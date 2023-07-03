import styles from './ColumnsConfigurationModal.module.scss';
import * as React from 'react';
import { useCallback, useMemo } from 'react';
//
import { ColumnsConfig, DataColumnProps, IModal } from '@epam/uui-core';
import { useColumnsConfiguration } from '@epam/uui-components';
import { ReactComponent as MenuIcon } from '@epam/assets/icons/common/navigation-more_vert-18.svg';
import { ReactComponent as ResetIcon } from '@epam/assets/icons/common/action-update-18.svg';
//
import {
    FlexRow,
    FlexSpacer,
    Panel,
    ScrollBars,
    Button,
    LinkButton,
    SearchInput,
    Dropdown,
    Badge,
    DropdownMenuButton,
    ModalBlocker,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    Text,
    Tooltip,
} from '../../../.';
import { i18n as uuiI18n } from '../../../i18n';
import { ColumnRow } from './ColumnRow';

interface ColumnsConfigurationModalProps<TItem, TId, TFilter> extends IModal<ColumnsConfig> {
    columnsConfig?: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
}

const renderGroupTitle = (title: string, amount: number) => (
    <FlexRow size="24" padding="24" spacing="6" cx={ styles.groupTitle }>
        <Text cx={ styles.groupTitleText } font="semibold" lineHeight="24" fontSize="14">
            {title}
        </Text>
        <Badge cx={ styles.groupTitleBadge } caption={ amount } color="default" size="18" />
    </FlexRow>
);

export function ColumnsConfigurationModal<TItem, TId, TFilter>(props: ColumnsConfigurationModalProps<TItem, TId, TFilter>) {
    const i18n = uuiI18n.tables.columnsConfigurationModal;

    const {
        columns, columnsConfig: initialColumnsConfig, defaultConfig, ...modalProps
    } = props;
    const {
        groupedColumns, searchValue, columnsConfig, reset, checkAll, uncheckAll, setSearchValue,
    } = useColumnsConfiguration({
        initialColumnsConfig,
        columns,
        defaultConfig,
    });
    const apply = useCallback(() => modalProps.success(columnsConfig), [columnsConfig, modalProps]);
    const close = useCallback(() => modalProps.abort(), [modalProps]);
    const isNoData = useMemo(() => Object.values(groupedColumns).every((v) => !v.length), [groupedColumns]);

    const renderVisible = () => {
        const amountPinned = groupedColumns.displayedPinned.length;
        const amountUnPinned = groupedColumns.displayedUnpinned.length;
        if (!amountPinned && !amountUnPinned) {
            return null;
        }
        const hasDivider = !!(amountPinned && amountUnPinned);
        return (
            <>
                {renderGroupTitle(i18n.displayedSectionTitle, amountPinned + amountUnPinned)}
                {!!amountPinned && (
                    <FlexRow cx={ styles.groupItems } size="30">
                        {groupedColumns.displayedPinned.map((c) => (
                            <ColumnRow
                                renderItem={ () => (
                                    <FlexRow>
                                        <span>{c.caption}</span>
                                        { c.info && (
                                            <span style={ { fontSize: '10px', marginTop: '2px', marginLeft: '3px', color: 'gray' } }>
                                                {' / from \'renderItem\': '}
                                                { c.info }
                                            </span>
                                        ) }
                                    </FlexRow>
                                ) }
                                column={ c }
                                key={ c.key }
                            />
                        ))}
                    </FlexRow>
                )}
                {hasDivider && <div className={ styles.hDivider } />}
                {!!amountUnPinned && (
                    <FlexRow cx={ styles.groupItems } size="30">
                        {groupedColumns.displayedUnpinned.map((c) => (
                            <ColumnRow column={ c } key={ c.key } />
                        ))}
                    </FlexRow>
                )}
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
                {renderGroupTitle(i18n.hiddenSectionTitle, amountHidden)}
                <FlexRow cx={ styles.groupItems } size="30">
                    {groupedColumns.hidden.map((c) => (
                        <ColumnRow column={ c } key={ c.key } />
                    ))}
                </FlexRow>
            </>
        );
    };

    const noVisibleColumns = useMemo(
        () => !groupedColumns.displayedPinned.length && !groupedColumns.displayedUnpinned.length,
        [groupedColumns.displayedPinned, groupedColumns.displayedUnpinned],
    );

    const applyButton = <Button caption={ i18n.applyButton } isDisabled={ noVisibleColumns } color="accent" onClick={ apply } />;

    return (
        <ModalBlocker { ...modalProps }>
            <ModalWindow height={ 700 }>
                <ModalHeader title={ i18n.configureColumnsTitle } onClose={ close } />
                <FlexRow padding="24" borderBottom={ true } spacing="12" cx={ styles.searchArea }>
                    <SearchInput size="30" value={ searchValue } onValueChange={ setSearchValue } placeholder={ i18n.searchPlaceholder } />
                    <Dropdown
                        closeOnTargetClick={ true }
                        renderBody={ () => (
                            <Panel shadow={ true }>
                                <DropdownMenuButton caption={ i18n.clearAllButton } onClick={ uncheckAll } />
                                <DropdownMenuButton caption={ i18n.selectAllButton } onClick={ checkAll } />
                            </Panel>
                        ) }
                        renderTarget={ (props) => <Button { ...props } mode="none" icon={ MenuIcon } size="30" color="secondary" isDropdown={ false } /> }
                    />
                </FlexRow>
                <Panel cx={ styles.mainPanel }>
                    <ScrollBars>
                        {renderVisible()}
                        {renderHidden()}
                        {isNoData && (
                            <FlexRow cx={ styles.noData }>
                                <Text fontSize="24" lineHeight="30" color="primary" font="semibold">
                                    {i18n.noResultsFound.text}
                                </Text>
                                <Text fontSize="16" lineHeight="24" font="regular" color="primary">
                                    {i18n.noResultsFound.subText}
                                </Text>
                            </FlexRow>
                        )}
                    </ScrollBars>
                </Panel>
                <ModalFooter borderTop>
                    <LinkButton icon={ ResetIcon } caption={ i18n.resetToDefaultButton } onClick={ reset } />
                    <FlexSpacer />
                    <Button mode="none" color="secondary" caption={ i18n.cancelButton } onClick={ close } />
                    {noVisibleColumns ? (
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
