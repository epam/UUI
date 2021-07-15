import React, { useCallback, useState } from 'react';
import { FlexRow, PickerInput, TextPlaceholder, DataPickerRow } from '@epam/promo';
import { DataRowProps, LazyDataSourceApiRequest, useLazyDataSource, useUuiContext } from '@epam/uui';
import { Person } from '@epam/uui-docs';
import { Avatar } from "@epam/uui-components";
import * as css from './CustomUserRow.example.scss';

const renderUserRow = (props: DataRowProps<Person, number>) => (
    <DataPickerRow
        { ...props }
        key={ props.rowKey }
        size='48'
        padding='12'
        renderItem={ item =>
            <div style={ { display: 'flex', padding: '6px 0'} }>
                <Avatar size='36' img={ item.avatarUrl } />
                <div style={ { marginLeft: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' } }>
                    <div className={ css.userName }>
                        { props.isLoading ? <TextPlaceholder wordsCount={ 2 }/> : item.name }
                    </div>
                    <div className={ css.userTitle }>
                        { props.isLoading ? <TextPlaceholder wordsCount={ 2 }/> : item.jobTitle }
                    </div>
                </div>
            </div>
        }
    />
);

export default function LazyPersonsMultiPickerWithCustomUserRow() {
    const svc = useUuiContext();
    const [value, onValueChange] = useState<number[]>();

    const loadPersons = useCallback((request: LazyDataSourceApiRequest<Person, number>) => {
        return svc.api.demo.persons(request);
    }, []);

    const dataSource = useLazyDataSource({
        api: loadPersons,
    }, []);

    return (
        <FlexRow>
            <PickerInput
                dataSource={ dataSource }
                value={ value }
                onValueChange={ onValueChange }
                renderRow={ renderUserRow }
                entityName='person'
                selectionMode='multi'
                valueType='id'
            />
        </FlexRow>
    );
}
