import * as React from 'react';
import cx from 'classnames';
import { findDOMNode } from 'react-dom';
import { RenderAttributes, RenderBlockProps } from 'slate-react';
import { Resizable } from 're-resizable';
import { isClientSide, uuiMod, uuiSkin } from "@epam/uui";
import { DropdownBodyProps, Dropdown } from '@epam/uui-components';
import { ToolbarButton } from '../../implementation/ToolbarButton';
import * as css from './ImageBlock.scss';
import { ReactComponent as AlignLeft } from '../../icons/align-left.svg';
import { ReactComponent as AlignCenter } from '../../icons/align-center.svg';
import { ReactComponent as AlignRight } from '../../icons/align-right.svg';
import { ReactComponent as FullWidth } from '../../icons/align-full-width.svg';

const IMAGE_GLOBAL_CLASS = 'uui-rte-image';

const { FlexRow } = uuiSkin;

interface ImageBlockProps extends RenderBlockProps {
    src?: string;
}

interface ImageSize {
    width: number,
    height: number
}

export class ImageBlock extends React.Component<ImageBlockProps> {
    state = {
        isOpened: false,
    };

    getImageMaxWidth() {
        if (!isClientSide) return 0;
        let editorNode: any = findDOMNode(this.props.editor);
        return editorNode && editorNode.getBoundingClientRect().width - 50;
    }

    isAlign(type: string) {
        return this.props.node.data.get('align') === type;
    }

    toggleBlockAlignment(type: string, props: DropdownBodyProps) {
        props.scheduleUpdate();

        const newData = this.props.node.data.set('align', !this.isAlign(type) ? type : null);

        this.props.editor.setNodeByKey(this.props.node.key, {
            ...this.props.node,
            data: newData,
        });
    }

    getDefaultSizes(naturalWidth: number, naturalHeight: number): ImageSize {
        const imageWidth = naturalWidth > this.getImageMaxWidth() ? this.getImageMaxWidth() : naturalWidth;
        const imageRatio = naturalWidth / naturalHeight;

        return {
            width: imageWidth,
            height: imageWidth / imageRatio,
        };
    }

    setMaxWidth = () => {
        const imageSizes: ImageSize = this.props.node.data.get('imageSize');
        const imageRatio = imageSizes.width / imageSizes.height;
        this.setSize({ width: this.getImageMaxWidth(), height: this.getImageMaxWidth() / imageRatio });
        this.setState({ isOpened: false });
    }

    setSize = (data: ImageSize) => {
        const newData = this.props.node.data.set('imageSize', data);

        this.props.editor.setNodeByKey(this.props.node.key, {
            ...this.props.node,
            data: newData,
        });
    }

    renderToolbar(props: DropdownBodyProps) {
        return (
            <div className={ cx(css.imageToolbar, 'slate-prevent-blur') }>
                <ToolbarButton isActive={ this.isAlign('align-left') } icon={ AlignLeft } onClick={ () => this.toggleBlockAlignment('align-left', props) } />
                <ToolbarButton isActive={ this.isAlign('align-center') } icon={ AlignCenter } onClick={ () => this.toggleBlockAlignment('align-center', props) } />
                <ToolbarButton isActive={ this.isAlign('align-right') } icon={ AlignRight } onClick={ () => this.toggleBlockAlignment('align-right', props) } />
                <ToolbarButton isActive={ this.props.node.data.get('imageSize')?.width === this.getImageMaxWidth() } icon={ FullWidth } onClick={ () => this.setMaxWidth() } />
            </div>
        );
    }

    renderImage(attributes: RenderAttributes, src: string) {
        const size: ImageSize = this.props.node.data.get('imageSize') || { width: 0, height: 0 };
        const imageRatio = size.width / size.height;

        return <Resizable
            size={ { width: size.width, height: size.height } }
            onResizeStop={ (_, __, ref) => this.setSize({ width: ref.clientWidth, height: ref.clientHeight }) }
            onResize={ () => this.state.isOpened && this.setState({ isOpened: false }) }
            maxWidth={ this.getImageMaxWidth() }
            maxHeight={ this.getImageMaxWidth() / imageRatio }
            lockAspectRatio={ true }
            enable={ this.props.readOnly ? {} : undefined }
        >
            <img
                onFocus={ () => !this.props.readOnly && this.setState({ isOpened: true }) }
                tabIndex={ 0 }
                className={ cx(css.container, this.props.isFocused ? uuiMod.focus : null, !this.props.readOnly ? css.containerHover : null, IMAGE_GLOBAL_CLASS) }
                { ...attributes }
                ref={ attributes.ref }
                src={ src }
                onLoad={ e => {
                    const target = e.target as HTMLImageElement;
                    const sizes = this.props.node.data.get('imageSize');
                    this.setSize(sizes || this.getDefaultSizes(target.naturalWidth, target.naturalHeight));
                    this.forceUpdate();
                } }
            />
                <div className={ cx(css.leftTopDot, css.dot) } />
                <div className={ cx(css.rightTopDot, css.dot) } />
                <div className={ cx(css.leftBotDot, css.dot) } />
                <div className={ cx(css.rightBotDot, css.dot) } />
        </Resizable>;
    }


    render() {
        const { attributes, node } = this.props;
        const src: string = node.data.get('src');
        return src ? (
            <Dropdown
                renderTarget={ () => (
                    <div className={ cx(css.wrapper, css[this.props.node.data.get('align')]) }>
                        <div className={ !this.props.readOnly ? css.containerWrapper : undefined }>
                            { this.renderImage(attributes, src) }
                        </div>
                    </div>
                ) }
                renderBody={ props => <FlexRow cx={ css.imageToolbarWrapper }>{ this.renderToolbar(props) }</FlexRow> }
                value={ this.props.isFocused }
                placement='top'
            />
        ) : null;
    }
}
