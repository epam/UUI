import * as React from 'react';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import { cx } from '@epam/uui';
import { FlexRow, LinkButton, RichTextView } from '@epam/promo';
import { analyticsEvents } from '../analyticsEvents';
import { getCoreProps } from '../helpers/getCoreProps';
import * as css from './ReleasesCell.scss';

export interface ReleasesCellProps {
    content: string;
    layout: 'tablet' | 'desktop' | 'mobile';
}

export interface ReleasesCellState {
    content: string;
    overflow: boolean;
}

export class ReleasesCell extends React.Component<ReleasesCellProps, ReleasesCellState> {
    constructor(props: ReleasesCellProps, private cellRef: any) {
        super(props);

        this.state = {
            content: this.props.content,
            overflow: false,
        };

        this.cellRef = React.createRef();
    }

    componentDidMount() {
        if (this.cellRef.current.offsetHeight < this.cellRef.current.scrollHeight) {
            this.setState({ overflow: true });
        }
    }

    render() {
        const { content, layout } = this.props;
        const [header, date] = content.split('*')[0].split('-').map((i: any) => i.trim());
        const releaseNotes = content.substr(content.search(/\*/), content.length);

        return (
            <div className={ cx(css.wrapper, `${ layout }-width`) }  >
                <div ref={ this.cellRef } className={ css.column } >
                    <RichTextView size='16'>
                        <FlexRow spacing='12'>
                            <h3>{ header }</h3>
                            <div className={ css.releaseDate }>
                                { moment(date, 'DD.MM.YYYY').isValid() && moment(date, 'DD.MM.YYYY').format('MMM DD, YYYY') }
                            </div>
                        </FlexRow>
                        <ReactMarkdown source={ releaseNotes } renderers={
                            {
                                heading: (props) => {
                                    return React.createElement(`h4`, getCoreProps(props), ['# ', props.children]);
                                },
                                linkReference: (props) => {
                                    if (!props.href) {
                                        return <span>{ `[${ props.children[0].props.value }]` }</span>;
                                    }
                                    return <a href={ props.$ref } >{ props.children[0] }</a>;
                                },
                            }
                        }
                        />
                    </RichTextView>
                </div>
                {
                    this.state.overflow
                    ? <div className={ css.buttonWrapper } >
                        <LinkButton
                            size='36'
                            caption='Show more'
                            link={ { pathname: '/documents', query: { id: `releaseNotes`, release: header.split(' ')[1] } } }
                            clickAnalyticsEvent={ analyticsEvents.welcome.releaseNotes(header) }
                        />
                    </div>
                    : null
                }
            </div>
        );
    }
}