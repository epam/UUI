import * as React from 'react';
import { Switch, FlexRow, IconButton, LinkButton } from '@epam/promo';
import { EditableDocContent } from './EditableDocContent';
import { svc } from '../../services';
import * as css from './DocExample.scss';
import { getParameters } from 'codesandbox/lib/api/define';
import { join } from 'path';
import * as anchorIcon from '@epam/assets/icons/common/action-external_link-18.svg';
import * as CodesandboxIcon from '@epam/assets/icons/common/social-network-codesandbox-24.svg';
import { getCodesandboxConfig } from 'app/src/data/codesandbox/getCodesandboxConfig';

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
    stylesheets?: { [key: string]: { isBinary: false, content: string } };
}

const requireContext = require.context('../../docs/', true, /\.example.(ts|tsx)$/, 'lazy');

export class DocExample extends React.Component<DocExampleProps, DocExampleState> {
    constructor(props: DocExampleProps) {
        super(props);

        requireContext(this.props.path).then((module: any) => {
            this.setState({ component: module.default });
        });

        svc.api.getCode({ path: this.props.path }).then(r => {
            this.setState({ code: r.highlighted, raw: r.raw });
            return r.raw;
        }).then(raw => this.getComponentStyleSheet(raw));
    }

    state: DocExampleState = {
        showCode: false,
        stylesheets: {},
    };

    getDescriptionFileName() {
        return this.props.path
            .replace(new RegExp(/\.example.tsx|\./g), '')
            .replace(/\//g, '-')
            .replace(/^-/, '');
    }

    getComponentStyleSheet(raw: string) {
        const extension = '.scss';
        const thereAreStylesheets = raw.match(new RegExp(`\\w+(?=${extension})`));
        if (thereAreStylesheets !== null) {
            const stylesheetMatches = thereAreStylesheets.map(entry => entry.concat(extension));
            stylesheetMatches.forEach(match => {
                const path = this.props.path.split('/').slice(0, -1).concat(match).join('/');
                svc.api.getCode({ path }).then(stylesheet => {
                    this.setState(prevState => ({
                        ...prevState,
                        stylesheets: {
                            ...prevState.stylesheets,
                            [match]: {
                                content: stylesheet.raw,
                                isBinary: false,
                            }
                        }
                    }));
                });
            });
        }
    }

    getCodesandboxLink(): string | null {
        if (
            svc.uuiApp?.codesandboxFiles &&
            Object.values(svc.uuiApp.codesandboxFiles).every(value => value)
        ) {
            const url: URL = new URL('https://codesandbox.io/api/v1/sandboxes/define');
            url.searchParams.set('parameters', getParameters({
                files: getCodesandboxConfig(
                    this.state.raw,
                    this.state.stylesheets,
                    svc.uuiApp.codesandboxFiles
                )
            }));
            return url.toString();
        } else return null;
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
                    {this.getCodesandboxLink() && (
                        <LinkButton
                            icon={CodesandboxIcon}
                            iconPosition='right'
                            target="_blank"
                            caption="Open in Codesandbox"
                            href={this.getCodesandboxLink()}
                        />
                    )}
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