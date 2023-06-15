import * as React from 'react';
import cx from 'classnames';
import { Popper } from 'react-popper';
import { Editor } from 'slate-react';
import { LayoutLayer, UuiContext, UuiContexts } from '@epam/uui-core';
import { Portal } from '@epam/uui-components';
import { ToolbarButton } from './ToolbarButton';
import { ReactComponent as UnmergeIcon } from '../icons/table-un-merge.svg';
import { ReactComponent as MergeIcon } from '../icons/table-merge.svg';
import css from './Toolbar.module.scss';

interface MergeCellBarProps {
    editor: Editor;
    selectedCells: any[];
    clearSelection: () => any;
}

export class MergeCellBar extends React.Component<MergeCellBarProps, any> {
    public static contextType = UuiContext;
    public context: UuiContexts;

    tableBar: HTMLElement;
    private layer: LayoutLayer = null;


    constructor(props: MergeCellBarProps, context: UuiContexts) {
        super(props);
        this.layer = context.uuiLayout && context.uuiLayout.getLayer();
    }

    componentWillUnmount() {
        this.context.uuiLayout.releaseLayer(this.layer);
    }

    virtualReferenceElement() {
        return {
            getBoundingClientRect: () => {
                let selectedCells = this.props.selectedCells;
                let firstCellPath = this.props.editor.value.document.getPath(this.props.selectedCells[0].key);
                // @ts-ignore: Type instantiation is excessively deep and possibly infinite.
                let firstCoord: any = (this.props.editor.findDOMNode(firstCellPath) as any).getBoundingClientRect();
                let lastCoordIndex = selectedCells.length - 1;
                let lastCellPath = this.props.editor.value.document.getPath(this.props.selectedCells[lastCoordIndex].key);
                let lastCoord: any = (this.props.editor.findDOMNode(lastCellPath) as any).getBoundingClientRect();
                let result: any = {};
                for (let key in firstCoord) {
                    result[key] = firstCoord[key];
                }
                while (!lastCoord.right) {
                    lastCoord = (this.props.editor.findDOMNode(selectedCells[--lastCoordIndex]) as any).getBoundingClientRect();
                }
                result.right = lastCoord.right;
                result.width = firstCoord.width + lastCoord.width;
                return result;
            },
            clientWidth: this.tableBar?.getBoundingClientRect().width,
            clientHeight: this.tableBar?.getBoundingClientRect().height,
        };
    }

    isSomeMerged(cells: any) {
        return cells.some((item: any) => {
            return (this.props.editor.value.document.getParent(item.key) as any).data.get('colSpan') > 1 || (this.props.editor.value.document.getParent(item.key) as any).data.get('rowSpan') > 1;
        });
    }

    render() {
        if (!this.props.editor) {
            return null;
        }

        return (
            <Portal>
                { this.props.selectedCells && this.props.selectedCells.length > 1 && <Popper referenceElement={ this.virtualReferenceElement() } placement='top' modifiers={ [{ name: 'offset', options: { offset: [0, 12] } }] }>
                    { (props) => {
                        return (
                            <div ref={ (node) => { this.tableBar = node; (props.ref as React.RefCallback<any>)(node); } } onMouseDown={ (e: any) => e.preventDefault() } className={ cx(css.container, 'merge-cells-bar') } style={ { ...props.style, zIndex: this.layer.zIndex } } >
                                <ToolbarButton isActive={ false } icon={ MergeIcon } onClick={ () => { (this.props.editor as any).mergeCells(this.props, this.props.selectedCells); this.props.clearSelection(); } } />
                                { this.isSomeMerged(this.props.selectedCells) && <ToolbarButton isActive={ false } icon={ UnmergeIcon } onClick={ () => { (this.props.editor as any).unmergeCells(this.props, this.props.selectedCells); this.props.clearSelection(); } } /> }
                            </div>
                        );
                    } }
                </Popper> }
            </Portal>
        );
    }
}
