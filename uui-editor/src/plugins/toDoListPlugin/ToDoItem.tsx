export {};
// import * as React from 'react';
// import { uuiSkin } from '@epam/uui-core';
// import { RenderBlockProps } from "slate-react";
// import css from './ToDoItem.scss';
//
// const { Checkbox, FlexRow } = uuiSkin;
//
// export class ToDoItem extends React.Component<RenderBlockProps, any> {
//
//     onChange = (value: boolean) => {
//         const { editor, node } = this.props;
//         editor.setNodeByKey(node.key, {
//             data: { checked: value },
//             type: 'toDoItem',
//         });
//     }
//
//     render() {
//         const data = this.props.node.data;
//         return (
//             <FlexRow rawProps={ this.props.attributes }>
//                 <div contentEditable={ false } className={ css.checkboxContainer }><Checkbox value={ data.get('checked') } onValueChange={ this.onChange }/></div>
//                 <div className={ css.textContainer }>
//                     { this.props.children }
//                 </div>
//             </FlexRow>
//         );
//     }
// }
