import { ReactComponent as btnCross24 } from './btn-cross-24.svg';
import { ReactComponent as foldingArrow24 } from './folding-arrow-24.svg';
import { ReactComponent as accept24 } from './accept-24.svg';
import { ReactComponent as search24 } from './search-24.svg';
import { ReactComponent as calendar24 } from './calendar-24.svg';
import { ReactComponent as info24 } from './info-24.svg';
import { ReactComponent as DocIcon } from './fileUpload/file-file_word-24.svg';
import { ReactComponent as ExelIcon } from './fileUpload/file-file_excel-24.svg';
import { ReactComponent as PdfIcon } from './fileUpload/file-file_pdf-24.svg';
import { ReactComponent as ImgIcon } from './fileUpload/file-file_image-24.svg';
import { ReactComponent as VideoIcon } from './fileUpload/file-file_video-24.svg';
import { ReactComponent as TableIcon } from './fileUpload/file-file_table-24.svg';
import { ReactComponent as TextIcon } from './fileUpload/file-file_text-24.svg';
import { ReactComponent as MailIcon } from './fileUpload/file-file_eml-24.svg';
import { ReactComponent as FileIcon } from './fileUpload/file-file-24.svg';

export const fileIcons = {
    docIcon: DocIcon,
    exelIcon: ExelIcon,
    pdfIcon: PdfIcon,
    imgIcon: ImgIcon,
    videoIcon: VideoIcon,
    tableIcon: TableIcon,
    textIcon: TextIcon,
    mailIcon: MailIcon,
    fileIcon: FileIcon,
};

export const systemIcons = {
    clear: btnCross24,
    foldingArrow: foldingArrow24,
    accept: accept24,
    search: search24,
    calendar: calendar24,
    info: info24,
} as const;
