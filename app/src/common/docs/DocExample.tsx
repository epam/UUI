import React from 'react';
import { Switch, FlexRow } from '@epam/promo';
import { EditableDocContent } from './EditableDocContent';
import { svc } from '../../services';
import type { FilesRecord } from '../../data/codesandbox/getCodesandboxConfig';
import css from './DocExample.module.scss';
import { CodesandboxLink } from './CodesandboxLink';
import { Code } from './Code';
import cx from 'classnames';
import { docExampleLoader } from './docExampleLoader';
import { TTheme } from '../../data';
import { LinkButton, FlexSpacer } from '@epam/uui';
import { ReactComponent as PreviewIcon } from '@epam/assets/icons/common/media-fullscreen-12.svg';
import { getCurrentTheme } from '../../helpers';

interface DocExampleProps {
    path: string;
    title?: string;
    onlyCode?: boolean;
    width?: number | 'auto';
    cx?: string;
    disableCodesandbox?: boolean;
}

interface DocExampleState {
    showCode: boolean;
    component?: any;
    code?: string;
    raw?: string;
    stylesheets?: FilesRecord;
}

const EXAMPLES_PATH_PREFIX = './_examples';

export class DocExample extends React.Component<DocExampleProps, DocExampleState> {
    componentDidMount(): void {
        const { path, onlyCode } = this.props;

        if (!onlyCode) {
            const exPathRelative = `.${path.substring(EXAMPLES_PATH_PREFIX.length)}`;
            docExampleLoader({ path: exPathRelative }).then((component) => {
                this.setState({ component });
            });
        }

        svc.api
            .getCode({ path })
            .then((r) => this.setState({ code: r.highlighted, raw: r.raw }));
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

    private onSwitchValueChange = (val: boolean) => {
        this.setState({ showCode: val });
    };

    private renderCode(): React.ReactNode {
        return (
            <Code codeAsHtml={ this.state.code } />
        );
    }

    private renderPreview() {
        const { raw } = this.state;
        const { path } = this.props;
        const dirPath = path.split('/').slice(0, -1);
        const theme = getCurrentTheme();
        return (
            <>
                <FlexRow size={ null } vPadding="48" padding="24" borderBottom alignItems="top" columnGap="12">
                    {this.state.component && React.createElement(this.state.component)}
                </FlexRow>
                <div className={ css.containerFooterWrapper }>
                    <FlexRow padding="12" vPadding="12" cx={ [css.containerFooter] } columnGap="12">
                        <Switch value={ this.state.showCode } onValueChange={ this.onSwitchValueChange } label="View code" />
                        <FlexSpacer />
                        { !this.props.disableCodesandbox && <CodesandboxLink raw={ raw } dirPath={ dirPath } /> }
                        <DocExampleFsBtn path={ path } theme={ theme } />
                    </FlexRow>
                </div>
                {this.state.showCode && this.renderCode()}
            </>
        );
    }

    render() {
        return (
            <div className={ cx(css.container, this.props.cx) }>
                <EditableDocContent title={ this.props.title } fileName={ this.getDescriptionFileName() } />
                <div className={ css.previewContainer } style={ { width: this.props.width } }>
                    {this.props.onlyCode ? this.renderCode() : this.renderPreview()}
                </div>
            </div>
        );
    }
}

const LABELS = {
    Fullscreen: 'Fullscreen',
};
function DocExampleFsBtn(props: { path: string; theme: TTheme }) {
    const regex = /^\.\/_examples\/(.*)\/(\w+)\.example\.tsx$/;
    const examplePath = props.path.replace(regex, '$1/$2');
    const href = `/docExample?theme=${encodeURIComponent(props.theme)}&examplePath=${encodeURIComponent(examplePath)}`;
    return (
        <LinkButton
            target="_blank"
            icon={ PreviewIcon }
            iconPosition="right"
            href={ href }
            caption={ LABELS.Fullscreen }
            size="36"
        />
    );
}
