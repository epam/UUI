import * as React from 'react';
import css from './FileCard.module.scss';
import { i18n } from '../../i18n';
import { cx, FileUploadResponse, formatBytes, IClickable, IHasCX, uuiMod } from '@epam/uui-core';
import { SvgCircleProgress } from './SvgCircleProgress';
import { IconContainer } from '@epam/uui-components';
import { FlexCell, FlexRow } from '../../components/layout';
import { IconButton } from '../../components/buttons';
import { Text } from '../../components/typography';
import { Tooltip } from '../../components/overlays';
import { fileIcons } from '../../icons/icons';
import { ReactComponent as RemoveIcon } from '@epam/assets/icons/common/navigation-close-18.svg';
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
                return <IconContainer size={ 24 } icon={ fileIcons.docIcon } cx={ css.docColor } />;
            case 'xls':
            case 'xlsx':
                return <IconContainer size={ 24 } icon={ fileIcons.exelIcon } cx={ css.xlsColor } />;
            case 'pdf':
                return <IconContainer size={ 24 } icon={ fileIcons.pdfIcon } cx={ css.pdfColor } />;
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'svg':
            case 'png':
            case 'webp':
                return <IconContainer size={ 24 } icon={ fileIcons.imgIcon } cx={ css.imgColor } />;
            case 'avi':
            case 'mov':
            case 'mp4':
            case 'wmw':
            case 'mkv':
                return <IconContainer size={ 24 } icon={ fileIcons.videoIcon } cx={ css.movColor } />;
            case 'csv':
            case 'xml':
                return <IconContainer size={ 24 } icon={ fileIcons.tableIcon } cx={ css.defaultColor } />;
            case 'rtf':
            case 'txt':
                return <IconContainer size={ 24 } icon={ fileIcons.textIcon } cx={ css.defaultColor } />;
            case 'eml':
            case 'emlx':
                return <IconContainer size={ 24 } icon={ fileIcons.mailIcon } cx={ css.defaultColor } />;
            default:
                return <IconContainer size={ 24 } icon={ fileIcons.fileIcon } cx={ css.defaultColor } />;
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
        <Tooltip content={ file.error.message } placement="bottom-start">
            <div className={ css.errorBlock }>
                <ErrorIcon />
                Upload failed
            </div>
        </Tooltip>
    );

    const renderSuccessfulContent = () => (
        <Text size="18" fontSize="14" lineHeight="18" color="secondary">
            {fileExtension && `${fileExtension.toUpperCase()}, `}
            {isLoading && formatBytes((size / 100) * progress, 2, false) + i18n.fileCard.fileSizeProgress}
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
            cx={ cx(css.root, 'uui-file_card-wrapper', (isLoading || error?.isError) && uuiMod.loading, componentCx, error?.isError && css.errorCardWrapper) }
            minWidth={ width }
            width={ !width ? '100%' : undefined }
        >
            <FlexRow cx={ css.fileCardRow } size="36" alignItems="top" spacing="6">
                {fileExtension && getIcon(fileExtension)}
                <FlexCell width="100%">
                    <Text size="18" fontSize="14" lineHeight="18" color={ progress < 100 ? 'secondary' : 'primary' } cx={ css.fileName }>
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
