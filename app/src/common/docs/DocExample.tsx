import * as React from 'react';
import { Switch, FlexRow, IconButton } from '@epam/promo';
import { EditableDocContent } from './EditableDocContent';
import { svc } from '../../services';
import path from 'path';
import * as css from './DocExample.scss';
import * as anchorIcon from '@epam/assets/icons/common/action-external_link-18.svg';


interface DocExampleProps {
    path: string;
    title?: string;
    onlyCode?: boolean;
    width?: number | 'auto';
}

interface DocExampleState {
    showCode: boolean;
    component?: any;
    code?: any;
}

declare var require: any;
const requireContext = require.context('../../docs/', true, /\.example.(ts|tsx)$/, 'lazy');

export class DocExample extends React.Component<DocExampleProps, DocExampleState> {
    constructor(props: DocExampleProps) {
        super(props);

        requireContext(`${this.props.path}`).then((module: any) => {
            const componentExports = Object.keys(module).filter(key =>
                module[key] instanceof React.Component || (key[0] == key[0].toUpperCase() && typeof module[key] === 'function'),
            );
            this.setState({ component: module[componentExports[0]] });
        });

        svc.api.getCode({ path: this.props.path }).then(r => this.setState({ code: r.highlighted }));
    }

    state: DocExampleState = {
        showCode: false,
    };

    getDescriptionFileName() {
        return this.props.path
            .replace(new RegExp(/\.example.tsx|\./g), '')
            .replace(/\//g, '-')
            .replace(/^-/, '');
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
                <FlexRow padding='12' vPadding='12'>
                    <Switch value={ this.state.showCode } onValueChange={ (val) => this.setState({showCode: val}) } label='View code'/>
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