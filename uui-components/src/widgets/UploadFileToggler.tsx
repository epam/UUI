import * as React from 'react';
import * as css from './UploadFileToggler.scss';

interface UploadFileTogglerRenderParams {
    onClick(): any;
}

interface UploadFileTogglerProps {
    render(props: UploadFileTogglerRenderParams): React.ReactNode;
    onFilesAdded(files: File[]): any;
    accept?: string;
    single?: boolean;
}

export class UploadFileToggler extends React.Component<UploadFileTogglerProps, any> {
    fileInput: HTMLElement | null;

    onClick = () => {
        this.fileInput?.click();
    }

    render() {
        const params: UploadFileTogglerRenderParams = {
            onClick: this.onClick,
        };

        return (
            <div>
                <input
                    className={ css.fileInput }
                    ref={ (ref) => { this.fileInput = ref; } }
                    onChange={ e => { this.props.onFilesAdded(Array.prototype.slice.call(e.currentTarget.files, 0));  (e.currentTarget.value as any) = null; } }
                    type="file"
                    multiple={ !this.props.single }
                    accept={ this.props.accept }
                />
                { this.props.render(params) }
            </div>
        );
    }
}
