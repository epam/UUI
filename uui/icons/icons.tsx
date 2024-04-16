import { ReactComponent as btnCross } from '@epam/assets/icons/navigation-close-outline.svg';
import { ReactComponent as foldingArrow } from '@epam/assets/icons/navigation-chevron_down-outline.svg';
import { ReactComponent as accept } from '@epam/assets/icons/notification-done-outline.svg';
import { ReactComponent as search } from '@epam/assets/icons/action-search-outline.svg';
import { ReactComponent as calendar } from '@epam/assets/icons/action-calendar-fill.svg';
import { ReactComponent as info } from '@epam/assets/icons/notification-info-outline.svg';
import { ReactComponent as DocIcon } from '@epam/assets/icons/file-file_word-fill.svg';
import { ReactComponent as ExelIcon } from '@epam/assets/icons/file-file_excel-fill.svg';
import { ReactComponent as PdfIcon } from '@epam/assets/icons/file-file_pdf-fill.svg';
import { ReactComponent as ImgIcon } from '@epam/assets/icons/file-file_image-fill.svg';
import { ReactComponent as VideoIcon } from '@epam/assets/icons/file-file_video-fill.svg';
import { ReactComponent as TableIcon } from '@epam/assets/icons/file-file_table-fill.svg';
import { ReactComponent as TextIcon } from '@epam/assets/icons/file-file_text-fill.svg';
import { ReactComponent as MailIcon } from '@epam/assets/icons/file-file_eml-fill.svg';
import { ReactComponent as FileIcon } from '@epam/assets/icons/file-file-fill.svg';

export const fileIcons = /* @__PURE__ */(() => ({
    docIcon: DocIcon,
    exelIcon: ExelIcon,
    pdfIcon: PdfIcon,
    imgIcon: ImgIcon,
    videoIcon: VideoIcon,
    tableIcon: TableIcon,
    textIcon: TextIcon,
    mailIcon: MailIcon,
    fileIcon: FileIcon,
}))();

export const systemIcons = /* @__PURE__ */(() => ({
    clear: btnCross,
    foldingArrow: foldingArrow,
    accept: accept,
    search: search,
    calendar: calendar,
    info: info,
} as const))();
