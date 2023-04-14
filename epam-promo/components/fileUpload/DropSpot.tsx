import * as React from 'react';
import { cx, IHasRawProps } from '@epam/uui-core';
import { DropSpot as UuiDropSpot, DropSpotRenderParams, UploadFileToggler } from '@epam/uui-components';
import css from './DropSpot.scss';
import { Anchor, FlexRow, IconContainer, RichTextView, Text } from '../';
import { ReactComponent as ShapeIcon } from '../../icons/fileUpload/shape.svg';
import { i18n } from "../../i18n";

export interface DropSpotProps extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    cx?: string;
    infoText?: string;
    onUploadFiles(files: File[]): any;
    accept?: string;
    single?: boolean;
}

export class DropSpot extends React.Component<DropSpotProps> {
    renderAttachmentArea = (props: DropSpotRenderParams) => {
        return (
            <div className={ cx(css.root, this.props.cx, props.isDragStart && css.dropStart, props.isDraggingOver && css.dropOver) } { ...this.props.rawProps }>
                <div { ...props.eventHandlers } className={ css.dropArea }>
                    <FlexRow size="24">
                        <IconContainer icon={ ShapeIcon } cx={ css.iconBlue }/>
                        <Text lineHeight="24" size="24" fontSize="14" font="sans"> { i18n.fileUpload.labelStart } </Text>
                        <UploadFileToggler
                            onFilesAdded={ this.props.onUploadFiles }
                            render={ (props) => (
                                <RichTextView>
                                    <Anchor { ...props } cx={ css.link }>{ i18n.fileUpload.browse }</Anchor>
                                </RichTextView>
                            ) }
                            accept={ this.props.accept }
                            single={ this.props.single }
                        />
                    </FlexRow>
                    { this.props.infoText && <Text lineHeight="24" size="24" fontSize="14" color="gray60">{ this.props.infoText }</Text> }
                </div>
            </div>
        );
    }

    render() {
        return <UuiDropSpot
            render={ this.renderAttachmentArea }
            onFilesDropped={ this.props.onUploadFiles }
        />;
    }
}
