import React from "react";
import {DataColumnProps} from "../types";

export const dataColumns: DataColumnProps<any>[] = [
    {
        key: "id",
        caption: "ID",
        render: product => <div>{ product.name }</div>,
        isSortable: true,
        isAlwaysVisible: true,
        grow: 0,
        shrink: 0,
        width: 96,
    },
    {
        key: "level",
        caption: "Level",
        render: product => <div>{ product.jobTitle }</div>,
        isSortable: true,
        grow: 0,
        shrink: 0,
        width: 96,
    },
    {
        key: "date",
        caption: "DATE",
        render: product => {
            // console.log(product);
            // return <div>{ product.birthDate }</div>;
        },
        isSortable: true,
        grow: 0,
        shrink: 0,
        width: 96,
    },
];