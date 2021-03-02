import * as React from 'react';
import * as css from './PickerModal.scss';
import { DataRowProps, Lens} from '@epam/uui';
import { PickerModalBase, PickerModalProps, handleDataSourceKeyboard } from '@epam/uui-components';
import { DataPickerBody } from './DataPickerBody';
import { FlexRow, FlexCell, FlexSpacer } from '../layout/FlexItems';
import { ModalBlocker, ModalWindow, ModalHeader, ModalFooter } from '../overlays';
import { SearchInput, Switch } from '../inputs';
import { LinkButton, Button } from '../buttons';
import { DataPickerRow } from './DataPickerRow';
import { Text, TextPlaceholder } from '../typography';
import { i18n } from "../../i18n";

export class PickerModalImpl<TItem, TId> extends PickerModalBase<TItem, TId> {
    renderRow(rowProps: DataRowProps<TItem, TId>) {
        return this.props.renderRow ? this.props.renderRow(rowProps) : (
            <DataPickerRow
                { ...rowProps }
                key={ rowProps.rowKey }
                borderBottom='none'
                padding='24'
                size='36'
                renderItem={ i => <Text size='36'>{ rowProps.isLoading ? <TextPlaceholder wordsCount={ 2 } /> : this.getName(i) }</Text>
                }
            />
        );
    }

    renderFooter(selectedDataRows: DataRowProps<TItem, TId>[]) {
        const hasSelection = selectedDataRows.length > 0;
        const view = this.getView();

        return <>
            {
                view.selectAll && <LinkButton
                    caption={ hasSelection ? i18n.pickerModal.clearAllButton : i18n.pickerModal.selectAllButton }
                    onClick={ hasSelection ? () => this.clearSelection() : () => view.selectAll.onValueChange(true) }
                />
            }
            <FlexSpacer />
            <Button fill='white' color='gray50' caption={ i18n.pickerModal.cancelButton } onClick={ () => this.props.abort() } />
            <Button color='green' caption={ i18n.pickerModal.selectButton } onClick={ () => this.props.success(null) } />
        </>;
    }

    render(): React.ReactNode {
        const view = this.getView();
        const dataRows = this.getRows();
        const selectedDataRows = view.getSelectedRows();
        const rows = dataRows.map(props => this.renderRow(props));

        return (
            <ModalBlocker blockerShadow='dark' { ...this.props } >
                <ModalWindow width='600' height='700'>
                    <ModalHeader borderBottom title={ this.props.caption || i18n.pickerModal.headerTitle } onClose={ () => this.props.abort()  } />
                    <FlexCell cx={ css.subHeaderWrapper }>
                        <FlexRow vPadding='24'>
                            <SearchInput
                                { ...this.lens.prop('dataSourceState').prop('search').toProps() }
                                onKeyDown={ (e) => handleDataSourceKeyboard({
                                    value: this.getDataSourceState(),
                                    onValueChange: this.handleDataSourceValueChange,
                                    listView: view,
                                    rows: dataRows,
                                    editMode: 'modal',
                                }, e) }
                                autoFocus={ true }
                                placeholder={ i18n.pickerModal.searchPlaceholder }
                            />
                        </FlexRow>
                        { !this.isSingleSelect() && <Switch
                            cx={ css.switch }
                            size='18'
                            { ...this.stateLens.prop('showSelected').toProps() }
                            isDisabled={ selectedDataRows.length < 1 }
                            label='Show only selected'
                        /> }
                        {
                            this.props.renderFilter && <FlexCell grow={ 2 }>
                                { this.props.renderFilter(this.lens.prop('dataSourceState').prop('filter').toProps()) }
                            </FlexCell>
                        }
                    </FlexCell>
                    <DataPickerBody
                        { ...this.getListProps() }
                        value={ this.getDataSourceState() }
                        onValueChange={ this.handleDataSourceValueChange }
                        search={ this.lens.prop('dataSourceState').prop('search').toProps() }
                        showSearch={ false }
                        rows={ rows }
                        renderNotFound={ this.props.renderNotFound && (() => this.props.renderNotFound({
                            search: this.state.dataSourceState.search,
                            onClose: () => this.props.success(selectedDataRows),
                        })) }
                        editMode='modal'
                    />
                    <ModalFooter borderTop padding='24' vPadding='24'>
                        {
                            this.props.renderFooter
                            ? this.props.renderFooter({ ...this.props as any, selectedRows: selectedDataRows })
                            : this.renderFooter(selectedDataRows)
                        }
                    </ModalFooter>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}

export class PickerModal<TItem, TId> extends React.Component<PickerModalProps<TItem, TId>, any> {
    state = { selection: this.props.initialValue };
    lens = Lens.onState<any>(this);

    render() {

        return <PickerModalImpl
            { ...this.props }
            { ...this.lens.prop('selection').toProps() }
            success={ () => { (this.props.success as any)(this.state.selection); } }
        />;
    }
}
