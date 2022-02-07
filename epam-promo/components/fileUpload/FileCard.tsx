import * as React from 'react';
import * as css from './FileCard.scss';
import { i18n } from '../..';
import { cx, FileUploadResponse, formatBytes, IClickable, IHasCX, IHasForwardedRef, uuiMod } from '@epam/uui';
import { SvgCircleProgress } from './';
import { FlexCell, FlexRow, IconButton, IconContainer, Text } from '../';
import { ReactComponent as RemoveIcon } from '@epam/assets/icons/common/navigation-close-18.svg';
import { ReactComponent as DocIcon } from '../../icons/fileUpload/file-file_word-24.svg';
import { ReactComponent as ExelIcon } from '../../icons/fileUpload/file-file_excel-24.svg';
import { ReactComponent as PdfIcon } from '../../icons/fileUpload/file-file_pdf-24.svg';
import { ReactComponent as ImgIcon } from '../../icons/fileUpload/file-file_image-24.svg';
import { ReactComponent as VideoIcon } from '../../icons/fileUpload/file-file_video-24.svg';
import { ReactComponent as TableIcon } from '../../icons/fileUpload/file-file_table-24.svg';
import { ReactComponent as TextIcon } from '../../icons/fileUpload/file-file_text-24.svg';
import { ReactComponent as MailIcon } from '../../icons/fileUpload/file-file_eml-24.svg';
import { ReactComponent as FileIcon } from '../../icons/fileUpload/file-file-24.svg';

export interface FileCardProps extends IClickable, IHasCX, IHasForwardedRef<HTMLDivElement> {
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

    componentDidUpdate(prevProps: Readonly<FileCardProps>) {
        if (prevProps !== this.props && this.props.file?.progress === 100) {
            this.setState({ loading: false });
        }
    }

    getIcon(extension?: string) {
        switch (extension) {
            case 'doc':
            case 'docx': return <IconContainer size={ 24 } icon={ DocIcon } cx={ css.docColor } />;
            case 'xls':
            case 'xlsx': return <IconContainer size={ 24 } icon={ ExelIcon } cx={ css.xlsColor } />;
            case 'pdf': return <IconContainer size={ 24 } icon={ PdfIcon } cx={ css.pdfColor } />;
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'svg':
            case 'png':
            case 'webp': return <IconContainer size={ 24 } icon={ ImgIcon } cx={ css.imgColor } />;
            case 'avi':
            case 'mov':
            case 'mp4':
            case 'wmw':
            case 'mkv': return <IconContainer size={ 24 } icon={ VideoIcon } cx={ css.movieColor } />;
            case 'csv':
            case 'xml': return <IconContainer size={ 24 } icon={ TableIcon } cx={ css.xmlColor } />;
            case 'rtf':
            case 'txt': return <IconContainer size={ 24 } icon={ TextIcon } cx={ css.textColor } />;
            case 'eml':
            case 'emlx': return <IconContainer size={ 24 } icon={ MailIcon } cx={ css.emlColor } />;
            default: return <IconContainer size={ 24 } icon={ FileIcon } cx={ css.defaultColor } />;
        }
    }

    render() {
        const { loading } = this.state;
        const extension = this.props.file.name?.split('.').pop();

        return (
            <FlexCell ref={ this.props.forwardedRef } cx={ cx(css.fileCardWrapper, loading && uuiMod.loading, this.props.cx) } minWidth={ this.props.width } width={ !this.props.width ? '100%' : undefined } >
                <FlexRow cx={ css.fileCardRow } size='36' alignItems='top' spacing='6'>
                    { extension && this.getIcon(extension) }
                    <FlexCell width='100%'>
                        <Text size='18' fontSize='14' lineHeight='18' color={ this.props.file.progress < 100 ? 'gray60' : 'gray80' } cx={ css.fileName } >{ this.props.file.name }</Text>
                        <Text size='18' fontSize='14' lineHeight='18' color='gray60' >
                            { `${extension ? extension.toUpperCase() : ''}, ${ this.props.file.progress !== 100 ? formatBytes(this.props.file.size / 100 * this.props.file.progress) + i18n.fileCard.fileSizeProgress : '' } ${ formatBytes(this.props.file.size) }` }
                        </Text>
                    </FlexCell>
                    <FlexCell minWidth={ 18 }>
                        { loading ? (
                            <SvgCircleProgress progress={ this.props.file.progress } size={ 18 } />
                        ) : this.props.onClick && (
                            <IconButton icon={ RemoveIcon } onClick={ this.props.onClick } />
                        ) }
                    </FlexCell>
                </FlexRow>
            </FlexCell>
        );
    }
}