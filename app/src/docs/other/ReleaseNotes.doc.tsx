import * as React from 'react';
import css from './ReleaseNotesDoc.scss';
import { svc } from '../../services';
import { FlexCell, FlexRow, RichTextView, Spinner, Text } from '@epam/promo';
import { UuiReactMarkdown } from '../../documents/uuiReactMarkdown';
import dayjs from 'dayjs';
import { ContentSection } from '../../common';

interface ReleaseInfo {
    date: string;
    number: string;
}

interface ReleaseNotesDocState {
    isLoading: boolean;
    markdown: any | null;
    release: ReleaseInfo;
}

export class ReleaseNotesDoc extends React.Component {
    state: ReleaseNotesDocState = {
        isLoading: true,
        markdown: null,
        release: { number: '', date: '' },
    };

    componentDidMount() {
        svc.api.getChangelog().then(data => {
            const [releaseVersion, releaseDate] = data.markdown.split('\n')[0].split(' - ');

            this.setState({
                markdown: data.markdown
                    .split('# ')
                    .filter((el: any) => el !== '')
                    .map((el: any) => '#'.concat(el)),
                isLoading: false,
                release: {
                    number: releaseVersion?.trim().slice(2),
                    date: releaseDate?.trim(),
                },
            });
        });
    }

    componentDidUpdate() {
        const query = new URLSearchParams(window.location.search);
        const release = query.get('release');
        document.getElementById(release)?.scrollIntoView({ behavior: 'smooth' });
    }

    renderReleaseRow(release: string, index: number) {
        const [header, date] = release
            .split('*')[0]
            .split(' - ')
            .map(i => i.trim());
        const content = release.substring(release.search(/\*/), release.length);

        return (
            <FlexRow key={index} cx={css.releaseRow} rawProps={{ id: header.split('#')[1] }}>
                <FlexCell minWidth={246} alignSelf="start">
                    <Text font="museo-sans" fontSize="24" lineHeight="30" cx={css.releaseHeader}>
                        {header}
                    </Text>
                    <Text color="gray60" fontSize="16" lineHeight="24" cx={css.releaseDate}>
                        {dayjs(date, 'DD.MM.YYYY').isValid() && dayjs(date, 'DD.MM.YYYY').format('MMM DD, YYYY')}
                    </Text>
                </FlexCell>
                <div className={css.releaseContent}>
                    <RichTextView size="16">
                        <UuiReactMarkdown content={content} isReplaceStrongToBold={true} />
                    </RichTextView>
                </div>
            </FlexRow>
        );
    }

    render() {
        const { markdown, isLoading, release } = this.state;

        if (Object.keys(release).some(key => !key)) return null;

        return (
            <ContentSection>
                <div className={css.title}>Release Notes</div>

                <div className={css.layout}>
                    {isLoading ? <Spinner color="blue" /> : markdown.map((release: any, index: number) => this.renderReleaseRow(release, index))}
                </div>
            </ContentSection>
        );
    }
}
