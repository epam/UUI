import * as React from 'react';
import * as css from './FileCard.scss';
import { i18n } from '../..';
import { cx, FileUploadResponse, formatBytes, IClickable, IHasCX, uuiMod } from '@epam/uui-core';
import { SvgCircleProgress } from './';
import { FlexCell, FlexRow, IconButton, IconContainer, Text, Tooltip } from '../';
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
import { ReactComponent as ErrorIcon } from '../../icons/notification-error-fill-10.svg';

type WithError = { uploadError: { isError: boolean, message?: string } };

export interface FileCardProps extends IClickable, IHasCX {
    file: { progress?: number } & Partial<FileUploadResponse & WithError>;
    width?: number;
}

export const FileCard = React.forwardRef<HTMLDivElement, FileCardProps>((props, ref) => {
    const [isLoading, setLoading] = React.useState<boolean>(props.file.progress !== undefined);

    const { file } = props;

    React.useEffect(() => {
        if (file?.progress === 100 && isLoading) {
            setLoading(false);
        }
    }, [file, isLoading]);

    const getIcon = (extension: string) => {
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
    };

    const { cx: componentCx, width, file: { progress, size, name, extension, uploadError }, onClick } = props;
    const fileExtension = extension || name?.split('.').pop();
    const fileName = name?.split('.').slice(0, -1).join('');

    return (
        <FlexCell ref={ ref }
                  cx={ cx(css.fileCardWrapper, isLoading && uuiMod.loading, componentCx, uploadError.isError && css.errorCardWrapper) }
                  minWidth={ width }
                  width={ !width ? '100%' : undefined } >
            <FlexRow cx={ css.fileCardRow } size='36' alignItems='top' spacing='6'>
                { fileExtension && getIcon(fileExtension) }
                <FlexCell width="100%">
                    <Text size="18" fontSize="14" lineHeight="18" color={ progress < 100 ? 'gray60' : 'gray80' } cx={ css.fileName }>
                        { fileName }
                    </Text>
                    { file.uploadError.isError
                        ? <Tooltip trigger="hover" content={ file.uploadError.message } placement="bottom-start">
                            <Text cx={ css.errorBlock } fontSize="12" lineHeight="12" color="red-darkest">
                                <ErrorIcon/>
                                { "Upload failed" }
                            </Text>
                        </Tooltip>
                        : <Text size="18" fontSize="14" lineHeight="18" color="gray60">
                            { fileExtension && `${ fileExtension.toUpperCase() }, ` }
                            { isLoading && formatBytes(size / 100 * progress) + i18n.fileCard.fileSizeProgress }
                            { formatBytes(size) }
                        </Text> }
                </FlexCell>
                <FlexCell minWidth={ 18 }>
                    { isLoading ? (
                        <SvgCircleProgress progress={ progress } size={ 18 } />
                    ) : onClick && (
                        <IconButton icon={ RemoveIcon } onClick={ onClick } />
                    ) }
                </FlexCell>
            </FlexRow>
        </FlexCell>
    );
});