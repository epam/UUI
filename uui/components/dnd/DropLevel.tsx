import * as React from 'react';
import { FlexCell } from '@epam/uui-components';
import { DropLevelProps } from '@epam/uui-core';
import css from './DropLevel.module.scss';

export function DropLevel<TId>(props: DropLevelProps<TId>) {
    const getIndent = (level: number) => {
        switch (props.size) {
            case '24':
                return level * 6;
            case '30':
            case '36':
                return level * 12;
            case '42':
            case '48':
            case '60':
                return level * 24;
            default:
                return level * 24;
        }
    };

    const getFoldingWidth = () => {
        switch (props.size) {
            case '24':
                return 12;
            case '30':
            case '36':
                return 18;
            case '42':
            case '48':
            case '60':
                return 24;
            default:
                return 12;
        }
    };

    const getCheckboxWidth = () => {
        const additionalItemSize = +props.size < 30 ? 12 : 18;
        return additionalItemSize;
    };

    const getDropLevelWidth = (level: number) => {
        const foldingWidth = getFoldingWidth();
        if (level === 0) {
            const checkboxWidth = props.row.isCheckable ? getCheckboxWidth() : 0;
            return getIndent(1) + foldingWidth + checkboxWidth;
        }

        return getIndent(1) + foldingWidth;
    };

    const isActiveLevel = props.isDraggedOver && props.draggingOverLevel !== null && props.level >= props.draggingOverLevel;
    const width = props.level <= props.path.length + 1 ? getDropLevelWidth(props.level) : '100%';

    return (
        <FlexCell
            width={ width }
            minWidth={ getDropLevelWidth(props.level) }
            cx={ [css.dropLevel, props.isDraggedOver ? css.dropLevelDraggingOverRow : false, isActiveLevel ? css.dropLevelActive : false] }
            rawProps={ { onPointerEnter: props.onPointerEnter(props.id, props.position, props.level) } }
        >
        </FlexCell>
    );
}
