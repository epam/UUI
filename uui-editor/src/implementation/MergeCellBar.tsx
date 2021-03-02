import * as React from 'react';
import { Portal } from "@epam/uui-components";
import * as css from './Toolbar.scss';
import * as ReactDOM from "react-dom";
import { Editor, findDOMNode } from 'slate-react';
import { Popper } from 'react-popper';
import { LayoutContext, LayoutLayer } from "@epam/uui";
import * as PropTypes from "prop-types";
import * as unmergeIcon from "../icons/table-un-merge.svg";
import * as mergeIcon from '../icons/table-merge.svg';
import { ToolbarButton } from './ToolbarButton';
import cx from 'classnames';

interface MergeCellBarProps {
    editor: Editor;
    selectedCells: any[];
    clearSelection: () => any;
}

export class MergeCellBar extends React.Component<MergeCellBarProps, any> {
    static contextTypes = {
        uuiLayout: PropTypes.object,
    };

    tableBar: HTMLElement;
    private layer: LayoutLayer = null;
    public context: { uuiLayout: LayoutContext };


    constructor(props: MergeCellBarProps, context: { uuiLayout: LayoutContext }) {
        super(props);
        this.layer = context.uuiLayout && context.uuiLayout.getLayer();
    }

    componentWillUnmount() {
        this.context.uuiLayout.releaseLayer(this.layer);
    }

    virtualReferenceElement() {
        const toolbar: HTMLElement = ReactDOM.findDOMNode(this.tableBar) as any;

        return {
            getBoundingClientRect: () => {
                let selectedCells = this.props.selectedCells;
                let firstCellPath = this.props.editor.value.document.getPath(this.props.selectedCells[0].key);
                let firstCoord: any = (this.props.editor.findDOMNode(firstCellPath) as any).getBoundingClientRect();
                let lastCoordIndex = selectedCells.length - 1;
                let lastCellPath = this.props.editor.value.document.getPath(this.props.selectedCells[lastCoordIndex].key);
                let lastCoord: any = (this.props.editor.findDOMNode(lastCellPath) as any).getBoundingClientRect();
                let result: any = {};
                for (let key in firstCoord) {
                    result[key] = firstCoord[key];
                }
                while (!lastCoord.right) {
                    lastCoord = findDOMNode(selectedCells[--lastCoordIndex]).getBoundingClientRect();
                }
                result.right = lastCoord.right;
                result.width = firstCoord.width + lastCoord.width;
                return result;
            },
            clientWidth: toolbar && toolbar.getBoundingClientRect().width,
            clientHeight: toolbar && toolbar.getBoundingClientRect().height,
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
                { this.props.selectedCells && this.props.selectedCells.length > 1 && <Popper referenceElement={ this.virtualReferenceElement() } placement='top' modifiers={ { offset: { offset: '0, 12px' } } }>
                    { (props) => {
                        return (
                            <div ref={ (node) => { this.tableBar = node; props.ref(node); } } onMouseDown={ (e: any) => e.preventDefault() } className={ cx(css.container, 'merge-cells-bar') } style={ { ...props.style, zIndex: this.layer.zIndex } } >
                                <ToolbarButton isActive={ false } icon={ mergeIcon } onClick={ () => { (this.props.editor as any).mergeCells(this.props, this.props.selectedCells); this.props.clearSelection(); } } />
                                { this.isSomeMerged(this.props.selectedCells) && <ToolbarButton isActive={ false } icon={ unmergeIcon } onClick={ () => { (this.props.editor as any).unmergeCells(this.props, this.props.selectedCells); this.props.clearSelection(); } } /> }
                            </div>
                        );
                    } }
                </Popper> }
            </Portal>
        );
    }
}