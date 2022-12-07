import * as React from 'react';
import { cx, IHasRawProps } from '@epam/uui-core';
import { DropSpot as UuiDropSpot, DropSpotRenderParams, UploadFileToggler } from '@epam/uui-components';
import css from './DropSpot.scss';
import { Anchor, FlexRow, IconContainer, Text } from '../';
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
                <div { ...props.eventHandlers } className={ css.dropArea } >
                    <FlexRow size='24' spacing='6' >
                        <IconContainer color='blue' icon={ ShapeIcon } />
                        <Text lineHeight='24' size='24' fontSize='14' font='sans-semibold'> { i18n.fileUpload.labelStart } </Text>
                        <UploadFileToggler
                            onFilesAdded={ this.props.onUploadFiles }
                            render={ (props) => <Text lineHeight='24' size='24' fontSize='14' font='sans-semibold' ><Anchor { ...props } cx={ css.link }>{ i18n.fileUpload.browse }</Anchor></Text> }
                            accept={ this.props.accept }
                            single={ this.props.single }
                        />
                        <Text lineHeight='24' size='24' fontSize='14' font='sans-semibold'>{ i18n.fileUpload.labelEnd }</Text>
                    </FlexRow>
                    { this.props.infoText && <Text lineHeight='24' size='24' fontSize='14' color='gray60'>{ this.props.infoText }</Text> }
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
