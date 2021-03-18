import React, { useCallback, useState } from "react";
import css from "./Filter.scss";
import { IconContainer } from "@epam/promo";
import { DataQueryFilter } from "@epam/uui";
import arrowDown from "@epam/assets/icons/common/navigation-chevron-down-18.svg";
import { ITableFilter } from "../../../types";
import { PickerList } from "../../../../../../../loveship";

export interface IFilterProps extends ITableFilter {
    id: string;
    onValueChange: (filter: DataQueryFilter<any>) => void;
}

const Filter: React.FC<IFilterProps> = ({ id, title, dataSource, selectionMode, onValueChange }) => {
    const [isOpened, setIsOpened] = useState(false);
    const [localValue, setLocalValue] = useState(undefined);

    const handleValue = useCallback((value: number[]) => {
        setLocalValue(value);
        const dataQueryFilter = {
            [id]: {
                in: value,
            },
        };
        onValueChange(dataQueryFilter);
    }, [id, onValueChange]);

    const toggle = () => setIsOpened(!isOpened);

    return (
        <div>
            <div className={ css.title } onClick={ toggle }>
                <div>{ title }</div>
                <IconContainer icon={ arrowDown } flipY={ isOpened }/>
            </div>

            { isOpened && (
                <div>
                    <PickerList
                        dataSource={ dataSource }
                        selectionMode={ selectionMode }
                        value={ localValue }
                        onValueChange={ handleValue }
                        valueType="id"
                    />
                </div>
            ) }
        </div>
    );
};

export default React.memo(Filter);