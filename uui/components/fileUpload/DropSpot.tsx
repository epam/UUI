import * as React from 'react';
import { cx, IHasCX, IHasRawProps } from '@epam/uui-core';
import { DropSpot as UuiDropSpot, DropSpotRenderParams, UploadFileToggler } from '@epam/uui-components';
import { FlexRow, IconContainer } from '../layout';
import { Anchor } from '../navigation';
import { RichTextView, Text } from '../typography';
import { ReactComponent as ShapeIcon } from '../../icons/fileUpload/shape.svg';
import { i18n } from '../../i18n';
import css from './DropSpot.module.scss';

export interface DropSpotProps extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasCX {
    /**
    * Defines the infoText. InfoText is additional information that can be rendered at the bottom of the AttachmentArea.
    */
    infoText?: string;
    /**
    * Called when files was added to the DropSpot.
    */
    onUploadFiles(files: File[]): any;
    /**
    * Hint for expected file type in file upload controls. See {@link https://developer.mozilla.org/en-US/docs/web/html/element/input#accept} for details
    */
    accept?: string;
    /**
    * Whether to allow single or multiple values. See {@link https://developer.mozilla.org/en-US/docs/web/html/element/input#multiple} for details
    */
    single?: boolean;
}

export class DropSpot extends React.Component<DropSpotProps> {
    renderAttachmentArea = (props: DropSpotRenderParams) => {
        return (
            <div className={ cx(css.root, this.props.cx, props.isDragStart && css.dropStart, props.isDraggingOver && css.dropOver) } { ...this.props.rawProps }>
                <div { ...props.eventHandlers } className={ css.dropArea }>
                    <FlexRow size="24">
                        <IconContainer icon={ ShapeIcon } cx={ css.iconBlue } />
                        <Text lineHeight="24" size="24" fontSize="14">
                            {' '}
                            {i18n.fileUpload.labelStart}
                            {' '}
                        </Text>
                        <UploadFileToggler
                            onFilesAdded={ this.props.onUploadFiles }
                            render={ (props) => (
                                <RichTextView>
                                    <Anchor { ...props } cx={ css.link }>
                                        {i18n.fileUpload.browse}
                                    </Anchor>
                                </RichTextView>
                            ) }
                            accept={ this.props.accept }
                            single={ this.props.single }
                        />
                    </FlexRow>
                    {this.props.infoText && (
                        <Text lineHeight="24" size="24" fontSize="14" color="secondary">
                            {this.props.infoText}
                        </Text>
                    )}
                </div>
            </div>
        );
    };

    render() {
        return <UuiDropSpot render={ this.renderAttachmentArea } onFilesDropped={ this.props.onUploadFiles } />;
    }
}
