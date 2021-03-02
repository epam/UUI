import * as React from 'react';
import * as css from './FileCard.scss';
import { cx, FileUploadResponse, formatBytes, IClickable, IHasCX, uuiMod } from '@epam/uui';
import { SvgCircleProgress } from './';
import { FlexCell, FlexRow, IconButton, IconContainer, Text } from '../';
import * as removeIcon from '@epam/assets/icons/common/navigation-close-18.svg';
import * as docIcon from '../../icons/fileUpload/file-file_word-24.svg';
import * as exelIcon from '../../icons/fileUpload/file-file_excel-24.svg';
import * as pdfIcon from '../../icons/fileUpload/file-file_pdf-24.svg';
import * as imgIcon from '../../icons/fileUpload/file-file_image-24.svg';
import * as videoIcon from '../../icons/fileUpload/file-file_video-24.svg';
import * as tableIcon from '../../icons/fileUpload/file-file_table-24.svg';
import * as textIcon from '../../icons/fileUpload/file-file_text-24.svg';
import * as mailIcon from '../../icons/fileUpload/file-file_eml-24.svg';
import * as fileIcon from '../../icons/fileUpload/file-file-24.svg';

export interface FileCardProps extends IClickable, IHasCX {
    file: { progress?: number } & Partial<FileUploadResponse>;
    width?: number;
}

export interface FileCardState {
    loading: boolean;
}

export class FileCard extends React.Component<FileCardProps, FileCardState> {
    state: FileCardState = {
        loading: true,
    };

    componentDidUpdate(prevProps: Readonly<FileCardProps>, prevState: Readonly<FileCardState>, snapshot?: any) {
        if (prevProps !== this.props && this.props.file?.progress === 100) {
            this.setState({ loading: false });
        }
    }

    getIcon(extension?: string) {
        switch (extension) {
            case 'doc':
            case 'docx': {
                return <IconContainer size={ 24 } icon={ docIcon } cx={ css.docColor }/>;
            }
            case 'xls':
            case 'xlsx': {
                return <IconContainer size={ 24 } icon={ exelIcon } cx={ css.xlsColor }/>;
            }
            case 'pdf': {
                return <IconContainer size={ 24 } icon={ pdfIcon } cx={ css.pdfColor }/>;
            }
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'svg':
            case 'png':
            case 'webp': {
                return <IconContainer size={ 24 } icon={ imgIcon } cx={ css.imgColor }/>;
            }
            case 'avi':
            case 'mov':
            case 'mp4':
            case 'wmw':
            case 'mkv': {
                return <IconContainer size={ 24 } icon={ videoIcon } cx={ css.movieColor }/>;
            }
            case 'csv':
            case 'xml': {
                return <IconContainer size={ 24 } icon={ tableIcon } cx={ css.xmlColor }/>;
            }
            case 'rtf':
            case 'txt': {
                return <IconContainer size={ 24 } icon={ textIcon } cx={ css.textColor }/>;
            }
            case 'eml':
            case 'emlx': {
                return <IconContainer size={ 24 } icon={ mailIcon } cx={ css.emlColor }/>;
            }
            default: {
                return <IconContainer size={ 24 } icon={ fileIcon } cx={ css.defaultColor } />;
            }
        }
    }

    render() {
        const { loading } = this.state;

        return (
            <FlexCell cx={ cx(css.fileCardWrapper, loading && uuiMod.loading, this.props.cx) } minWidth={ this.props.width } width={ !this.props.width ? '100%' : undefined } >
                <FlexRow cx={ css.fileCardRow } size='36' alignItems='top' spacing='6'>
                        { this.getIcon(this.props.file.name?.split('.').pop()) }
                        <FlexCell width={ '100%' }>
                            <Text size='18' fontSize='14' lineHeight='18' color={ this.props.file.progress < 100 ? 'gray60' : 'gray80' } cx={ css.fileName } >{ this.props.file.name }</Text>
                            <Text size='18' fontSize='14' lineHeight='18' color='gray60' >
                                { `${ this.props.file.progress !== 100 ? formatBytes(this.props.file.size / 100 * this.props.file.progress) + ' of ' : '' }${ formatBytes(this.props.file.size) }` }
                            </Text>
                        </FlexCell>
                    <FlexCell minWidth={ 18 } >
                        { loading ? <SvgCircleProgress progress={ this.props.file.progress } size={ 18 } /> : <IconButton icon={ removeIcon } onClick={ this.props.onClick }  /> }
                    </FlexCell>
                </FlexRow>
            </FlexCell>
        );
    }
}