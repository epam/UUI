import React from 'react';
import { Switch, FlexRow, IconButton, Button } from '@epam/promo';
import { EditableDocContent } from './EditableDocContent';
import { svc } from '../../services';
import type { FilesRecord } from '../../data/codesandbox/getCodesandboxConfig';
import { codesandboxService } from '../../data/codesandbox/service';
import css from './DocExample.scss';
import { ReactComponent as AnchorIcon } from '@epam/assets/icons/common/action-external_link-18.svg';
import { ReactComponent as CodesandboxIcon } from '../../icons/social-network-codesandbox-24.svg';

interface DocExampleProps {
    path: string;
    title?: string;
    onlyCode?: boolean;
    width?: number | 'auto';
}

interface DocExampleState {
    showCode: boolean;
    component?: any;
    code?: string;
    raw?: string;
    stylesheets?: FilesRecord;
}
const EXAMPLES_PATH_PREFIX = './_examples';

const requireContext = require.context('../../docs/_examples', true, /\.example.(ts|tsx)$/, 'lazy');

export class DocExample extends React.Component<DocExampleProps, DocExampleState> {
    componentDidMount(): void {
        const { path } = this.props;
        const exPathRelative = `.${path.substring(EXAMPLES_PATH_PREFIX.length)}`;
        requireContext(exPathRelative).then((module: any) => {
            this.setState({ component: module.default });
        });

        svc.api
            .getCode({ path })
            .then((r) => {
                this.setState({ code: r.highlighted, raw: r.raw });
                return r.raw;
            })
            .then((raw) => this.getComponentStylesheet(raw));
    }

    state: DocExampleState = {
        showCode: false,
        stylesheets: {},
    };

    private getDescriptionFileName(): string {
        // Files are stored here: "public/docs/content"
        const name = this.props.path
            .replace(new RegExp(/\.example.tsx|\./g), '')
            .replace(/\//g, '-')
            .replace(/^-/, '');

        // next line removes leading underscore
        // i.e. "_examples-alert-Basic.json" -> "examples-alert-Basic.json"
        return name.substring(1);
    }

    private getComponentStylesheet(raw: string): void {
        // Match .example.scss or .scss
        const matcher = /\.\/\w+(?:.example)?.scss/;
        const stylesheets = raw.match(matcher);
        if (stylesheets !== null) {
            stylesheets.forEach((match) => {
                // Compose path from match and current directory path
                const [, filePath] = match.split('/');
                const dirPath = this.props.path.split('/').slice(0, -1);
                const path = dirPath.concat(filePath).join('/');
                svc.api.getCode({ path }).then((stylesheet) => {
                    this.setState((prevState) => ({
                        ...prevState,
                        stylesheets: {
                            ...prevState.stylesheets,
                            [filePath]: { content: stylesheet.raw, isBinary: false },
                        },
                    }));
                });
            });
        }
    }

    private onSwitchValueChange = (val: boolean) => {
        this.setState({ showCode: val });
    };

    private renderCode(): React.ReactNode {
        return <pre className={css.code} dangerouslySetInnerHTML={{ __html: this.state.code }} />;
    }

    private renderPreview() {
        const { raw, stylesheets } = this.state;
        const codesandboxLink = codesandboxService.getCodesandboxLink();
        const codesandboxParameters = codesandboxService.getCodesandboxParameters(raw, stylesheets);

        return (
            <>
                <FlexRow size={null} vPadding="48" padding="24" borderBottom alignItems="top" spacing="12">
                    {this.state.component && React.createElement(this.state.component)}
                </FlexRow>
                <FlexRow padding="12" vPadding="12" cx={css.containerFooter}>
                    <Switch value={this.state.showCode} onValueChange={this.onSwitchValueChange} label="View code" />
                    {codesandboxLink && (
                        <form action={codesandboxLink} method="POST" target="_blank">
                            <input type="hidden" name="parameters" value={codesandboxParameters} />
                            <Button
                                cx={css.externalLink}
                                rawProps={{ type: 'submit' }}
                                fill="light"
                                icon={CodesandboxIcon}
                                iconPosition="right"
                                caption="Open in Codesandbox"
                            />
                        </form>
                    )}
                </FlexRow>
                {this.state.showCode && this.renderCode()}
            </>
        );
    }

    render() {
        return (
            <div className={css.container}>
                {this.props.title && (
                    <FlexRow cx={css.titleRow}>
                        <div id={this.props.title.split(' ').join('_').toLowerCase()} className={css.title}>
                            {this.props.title}
                        </div>
                        <IconButton cx={css.anchor} icon={AnchorIcon} color="blue" href={`#${this.props.title.split(' ').join('_').toLowerCase()}`} />
                    </FlexRow>
                )}
                <EditableDocContent fileName={this.getDescriptionFileName()} />

                <div className={css.previewContainer} style={{ width: this.props.width }}>
                    {this.props.onlyCode ? this.renderCode() : this.renderPreview()}
                </div>
            </div>
        );
    }
}
