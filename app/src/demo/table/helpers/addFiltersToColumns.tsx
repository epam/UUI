// import React from "react";
// import { DataColumnProps, IEditable, ILens } from "@epam/uui";
// import { ColumnPickerFilter, DatePicker, RangeDatePicker } from "@epam/promo";
// import { FilterConfig } from "../types";
//
// export const addFiltersToColumns = <TFilter extends Record<string, any>>(columns: DataColumnProps<any>[], filters: FilterConfig<TFilter>[]) => {
//     const makeFilterRenderCallback = (key: string) => {
//         const filter = filters.find(f => f.columnKey === key);
//
//         const Filter = (props: IEditable<any>) => {
//             switch (filter.type) {
//                 case "singlePicker":
//                     return (
//                         <ColumnPickerFilter
//                             dataSource={ filter.dataSource }
//                             selectionMode="single"
//                             valueType="id"
//                             getName={ i => i?.name || "Not Specified" }
//                             showSearch
//                             { ...props }
//                         />
//                     );
//                 case "multiPicker":
//                     return (
//                         <ColumnPickerFilter
//                             dataSource={ filter.dataSource }
//                             selectionMode="multi"
//                             valueType="id"
//                             getName={ i => i?.name || "Not Specified" }
//                             showSearch
//                             { ...props }
//                         />
//                     );
//                 case "datePicker":
//                     return <DatePicker format="DD/MM/YYYY" { ...props }/>;
//                 case "rangeDatePicker":
//                     return <RangeDatePicker { ...props }/>;
//             }
//         };
//
//         return (filterLens: ILens<any>) => {
//             if (!filter) return null;
//
//             const props = filterLens.prop(filter.field).toProps();
//             return <Filter { ...props } />;
//         };
//     };
//
//     const filterKeys = filters.map(f => f.columnKey);
//     return columns.map(column => {
//         if (filterKeys.includes(column.key)) {
//             return {
//                 ...column,
//                 renderFilter: makeFilterRenderCallback(column.key),
//             };
//         } else {
//             return column;
//         }
//     });
// };