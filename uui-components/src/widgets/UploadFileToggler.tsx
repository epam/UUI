import * as React from 'react';
import * as css from './UploadFileToggler.scss';
import { IHasRawProps, IHasCX, cx } from '@epam/uui';

interface UploadFileTogglerRenderParams {
    onClick(): any;
}

export interface UploadFileTogglerProps extends IHasRawProps<HTMLInputElement>, IHasCX {
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

    handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
            this.onClick();
        }
    }

    render() {
        const params: UploadFileTogglerRenderParams = {
            onClick: this.onClick,
        };

        return (
            <label className={ cx(css.root, this.props.cx) } onKeyDown={ this.handleKeyDown } tabIndex={ 0 }>
                <input
                    className={ css.fileInput }
                    ref={ (ref) => { this.fileInput = ref; } }
                    onChange={ e => { this.props.onFilesAdded(Array.prototype.slice.call(e.currentTarget.files, 0));  e.currentTarget.value = null; } }
                    type="file"
                    multiple={ !this.props.single }
                    accept={ this.props.accept }
                    { ...this.props.rawProps }
                />
                { this.props.render(params) }
            </label>
        );
    }
}
