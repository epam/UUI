import * as React from 'react';
import { Lens, DataSourceState, isMobile, cx } from '@epam/uui-core';
import { FlexCell, PickerBodyBase, PickerBodyBaseProps, IconContainer } from '@epam/uui-components';
import { ReactComponent as SearchIcon } from '../../icons/search-with-background.svg';
import { SearchInput } from '../inputs';
import { FlexRow, VirtualList } from '../layout';
import { Text } from '../typography';
import { i18n } from '../../i18n';
import { ControlSize } from '../types';
import * as css from './DataPickerBody.scss';

export interface DataPickerBodyProps extends PickerBodyBaseProps {
    maxHeight?: number;
    editMode?: 'dropdown' | 'modal';
    searchSize?: ControlSize;
}

export class DataPickerBody extends PickerBodyBase<DataPickerBodyProps> {
    lens = Lens.onEditableComponent<DataSourceState>(this);
    searchLens = this.lens.prop('search');

    renderNoFound() {
        if (this.props.renderNotFound) {
            return this.props.renderNotFound();
        }

        const renderDefaultBody =  () => {
            switch (this.props.editMode) {
                case 'modal':
                    return (
                        <div className={ css.noFoundModalContainer }>
                            <IconContainer  cx={ css.noFoundModalContainerIcon } icon={ SearchIcon }/>
                            <Text cx={ css.noFoundModalContainerText } font='sans-semibold' fontSize='16' lineHeight='24' color='gray80' size={ this.props.searchSize || '36' }>{ i18n.dataPickerBody.noRecordsMessage }</Text>
                            <Text cx={ css.noFoundModalContainerText } fontSize='12' lineHeight='18' font='sans' color='gray80' size={ this.props.searchSize || '36' }>{ i18n.dataPickerBody.noRecordsSubTitle }</Text>
                        </div>
                    );
                default:
                    return <Text size={ this.props.searchSize || '36' }>{ i18n.dataPickerBody.noRecordsMessage }</Text>;
            }
        };

        return (
            <FlexCell cx={ css[`no-found-size-${ this.props.searchSize || 36 }`] } grow={ 1 } textAlign='center'>
                { renderDefaultBody() }
            </FlexCell>
        );
    }

    render() {
        const searchSize = isMobile() ? '48' : (this.props.searchSize || '36');
        const searchClass = cx(css.searchWrapper, css[`search-size-${ searchSize }`]);

        return <>
            { this.showSearch() && (
                <div key='search' className={ searchClass }>
                    <FlexCell grow={ 1 }>
                        <SearchInput
                            ref={ this.searchRef }
                            cx={ css.search }
                            placeholder={ i18n.dataPickerBody.searchPlaceholder }
                            { ...this.searchLens.toProps() }
                            onKeyDown={ this.searchKeyDown }
                            size={ searchSize }
                        />
                    </FlexCell>
                </div>
            ) }
            <FlexRow
                key='body'
                cx={ cx(css.body, css['editMode-' + this.props.editMode]) }
                rawProps={ { style: { maxHeight: this.props.maxHeight } } }
                background='white'
            >
                { this.props.rowsCount > 0
                    ? <VirtualList
                        { ...this.lens.toProps() }
                        rows={ this.props.rows }
                        role='listbox'
                        rawProps={ this.props.rawProps }
                        rowsCount={ this.props.rowsCount }
                    />
                    : this.renderNoFound()
                }
            </FlexRow>
        </>;
    }
}
