import * as React from 'react';
import css from './PickerModal.scss';
import { DataRowProps, Lens } from '@epam/uui-core';
import { PickerModalBase, PickerModalProps, handleDataSourceKeyboard, IconContainer } from '@epam/uui-components';
import { DataPickerBody } from './DataPickerBody';
import { FlexRow, FlexCell, FlexSpacer } from '../layout';
import { ModalBlocker, ModalWindow, ModalHeader, ModalFooter } from '../overlays';
import { SearchInput, Switch } from '../inputs';
import { LinkButton, Button } from '../buttons';
import { DataPickerRow } from './DataPickerRow';
import { Text, TextPlaceholder } from '../typography';
import { i18n } from '../../i18n';
import { ReactComponent as SearchIcon } from '../../icons/search-with-background.svg';

export class PickerModalImpl<TItem, TId> extends PickerModalBase<TItem, TId> {
    renderRow(rowProps: DataRowProps<TItem, TId>) {
        return this.props.renderRow ? (
            this.props.renderRow(rowProps, this.state.dataSourceState)
        ) : (
            <DataPickerRow
                {...rowProps}
                key={rowProps.rowKey}
                borderBottom="none"
                padding="24"
                size="36"
                renderItem={(i: TItem & { name?: string }) => <Text size="36">{rowProps.isLoading ? <TextPlaceholder wordsCount={2} /> : this.getName(i)}</Text>}
            />
        );
    }

    renderFooter() {
        const view = this.getView();
        const hasSelection = view.getSelectedRowsCount() > 0;
        return (
            <>
                {view.selectAll && (
                    <LinkButton
                        caption={hasSelection ? i18n.pickerModal.clearAllButton : i18n.pickerModal.selectAllButton}
                        onClick={hasSelection ? () => this.clearSelection() : () => view.selectAll.onValueChange(true)}
                    />
                )}
                <FlexSpacer />
                <Button mode="outline" color="secondary" caption={i18n.pickerModal.cancelButton} onClick={() => this.props.abort()} />
                <Button color="accent" caption={i18n.pickerModal.selectButton} onClick={() => this.props.success(null)} />
            </>
        );
    }

    renderNotFound = () => {
        return this.props.renderNotFound ? (
            this.props.renderNotFound({ search: this.state.dataSourceState.search, onClose: () => this.props.success(null) })
        ) : (
            <div className={css.noFoundModalContainer}>
                <IconContainer cx={css.noFoundModalContainerIcon} icon={SearchIcon} />
                <Text cx={css.noFoundModalContainerText} font="semibold" fontSize="16" lineHeight="24" color="primary" size={'36'}>
                    {i18n.dataPickerBody.noRecordsMessage}
                </Text>
                <Text cx={css.noFoundModalContainerText} fontSize="12" lineHeight="18" font="regular" color="primary" size={'36'}>
                    {i18n.dataPickerBody.noRecordsSubTitle}
                </Text>
            </div>
        );
    };

    render() {
        const view = this.getView();
        const dataRows = this.getRows();
        const rows = dataRows.map((props) => this.renderRow(props));

        return (
            <ModalBlocker {...this.props}>
                <ModalWindow width={600} height={700}>
                    <ModalHeader title={this.props.caption || i18n.pickerModal.headerTitle} onClose={() => this.props.abort()} />
                    <FlexCell cx={css.subHeaderWrapper}>
                        <FlexRow vPadding="24">
                            <SearchInput
                                {...this.lens.prop('dataSourceState').prop('search').toProps()}
                                onKeyDown={(e) =>
                                    handleDataSourceKeyboard(
                                        {
                                            value: this.getDataSourceState(),
                                            onValueChange: this.handleDataSourceValueChange,
                                            listView: view,
                                            rows: dataRows,
                                            editMode: 'modal',
                                        },
                                        e
                                    )
                                }
                                autoFocus={true}
                                placeholder={i18n.pickerModal.searchPlaceholder}
                            />
                        </FlexRow>
                        {!this.isSingleSelect() && (
                            <Switch
                                cx={css.switch}
                                size="18"
                                {...this.stateLens.prop('showSelected').toProps()}
                                isDisabled={view.getSelectedRowsCount() < 1}
                                label="Show only selected"
                            />
                        )}
                        {this.props.renderFilter && <FlexCell grow={2}>{this.props.renderFilter(this.lens.prop('dataSourceState').prop('filter').toProps())}</FlexCell>}
                    </FlexCell>
                    <DataPickerBody
                        {...this.getListProps()}
                        value={this.getDataSourceState()}
                        onValueChange={this.handleDataSourceValueChange}
                        search={this.lens.prop('dataSourceState').prop('search').toProps()}
                        showSearch={false}
                        rows={rows}
                        renderNotFound={this.renderNotFound}
                        editMode="modal"
                    />
                    <ModalFooter padding="24" vPadding="24">
                        {this.props.renderFooter ? this.props.renderFooter(this.getFooterProps()) : this.renderFooter()}
                    </ModalFooter>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}

export class PickerModal<TItem, TId> extends React.Component<PickerModalProps<TItem, TId>> {
    state = { selection: this.props.initialValue };
    lens = Lens.onState<any>(this);

    render() {
        return <PickerModalImpl {...this.props} {...this.lens.prop('selection').toProps()} success={() => this.props.success(this.state.selection as any)} />;
    }
}
