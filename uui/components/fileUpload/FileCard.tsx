import * as React from 'react';
import { i18n } from '../../i18n';
import { cx, FileUploadResponse, formatBytes, IClickable, IHasCX, uuiMod } from '@epam/uui-core';
import { SvgCircleProgress } from './SvgCircleProgress';
import { IconContainer } from '@epam/uui-components';
import { FlexCell, FlexRow } from '../layout';
import { IconButton } from '../buttons';
import { Text } from '../typography';
import { Tooltip } from '../overlays';
import { settings } from '../../settings';

import css from './FileCard.module.scss';

export interface FileCardItem extends Partial<File & FileUploadResponse> {
    /**
    * Defines upload progress. It should be numbered value in range from 0 to 100', where 100 means that file fully loaded.
    */
    progress?: number;
    /**
    * Callback to handle aborted event which fired when a request has been aborted.
    * See {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/abort_event} for details
    */
    abortXHR?: () => void;
}

export interface FileCardProps extends IClickable, IHasCX {
    /** Defines file card item */
    file: FileCardItem;
    /**
     * Defines card width
     * @default '100%'
     */
    width?: number;
}

export const FileCard = React.forwardRef<HTMLDivElement, FileCardProps>((props, ref) => {
    const [isLoadingShow, setIsLoadingShow] = React.useState<boolean>(true);

    const { file } = props;

    const getIcon = (extension: string) => {
        switch (extension) {
            case 'doc':
            case 'docx':
                return <IconContainer size={ 24 } icon={ settings.fileCard.icons.docIcon } cx={ css.docColor } />;
            case 'xls':
            case 'xlsx':
                return <IconContainer size={ 24 } icon={ settings.fileCard.icons.exelIcon } cx={ css.xlsColor } />;
            case 'pdf':
                return <IconContainer size={ 24 } icon={ settings.fileCard.icons.pdfIcon } cx={ css.pdfColor } />;
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'svg':
            case 'png':
            case 'webp':
                return <IconContainer size={ 24 } icon={ settings.fileCard.icons.imgIcon } cx={ css.imgColor } />;
            case 'avi':
            case 'mov':
            case 'mp4':
            case 'wmw':
            case 'mkv':
                return <IconContainer size={ 24 } icon={ settings.fileCard.icons.videoIcon } cx={ css.movColor } />;
            case 'csv':
            case 'xml':
                return <IconContainer size={ 24 } icon={ settings.fileCard.icons.tableIcon } cx={ css.defaultColor } />;
            case 'rtf':
            case 'txt':
                return <IconContainer size={ 24 } icon={ settings.fileCard.icons.textIcon } cx={ css.defaultColor } />;
            case 'eml':
            case 'emlx':
                return <IconContainer size={ 24 } icon={ settings.fileCard.icons.mailIcon } cx={ css.defaultColor } />;
            default:
                return <IconContainer size={ 24 } icon={ settings.fileCard.icons.fileIcon } cx={ css.defaultColor } />;
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
        <Tooltip
            content={ file.error.message }
            placement="bottom-start"
        >
            <div
                className={ css.errorBlock }
                aria-description={ file.error.message }
                aria-label="File Upload Error"
            >
                <IconContainer icon={ settings.fileCard.icons.errorIcon } size={ 12 } />
                {i18n.fileCard.failedUploadErrorMessage}
            </div>
        </Tooltip>
    );

    const renderSuccessfulContent = () => (
        <Text size="none" fontSize="14" lineHeight="18" color="tertiary">
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
            cx={ cx(css.root, 'uui-file_card', (isLoading || error?.isError) && uuiMod.loading, componentCx, error?.isError && uuiMod.error) }
            minWidth={ width }
            width={ !width ? '100%' : undefined }
        >
            <FlexRow alignItems="top" columnGap="6">
                {fileExtension && getIcon(fileExtension)}
                <FlexCell width="100%">
                    <Text size="none" fontSize="14" lineHeight="18" color={ (progress < 100 || error?.isError) ? 'tertiary' : 'primary' } cx={ css.fileName }>
                        {fileName}
                    </Text>
                    {error?.isError ? renderErrorContent() : renderSuccessfulContent()}
                </FlexCell>
                <div className={ cx(css.iconsBlock) } onMouseEnter={ mouseEnterHandler } onMouseLeave={ mouseLeaveHandler }>
                    {isLoadingShow && isLoading && <SvgCircleProgress progress={ progress } size={ 18 } />}
                    {isCrossShow && <IconButton icon={ settings.fileCard.icons.closeIcon } onClick={ removeHandler } />}
                </div>
            </FlexRow>
        </FlexCell>
    );
});
