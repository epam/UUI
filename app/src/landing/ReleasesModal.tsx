import * as React from 'react';
import { ModalBlocker, ModalHeader, ModalWindow, Panel, ScrollBars, RichTextView } from '@epam/promo';
import * as css from './ReleasesModal.scss';
import ReactMarkdown from 'react-markdown';
import { IModal } from '@epam/uui';

export interface ReleasesModalProps extends IModal<any> {
    release: string;
}

function linkRenderer(content: any) {
    if (!content.href) {
        return <span>{ `[${ content.children[0].props.value }]` }</span>;
    }
    return <a href={ content.$ref } >{ content.children[0] }</a>;
}

export class ReleasesModal extends React.Component<ReleasesModalProps> {
    render() {
        const { release } = this.props;
        const header = release.split('*')[0];
        const content = release.substr(release.search(/\*/), release.length);

        return (
            <ModalBlocker blockerShadow='dark' { ...this.props } >
                <ModalWindow width='600' >
                    <Panel background="white">
                        <ModalHeader title={ header } onClose={ () => this.props.abort() } borderBottom />
                        <ScrollBars  >
                            <div className={ css.modal } >
                                <RichTextView>
                                    <ReactMarkdown source={ content } renderers={ { linkReference: (props) => linkRenderer(props) } } />
                                </RichTextView>
                            </div>
                        </ScrollBars>
                    </Panel>
                </ModalWindow>
            </ModalBlocker>
        );
    }
}