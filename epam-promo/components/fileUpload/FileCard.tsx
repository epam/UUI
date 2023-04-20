import * as React from 'react';
import css from './FileCard.scss';
import { i18n } from '../..';
import {
    cx, FileUploadResponse, formatBytes, IClickable, IHasCX, uuiMod,
} from '@epam/uui-core';
import { SvgCircleProgress } from './';
import {
    FlexCell, FlexRow, IconButton, IconContainer, Text, Tooltip,
} from '../';
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

export interface FileCardItem extends Partial<File & FileUploadResponse> {
    progress?: number;
    abortXHR?: () => void;
}

export interface FileCardProps extends IClickable, IHasCX {
    file: FileCardItem;
    width?: number;
}

export const FileCard = React.forwardRef<HTMLDivElement, FileCardProps>((props, ref) => {
    const [isLoadingShow, setIsLoadingShow] = React.useState<boolean>(true);

    const { file } = props;

    const getIcon = (extension: string) => {
        switch (extension) {
            case 'doc':
            case 'docx':
                return <IconContainer size={ 24 } icon={ DocIcon } cx={ css.docColor } />;
            case 'xls':
            case 'xlsx':
                return <IconContainer size={ 24 } icon={ ExelIcon } cx={ css.xlsColor } />;
            case 'pdf':
                return <IconContainer size={ 24 } icon={ PdfIcon } cx={ css.pdfColor } />;
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'svg':
            case 'png':
            case 'webp':
                return <IconContainer size={ 24 } icon={ ImgIcon } cx={ css.imgColor } />;
            case 'avi':
            case 'mov':
            case 'mp4':
            case 'wmw':
            case 'mkv':
                return <IconContainer size={ 24 } icon={ VideoIcon } cx={ css.movieColor } />;
            case 'csv':
            case 'xml':
                return <IconContainer size={ 24 } icon={ TableIcon } cx={ css.defaultColor } />;
            case 'rtf':
            case 'txt':
                return <IconContainer size={ 24 } icon={ TextIcon } cx={ css.defaultColor } />;
            case 'eml':
            case 'emlx':
                return <IconContainer size={ 24 } icon={ MailIcon } cx={ css.defaultColor } />;
            default:
                return <IconContainer size={ 24 } icon={ FileIcon } cx={ css.defaultColor } />;
        }
    };

    const {
        cx: componentCx,
        width,
        file: {
            progress, size, name, extension, error, abortXHR,
        },
        onClick,
    } = props;
    const fileExtension = extension || name?.split('.').pop();
    const fileName = name?.split('.').slice(0, -1).join('');
    const isLoading = progress < 100;
    const isCrossShow = ((!isLoadingShow && isLoading) || !isLoading) && onClick;

    const mouseLeaveHandler = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLoadingShow(() => true);
    };

    const mouseEnterHandler = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsLoadingShow(() => false);
    };

    const renderErrorContent = () => (
        <Tooltip trigger="hover" content={ file.error.message } placement="bottom-start">
            <div className={ css.errorBlock }>
                <ErrorIcon />
                Upload failed
            </div>
        </Tooltip>
    );

    const renderSuccessfulContent = () => (
        <Text size="18" fontSize="14" lineHeight="18" color="gray60">
            {fileExtension && `${fileExtension.toUpperCase()}, `}
            {isLoading && formatBytes((size / 100) * progress) + i18n.fileCard.fileSizeProgress}
            {formatBytes(size)}
        </Text>
    );

    const removeHandler = () => {
        progress && progress < 100 && abortXHR();
        onClick();
    };

    return (
        <FlexCell
            ref={ ref }
            cx={ cx(css.fileCardWrapper, isLoading && uuiMod.loading, componentCx, error?.isError && css.errorCardWrapper) }
            minWidth={ width }
            width={ !width ? '100%' : undefined }
        >
            <FlexRow cx={ css.fileCardRow } size="36" alignItems="top" spacing="6">
                {fileExtension && getIcon(fileExtension)}
                <FlexCell width="100%">
                    <Text size="18" fontSize="14" lineHeight="18" color={ progress < 100 ? 'gray60' : 'gray80' } cx={ css.fileName }>
                        {fileName}
                    </Text>
                    {error?.isError ? renderErrorContent() : renderSuccessfulContent()}
                </FlexCell>
                <div className={ cx(css.iconsBlock) } onMouseEnter={ mouseEnterHandler } onMouseLeave={ mouseLeaveHandler }>
                    {isLoadingShow && isLoading && <SvgCircleProgress progress={ progress } size={ 18 } />}
                    {isCrossShow && <IconButton icon={ RemoveIcon } onClick={ removeHandler } />}
                </div>
            </FlexRow>
        </FlexCell>
    );
});
