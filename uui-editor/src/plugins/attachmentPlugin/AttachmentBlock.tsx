import * as React from 'react';
import { RenderBlockProps } from 'slate-react';
import cx from 'classnames';
import { uuiMod, Lens, UuiContexts, uuiSkin, UuiContext } from '@epam/uui-core';
import { IconContainer } from '@epam/uui-components';
import css from './AttachmentBlock.module.scss';
import { ReactComponent as DownloadIcon } from '../../icons/download-icon.svg';
import { ReactComponent as FileIcon } from '../../icons/file-file-24.svg';
import { ReactComponent as DocIcon } from '../../icons/file-file_word-24.svg';
import { ReactComponent as ExelIcon } from '../../icons/file-file_excel-24.svg';
import { ReactComponent as PdfIcon } from '../../icons/file-file_pdf-24.svg';
import { ReactComponent as ImgIcon } from '../../icons/file-file_image-24.svg';
import { ReactComponent as VideoIcon } from '../../icons/file-file_video-24.svg';
import { ReactComponent as TableIcon } from '../../icons/file-file_table-24.svg';
import { ReactComponent as TextIcon } from '../../icons/file-file_text-24.svg';
import { ReactComponent as MailIcon } from '../../icons/file-file_eml-24.svg';

interface AttachmentBlockState {
    progress: number| null;
    fileName: string;
}

const { FlexRow, FlexCell, TextInput } = uuiSkin;

function getReadableFileSizeString(fileSizeInBytes: number) {
    let i = -1;
    let byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1000;
        i++;
    } while (fileSizeInBytes > 1000);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}

export class AttachmentBlock extends React.Component<RenderBlockProps, AttachmentBlockState> {
    static contextType = UuiContext;
    context: UuiContexts;

    state: AttachmentBlockState = {
        fileName: this.props.node.data.get('fileName'),
        progress: null,
    };

    lens = Lens.onState<AttachmentBlockState>(this);

    changeName(name: string) {
        const { editor, node } = this.props;
        editor.setNodeByKey(node.key, {
            ...node as any,
            data: {
                ...this.props.node.data.toObject(),
                fileName: name,
            },
        });
    }

    getIcon() {
        const { data } = this.props.node;
        const type = data.get('extension') && data.get('extension').toLowerCase();
        switch (type) {
            case 'doc':
            case 'docx': {
                return <IconContainer size={ 48 } icon={ DocIcon } cx={ css.docColor }/>;
            }
            case 'xls':
            case 'xlsx': {
                return <IconContainer size={ 48 } icon={ ExelIcon } cx={ css.xlsColor }/>;
            }
            case 'pdf': {
                return <IconContainer size={ 48 } icon={ PdfIcon } cx={ css.pdfColor }/>;
            }
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'webp': {
                return <IconContainer size={ 48 } icon={ ImgIcon } cx={ css.img }/>;
            }
            case 'avi':
            case 'mov':
            case 'mp4':
            case 'wmw':
            case 'mkv': {
                return <IconContainer size={ 48 } icon={ VideoIcon } cx={ css.img }/>;
            }
            case 'csv':
            case 'xml': {
                return <IconContainer size={ 48 } icon={ TableIcon } cx={ css.img }/>;
            }
            case 'rtf':
            case 'txt': {
                return <IconContainer size={ 48 } icon={ TextIcon } cx={ css.img }/>;
            }
            case 'eml':
            case 'emlx': {
                return <IconContainer size={ 48 } icon={ MailIcon } cx={ css.img }/>;
            }
            default: {
                return <IconContainer size={ 48 } icon={ FileIcon } cx={ css.img }/>;
            }
        }
    }

    render() {

        return (
            <FlexRow
                rawProps={ this.props.attributes }
                alignItems='stretch'
                cx={ cx(css.row, this.props.isFocused && uuiMod.focus) }
            >
                <FlexCell width={ 90 } shrink={ 0 } cx={ css.imgBox }>
                    { this.getIcon() }
                </FlexCell>
                <FlexCell width="100%" cx={ css.info }>
                    {
                        this.props.readOnly
                            ? <div className={ css.fileName }> { this.lens.prop('fileName').get() }</div>
                            : <TextInput
                                cx={ css.input }
                                onClick={ (e: any) =>  { e.stopPropagation(); e.preventDefault(); } }
                                placeholder='Describe attachment: book, link...'
                                onBlur={ () => this.changeName(this.state.fileName) }
                                { ...this.lens.prop('fileName').toProps() }
                                isReadonly={ this.props.readOnly }
                            />
                    }
                    <div className={ css.sizeLabel }> { getReadableFileSizeString(this.props.node.data.get('size')) } </div>
                </FlexCell>
                <FlexCell width='auto' shrink={ 0 } cx={ css.imgBox }>
                    <a href={ this.props.node.data.get('path') } download={ true } className={ css.linkWrapper }>
                        <IconContainer icon={ DownloadIcon } cx={ css.img }/>
                    </a>
                </FlexCell>
            </FlexRow>
        );
    }
}
