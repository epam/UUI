import * as React from 'react';
import { Switch, FlexRow, IconButton, LinkButton } from '@epam/promo';
import { EditableDocContent } from './EditableDocContent';
import { svc } from '../../services';
import * as css from './DocExample.scss';
import { getParameters } from 'codesandbox/lib/api/define';
import * as anchorIcon from '@epam/assets/icons/common/action-external_link-18.svg';
import * as CodesandboxIcon from '@epam/assets/icons/common/social-network-codesandbox-24.svg';
import { CodeSandboxConfig } from 'app/src/data/codesandboxConfig';

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
    stylesheet?: any;
}

const requireContext = require.context('../../docs/', true, /\.example.(ts|tsx)$/, 'lazy');

export class DocExample extends React.Component<DocExampleProps, DocExampleState> {
    constructor(props: DocExampleProps) {
        super(props);

        requireContext(this.props.path).then((module: any) => {
            this.setState({ component: module.default });
        });

        Promise.all([
            svc.api.getCode({ path: this.props.path }).then(r => this.setState({ code: r.highlighted, raw: r.raw })),
            svc.api.getCode({ path: this.getComponentStyleSheet(this.props.path) }).then(s => s && this.setState({ stylesheet: s.raw }))
        ]);
    }

    state: DocExampleState = {
        showCode: false,
    };

    getDescriptionFileName() {
        console.log(this.props.path);
        return this.props.path
            .replace(new RegExp(/\.example.tsx|\./g), '')
            .replace(/\//g, '-')
            .replace(/^-/, '');
    }

    getComponentStyleSheet(path: string) {
        const pathElements = path.split('/');
        return pathElements
            .splice(0, pathElements.length - 1)
            .concat('BasicExample.scss')
            .join('/');
    }

    getCodesandboxLink(): string {
        const url: URL = new URL('https://codesandbox.io/api/v1/sandboxes/define');
        url.searchParams.set('parameters', getParameters({
            ...CodeSandboxConfig,
            files: {
                ...CodeSandboxConfig.files,
                'Example.tsx': {
                    content: this.state.raw,
                    isBinary: false,
                },
                ...(this.state.stylesheet && {
                    'BasicExample.scss': {
                        content: this.state.stylesheet,
                        isBinary: false,
                    },
                }),
            }
        }));
        return url.toString();
    }

    renderCode() {
        return <pre className={ css.code } dangerouslySetInnerHTML={ { __html: this.state.code } } />;
    }

    renderPreview() {
        return (
            <>
                <FlexRow vPadding='48' padding='24' borderBottom='gray40' alignItems='top' spacing='12' >
                    { this.state.component && React.createElement(this.state.component) }
                </FlexRow>
                <FlexRow padding='12' vPadding='12' spacing='18'>
                    <Switch
                        value={ this.state.showCode }
                        onValueChange={ (val) => this.setState({showCode: val}) }
                        label='View code'
                    />
                    <LinkButton
                        icon={CodesandboxIcon}
                        iconPosition='right'
                        target="_blank"
                        caption="Open in Codesandbox"
                        href={this.getCodesandboxLink()}
                    />
                </FlexRow>
                { this.state.showCode && this.renderCode() }
            </>
        );
    }

    render() {
        return (
            <div className={ css.container }>
                {
                    this.props.title && <FlexRow cx={ css.titleRow }>
                        <div id={ this.props.title.split(' ').join('_').toLowerCase() } className={ css.title }>{ this.props.title }</div>
                        <IconButton cx={ css.anchor } icon={ anchorIcon } color='blue' href={ `#${ this.props.title.split(' ').join('_').toLowerCase() }` } />
                    </FlexRow>
                }
                <EditableDocContent fileName={ this.getDescriptionFileName() } />

                <div className={ css.previewContainer } style={ { width: this.props.width } }>
                    { this.props.onlyCode ? this.renderCode() : this.renderPreview() }
                </div>
            </div>
        );
    }
}