import * as React from 'react';
import { cx } from '@epam/uui';
import { DropSpot as UuiDropSpot, DropSpotRenderParams, UploadFileToggler } from '@epam/uui-components';
import * as css from './DropSpot.scss';
import { Anchor, FlexRow, IconContainer, Text } from '../';
import * as shapeIcon from '../../icons/fileUpload/shape.svg';

export interface DropSpotProps {
    cx?: string;
    infoText?: string;
    onUploadFiles(files: File[]): any;
    accept?: string;
    single?: boolean;
}

export class DropSpot extends React.Component<DropSpotProps> {

    renderAttachmentArea = (props: DropSpotRenderParams) => {
        return (
            <div className={ cx(css.root, this.props.cx, props.isDragStart && css.dropStart) }>
                <div { ...props.eventHandlers } className={ css.dropArea } >
                        <FlexRow size='24' spacing='6' >
                            <IconContainer color='blue' icon={ shapeIcon } />
                            <Text lineHeight='24' size='24' fontSize='14' font='sans-semibold'> Drop files to attach or </Text>
                            <UploadFileToggler
                                onFilesAdded={ this.props.onUploadFiles }
                                render={ (props) => <Text lineHeight='24' size='24' fontSize='14' font='sans-semibold' ><Anchor { ...props } cx={ css.link } >browse</Anchor></Text> }
                                accept={ this.props.accept }
                                single={ this.props.single }
                            />
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