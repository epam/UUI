import React from 'react';
import { DropdownMenuButton } from '../overlays';
import { DataRowProps, getCookie, setCookie, LazyDataSourceApi, LazyDataSource } from '@epam/uui';
import { PickerInput, DataPickerRow } from '../pickers';
import { Avatar } from '@epam/uui-components';
import { Text, TextPlaceholder } from '../typography';
import * as css from './MakeMeItem.scss';

export interface MakeMeUser {
    externalId: number | string;
    name: string;
    avatarUrl: string;
}

export interface MakeMeItemProps {
    api: LazyDataSourceApi<MakeMeUser, number | string, any>;
}

const cookie = {
    userId: 'MakeMe',
};

export class MakeMeItem extends React.Component<MakeMeItemProps> {
    dataSource = new LazyDataSource<MakeMeUser>({
        api: this.props.api,
        getId:  i => i.externalId,
    });

    render() {
        return <PickerInput<MakeMeUser, number | string>
            valueType='id'
            selectionMode='single'
            editMode='modal'
            value={ getCookie(cookie.userId) || '111' }
            onValueChange={ (userId: string) => {
                setCookie(cookie.userId, userId, { path: '/' });
                window.location.reload();
            } }
            dataSource={ this.dataSource }
            renderToggler={ props => <DropdownMenuButton caption={ `Make me ...` } onClick={ props.onClick } />  }
            renderRow={ (props: DataRowProps<MakeMeUser, number | string>) => <DataPickerRow
                { ...props }
                size='60'
                renderItem={ item =>
                    <div className={ css.row }>
                        <Avatar size='48' img={ props.isLoading ?
                            'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/Images/avatar_placeholder.jpg'
                            : item.avatarUrl
                        } />
                        <div className={ css.text }>
                            <Text size='30'> { props.isLoading ? <TextPlaceholder wordsCount={ 2 }/> : item.name } </Text>
                        </div>
                    </div>
                }
            /> }
        />;
    }
}