import React, { useCallback, useState } from 'react';
import css from './Filter.module.scss';
import {
    DatePicker, IconContainer, PickerList, RangeDatePicker, RangeDatePickerValue,
} from '@epam/uui';
import { TableFiltersConfig, IEditable } from '@epam/uui-core';
import { ReactComponent as ArrowDown } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';

interface IFilterProps<TFilter extends Record<string, any>> extends IEditable<TFilter> {
    filterConfig: TableFiltersConfig<TFilter> | undefined;
}

function FilterImpl<TFilter extends Record<string, any>>(props: IFilterProps<TFilter>) {
    const {
        filterConfig, value, onValueChange,
    } = props;
    const [isOpened, setIsOpened] = useState(false);

    const toggle = () => setIsOpened(!isOpened);

    const handleChange = useCallback(
        (filterValue: TFilter[keyof TFilter]) => {
            onValueChange({
                ...value,
                [filterConfig.field]: filterValue,
            } as TFilter);
        },
        [filterConfig.field, value, onValueChange],
    );

    const renderPicker = () => {
        switch (filterConfig.type) {
            case 'singlePicker':
                return (
                    <PickerList
                        dataSource={ filterConfig.dataSource }
                        selectionMode="single"
                        value={ value?.[filterConfig.field] }
                        onValueChange={ handleChange }
                        valueType="id"
                    />
                );
            case 'multiPicker':
                return (
                    <PickerList
                        dataSource={ filterConfig.dataSource }
                        selectionMode="multi"
                        value={ value?.[filterConfig.field] as TFilter[] }
                        onValueChange={ handleChange }
                        valueType="id"
                    />
                );
            case 'datePicker':
                return (
                    <DatePicker
                        format="DD/MM/YYYY"
                        value={ value?.[filterConfig.field] as string }
                        onValueChange={ handleChange }
                    />
                );
            case 'rangeDatePicker':
                return <RangeDatePicker value={ value?.[filterConfig.field] as RangeDatePickerValue } onValueChange={ handleChange } />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className={ css.title } onClick={ toggle }>
                <div>{props.filterConfig.title}</div>
                <IconContainer
                    icon={ ArrowDown }
                    flipY={ isOpened }
                    cx={ css.icon }
                />
            </div>

            {isOpened && <div>{renderPicker()}</div>}
        </div>
    );
}

export const Filter = /* @__PURE__ */React.memo(FilterImpl) as typeof FilterImpl;
