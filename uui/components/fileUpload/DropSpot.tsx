import * as React from 'react';
import { cx, IHasCX, IHasRawProps } from '@epam/uui-core';
import { DropSpot as UuiDropSpot, DropSpotRenderParams, UploadFileToggler } from '@epam/uui-components';
import { FlexRow, IconContainer } from '../layout';
import { LinkButton } from '../buttons';
import { RichTextView, Text } from '../typography';
import { ReactComponent as ShapeIcon } from '@epam/assets/icons/file-cloud_upload-fill.svg';
import { i18n } from '../../i18n';
import css from './DropSpot.module.scss';

export interface DropSpotProps extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasCX {
    /**
    * Defines the infoText. InfoText is additional information that can be rendered at the bottom of the AttachmentArea.
    */
    infoText?: React.ReactNode;
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

export function DropSpot(props: DropSpotProps) {
    const getInfoText = typeof props.infoText === 'string'
        ? (
            <Text lineHeight="24" size="24" fontSize="14" color="tertiary">
                {props.infoText}
            </Text>
        ) : props?.infoText;

    const renderAttachmentArea = (params: DropSpotRenderParams) => {
        return (
            <div className={ cx(css.root, props.cx, params.isDragStart && css.dropStart, params.isDraggingOver && css.dropOver) } { ...props.rawProps }>
                <div { ...params.eventHandlers } className={ css.dropArea }>
                    <FlexRow size="24">
                        <IconContainer icon={ ShapeIcon } cx={ css.iconBlue } />
                        <Text lineHeight="24" size="24" fontSize="14" cx={ css.dropCaption }>
                            {i18n.fileUpload.labelStart}
                        </Text>
                        <UploadFileToggler
                            onFilesAdded={ props.onUploadFiles }
                            render={ (props) => (
                                <RichTextView>
                                    <LinkButton caption={ i18n.fileUpload.browse } { ...props } cx={ css.link } />
                                </RichTextView>
                            ) }
                            accept={ props.accept }
                            single={ props.single }
                        />
                    </FlexRow>
                    {getInfoText}
                </div>
            </div>
        );
    };

    return <UuiDropSpot render={ renderAttachmentArea } onFilesDropped={ props.onUploadFiles } />;
}
