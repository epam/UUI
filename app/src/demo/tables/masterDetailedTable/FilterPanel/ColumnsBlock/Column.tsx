import React, { ReactNode, useCallback } from 'react';
import css from './Column.module.scss';
import { ColumnsConfig, IEditable } from '@epam/uui-core';
import { Checkbox } from '@epam/uui';

interface IColumnProps extends IEditable<ColumnsConfig> {
    columnInfo: {
        key: string;
        caption: ReactNode;
        isVisible: boolean;
        isDisabled: boolean;
    };
}

const Column: React.FC<IColumnProps> = ({ value, onValueChange, columnInfo }) => {
    const handleChange = useCallback(
        (newValue: boolean) => {
            const newColumnsConfig = { ...value };
            newColumnsConfig[columnInfo.key] = {
                ...newColumnsConfig[columnInfo.key],
                isVisible: newValue,
            };
            onValueChange(newColumnsConfig);
        },
        [
            value, onValueChange, columnInfo,
        ],
    );

    return (
        <Checkbox
            value={ columnInfo.isVisible }
            onValueChange={ handleChange }
            label={ columnInfo.caption }
            isDisabled={ columnInfo.isDisabled }
            key={ columnInfo.key }
            cx={ css.item }
        />
    );
};

export default /* @__PURE__ */React.memo(Column);
