// import React, { useCallback } from "react";
// import css from "./FiltersToolbarItem.scss";
// import { FilterConfig, IEditable } from "@epam/uui-core";
// import { DatePicker, DataPickerBody, RangeDatePicker } from "@epam/promo";
// import { RangeDatePickerValue } from "@epam/uui-components";
//
// type FiltersToolbarItemProps<TFilter extends Record<string, any>> = FilterConfig<TFilter> & IEditable<TFilter>;
//
// const FiltersToolbarItemImpl = (props: FiltersToolbarItemProps<any>) => {
//     const handleChange = useCallback((value: any) => {
//         props.onValueChange({ [props.field]: value });
//     }, [props.field, props.onValueChange]);
//
//
//     const renderBody = () => {
//         switch (props.type) {
//             case "singlePicker": {
//                 const view = props.dataSource.getView(props.value, props.onValueChange, {});
//
//                 return (
//                     <DataPickerBody
//                         value={ props.value }
//                         onValueChange={ props.onValueChange }
//                         rows={ view.getVisibleRows() }
//                     />
//                 );
//             }
//
//             case "multiPicker":
//                 return (
//
//                 );
//             case "datePicker":
//                 return (
//                     <DatePicker
//                         format="DD/MM/YYYY"
//                         value={ props.value?.[props.field] as string }
//                         onValueChange={ handleChange }
//                     />
//                 );
//             case "rangeDatePicker":
//                 return (
//                     <RangeDatePicker
//                         value={ props.value?.[props.field] as RangeDatePickerValue }
//                         onValueChange={ handleChange }
//                     />
//                 );
//         }
//     };
//
//     return (
//         <div>
//             <div>header</div>
//             { renderBody() }
//         </div>
//     );
// };
//
// export const FiltersToolbarItem = React.memo(FiltersToolbarItemImpl);