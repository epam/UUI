import * as React from 'react';
import { Portal } from "@epam/uui-components";
import * as css from './TableBar.scss';
import * as ReactDOM from "react-dom";
import { ReactComponent as InsertColumnAfter } from "../icons/table-add-column-right.svg";
import { ReactComponent as InsertColumnBefore } from "../icons/table-add-column-left.svg";
import { ReactComponent as InsertRowAfter } from "../icons/table-add-row-after.svg";
import { ReactComponent as InsertRowBefore } from "../icons/table-add-row-before.svg";
import { ReactComponent as RemoveColumn } from "../icons/table-delete-column.svg";
import { ReactComponent as RemoveRow } from "../icons/table-delete-row.svg";
import { ReactComponent as UnmergeCellsIcon } from '../icons/table-un-merge.svg';
import { ReactComponent as RemoveTable } from '../icons/table-table_remove-24.svg';
import { Editor } from 'slate-react';
import { Popper } from 'react-popper';
import { LayoutLayer, UuiContext, UuiContexts } from "@epam/uui";
import cx from 'classnames';
import { ToolbarButton } from './ToolbarButton';

interface TableProps {
    editor: Editor;
    isVisible: boolean;
}

export class TableBar extends React.Component<TableProps, any> {
    public static contextType = UuiContext;
    public context: UuiContexts;

    tablebar: HTMLElement;
    private layer: LayoutLayer = null;


    constructor(props: TableProps, context: UuiContexts) {
        super(props);
        this.layer = context.uuiLayout && context.uuiLayout.getLayer();
    }

    componentWillUnmount() {
        this.context.uuiLayout.releaseLayer(this.layer);
    }

    virtualReferenceElement() {
        if (!this.tablebar) {
            return;
        }
        const toolbar: HTMLElement = ReactDOM.findDOMNode(this.tablebar) as any;
        return {
            getBoundingClientRect: () => {
                let cellCoordPath = this.props.editor.value.document.getPath(this.props.editor.value.anchorBlock.key);
                let CellCoord: any = (this.props.editor.findDOMNode(cellCoordPath) as any).getBoundingClientRect();
                return CellCoord;
            },
            clientWidth: toolbar && toolbar.getBoundingClientRect().width,
            clientHeight: toolbar && toolbar.getBoundingClientRect().height,
        };
    }

    isBlock = (blockType: string) => {
        return this.props.editor.value.anchorBlock && (this.props.editor.value.anchorBlock.type === blockType || (this.props.editor.value.document.getParent(this.props.editor.value.anchorBlock.key) as any).type === blockType);
    }

    isTableCell = () => {
        return this.isBlock('table_cell') || this.isBlock('table_header_cell');
    }

    isMerged = () => {
        return this.props.editor.value.anchorBlock
         && (this.props.editor.value.anchorBlock.data.get('colSpan') > 1
            || (this.props.editor.value.anchorBlock.data.get('rowSpan') > 1
            || (this.props.editor.value.document.getParent(this.props.editor.value.anchorBlock.key) as any).data.get('colSpan') > 1)
            || (this.props.editor.value.document.getParent(this.props.editor.value.anchorBlock.key) as any).data.get('rowSpan') > 1);
    }

    render() {
        if (!this.props.editor || this.props.editor.readOnly) {
            return null;
        }

        return (
            <Portal>
                 { this.isTableCell() && this.props.isVisible && <Popper referenceElement={ this.virtualReferenceElement() } placement='bottom' modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }>
                    { (props) => {
                        return (
                            <div ref={ (node) => { this.tablebar = node; (props.ref as React.RefCallback<any>)(node); } } onMouseDown={ (e: any) => e.preventDefault() } className={ cx(css.container, 'uui-rte-tablebar') } style={ { ...props.style, zIndex: this.layer.zIndex } } >
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).addNewColumn(this.props, 'before'); } } icon={ InsertColumnBefore }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).addNewColumn(this.props); } } icon={ InsertColumnAfter }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).removeSelectedColumn(this.props); } } icon={ RemoveColumn }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).addNewRow(this.props, 'before'); } } icon={ InsertRowBefore }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).addNewRow(this.props); } } icon={ InsertRowAfter }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).removeSelectedRow(this.props); } } icon={ RemoveRow }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).removeTable(); } } icon={ RemoveTable }/>
                                { this.isMerged() && <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).unmergeCells(this.props, [this.props.editor.value.anchorBlock]); } } icon={ UnmergeCellsIcon }/> }
                            </div>
                        );
                    } }
                </Popper> }
            </Portal>
        );
    }
}
