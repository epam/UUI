import * as React from 'react';
import css from './UploadFileToggler.scss';
import { IHasForwardedRef, IHasRawProps } from '@epam/uui-core';

interface UploadFileTogglerRenderParams {
    onClick(): any;
}

interface UploadFileTogglerProps extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>>, IHasForwardedRef<HTMLInputElement> {
    render(props: UploadFileTogglerRenderParams): React.ReactNode;
    onFilesAdded(files: File[]): any;
    accept?: string;
    single?: boolean;
}

export class UploadFileToggler extends React.Component<UploadFileTogglerProps> {
    fileInput = React.createRef<HTMLInputElement>();

    onClick = () => {
        this.fileInput.current?.click();
    };

    render() {
        return (
            <div ref={this.props.forwardedRef} {...this.props.rawProps}>
                <input
                    className={css.fileInput}
                    ref={this.fileInput}
                    onChange={(e) => {
                        this.props.onFilesAdded(Array.prototype.slice.call(e.currentTarget.files, 0));
                        e.currentTarget.value = null;
                    }}
                    type="file"
                    multiple={!this.props.single}
                    accept={this.props.accept}
                />
                {this.props.render({ onClick: this.onClick })}
            </div>
        );
    }
}
