import * as React from 'react';
import { Portal } from "@epam/uui-components";
import * as css from './TableBar.scss';
import * as ReactDOM from "react-dom";
import * as insertColumnAfter from "../icons/table-add-column-right.svg";
import * as insertColumnBefore from "../icons/table-add-column-left.svg";
import * as insertRowAfter from "../icons/table-add-row-after.svg";
import * as insertRowBefore from "../icons/table-add-row-before.svg";
import * as removeColumn from "../icons/table-delete-column.svg";
import * as removeRow from "../icons/table-delete-row.svg";
import * as unmergeCellsIcon from '../icons/table-un-merge.svg';
import * as removeTable from '../icons/table-table_remove-24.svg';
import { Editor } from 'slate-react';
import { Popper } from 'react-popper';
import { LayoutContext, LayoutLayer } from "@epam/uui";
import cx from 'classnames';
import * as PropTypes from "prop-types";
import { ToolbarButton } from './ToolbarButton';

interface TableProps {
    editor: Editor;
    isVisible: boolean;
}

export class TableBar extends React.Component<TableProps, any> {
    static contextTypes = {
        uuiLayout: PropTypes.object,
    };

    tablebar: HTMLElement;
    private layer: LayoutLayer = null;
    public context: { uuiLayout: LayoutContext };


    constructor(props: TableProps, context: { uuiLayout: LayoutContext }) {
        super(props);
        this.layer = context.uuiLayout && context.uuiLayout.getLayer();
    }

    componentWillUnmount() {
        this.context.uuiLayout.releaseLayer(this.layer);
    }

    virtualReferenceElement() {
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
                 { this.isTableCell() && this.props.isVisible && <Popper referenceElement={ this.virtualReferenceElement() } placement='bottom' modifiers={ { offset: { offset: '0, 12px' } } }>
                    { (props) => {
                        return (
                            <div ref={ (node) => { this.tablebar = node; props.ref(node); } } onMouseDown={ (e: any) => e.preventDefault() } className={ cx(css.container, 'uui-rte-tablebar') } style={ { ...props.style, zIndex: this.layer.zIndex } } >
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).addNewColumn(this.props, 'before'); } } icon={ insertColumnBefore }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).addNewColumn(this.props); } } icon={ insertColumnAfter }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).removeSelectedColumn(this.props); } } icon={ removeColumn }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).addNewRow(this.props, 'before'); } } icon={ insertRowBefore }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).addNewRow(this.props); } } icon={ insertRowAfter }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).removeSelectedRow(this.props); } } icon={ removeRow }/>
                                <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).removeTable(); } } icon={ removeTable }/>
                                { this.isMerged() && <ToolbarButton isActive={ false } onClick={ () => { (this.props.editor as any).unmergeCells(this.props, [this.props.editor.value.anchorBlock]); } } icon={ unmergeCellsIcon }/> }
                            </div>
                        );
                    } }
                </Popper> }
            </Portal>
        );
    }
}
