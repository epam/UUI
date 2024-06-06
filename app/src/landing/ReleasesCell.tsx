import * as React from 'react';
import { uuiDayjs } from '../helpers';
import { UuiReactMarkdown } from '../documents/uuiReactMarkdown';
import { cx } from '@epam/uui-core';
import { FlexRow, LinkButton, RichTextView } from '@epam/uui';
import { analyticsEvents } from '../analyticsEvents';
import css from './ReleasesCell.module.scss';

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
        const [header, date] = content
            .split('*')[0]
            .split(' - ')
            .map((i: any) => i.trim());
        const releaseNotes = content.substr(content.search(/\*/), content.length);

        return (
            <div className={ cx(css.wrapper, `${layout}-width`) }>
                <div ref={ this.cellRef } className={ css.column }>
                    <RichTextView size="16">
                        <FlexRow columnGap="12">
                            <h3>{header}</h3>
                            <div className={ css.releaseDate }>{uuiDayjs.dayjs(date, 'DD.MM.YYYY').isValid() && uuiDayjs.dayjs(date, 'DD.MM.YYYY').format('MMM DD, YYYY')}</div>
                        </FlexRow>
                        <UuiReactMarkdown content={ releaseNotes } />
                    </RichTextView>
                </div>
                {this.state.overflow ? (
                    <div className={ css.buttonWrapper }>
                        <LinkButton
                            size="36"
                            caption="Show more"
                            link={ { pathname: '/documents', query: { id: 'releaseNotes', release: header.split(' ')[1] } } }
                            clickAnalyticsEvent={ analyticsEvents.welcome.releaseNotes() }
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}
