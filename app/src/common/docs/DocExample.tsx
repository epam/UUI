import React, { RefObject, createRef } from 'react';
import { Switch, FlexRow, IconButton } from '@epam/promo';
import { EditableDocContent } from './EditableDocContent';
import { svc } from '../../services';
import type { FilesRecord } from '../../data/codesandbox/getCodesandboxConfig';
import css from './DocExample.module.scss';
import { ReactComponent as AnchorIcon } from '@epam/assets/icons/common/action-external_link-18.svg';
import { CodesandboxLink } from './CodesandboxLink';
import { Code } from './Code';
import cx from 'classnames';

interface DocExampleProps {
    path: string;
    title?: string;
    onlyCode?: boolean;
    width?: number | 'auto';
    cx?: string;
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
    titleRef: RefObject<HTMLDivElement> = createRef();

    componentDidMount(): void {
        const { path, onlyCode } = this.props;

        if (!onlyCode) {
            const exPathRelative = `.${path.substring(EXAMPLES_PATH_PREFIX.length)}`;
            requireContext(exPathRelative).then((module: any) => {
                this.setState({ component: module.default });
            });
        }

        if (this.titleRef?.current && window.location?.hash?.includes(this.titleRef.current.id)) {
            this.titleRef.current.scrollIntoView(true);
        }

        svc.api
            .getCode({ path })
            .then((r) => {
                this.setState({ code: r.highlighted, raw: r.raw });
            });
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
        const dirPath = this.props.path.split('/').slice(0, -1);
        return (
            <>
                <FlexRow size={ null } vPadding="48" padding="24" borderBottom alignItems="top" spacing="12">
                    {this.state.component && React.createElement(this.state.component)}
                </FlexRow>
                <FlexRow padding="12" vPadding="12" cx={ [css.containerFooter, css.uuiThemePromo] }>
                    <Switch value={ this.state.showCode } onValueChange={ this.onSwitchValueChange } label="View code" />
                    <CodesandboxLink raw={ raw } dirPath={ dirPath } />
                </FlexRow>
                {this.state.showCode && this.renderCode()}
            </>
        );
    }

    render() {
        return (
            <div className={ cx(css.container, this.props.cx) }>
                {this.props.title && (
                    <FlexRow cx={ css.titleRow }>
                        <div id={ this.props.title.split(' ').join('_').toLowerCase() } className={ css.title } ref={ this.titleRef }>
                            {this.props.title}
                        </div>
                        <IconButton cx={ css.anchor } icon={ AnchorIcon } color="blue" href={ `#${this.props.title.split(' ').join('_').toLowerCase()}` } />
                    </FlexRow>
                )}
                <EditableDocContent fileName={ this.getDescriptionFileName() } />
                <div className={ css.previewContainer } style={ { width: this.props.width } }>
                    {this.props.onlyCode ? this.renderCode() : this.renderPreview()}
                </div>
            </div>
        );
    }
}
