import * as React from 'react';
import * as css from './ReleaseNotesDoc.scss';
import { svc } from '../../services';
import { FlexCell, FlexRow, RichTextView, Spinner, Text } from '@epam/promo';
import { getCoreProps } from '../../helpers/getCoreProps';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { ContentSection } from '../../common';

interface ReleaseNotesDocState {
    isLoading: boolean;
    markdown: any | null;
}

export class ReleaseNotesDoc extends React.Component<any, ReleaseNotesDocState> {
    constructor(props: Readonly<{containerRef: any}>) {
        super(props);

        svc.api.getChangelog()
            .then(response => response)
            .then(data => {
                this.setState({
                    markdown: data.markdown.split('#').filter((el: any) => el !== '').map((el: any) => '#'.concat(el)),
                    isLoading: false,
                });
            });

        this.state = {
            isLoading: true,
            markdown: null,
        };
    }

    componentDidUpdate() {
        const query = new URLSearchParams(window.location.search);
        const release = query.get('release');
        if (release) {
            document.getElementById(release).scrollIntoView();
        }
    }

    renderHeader(release: any) {
        let releaseNumber = release.children[0].props.value.split('-')[0].trim();
        let releaseDate = release.children[0].props.value.split('-')[1] && release.children[0].props.value.split('-')[1].trim();

        return (
            <FlexCell minWidth={ 246 } alignSelf='start' >
                { React.createElement(`h1`, getCoreProps(release), ['# ', releaseNumber]) }
                <Text color='gray60' size='24' >{ releaseDate }</Text>
            </FlexCell>
        );
    }

    renderReleaseRow(release: any, index: number) {
        const [header, date] = release.split('*')[0].split('-').map((i: any) => i.trim());
        const content = release.substr(release.search(/\*/), release.length);

        return (
            <FlexRow key={ index } cx={ css.releaseRow } >
                <FlexCell minWidth={ 246 } alignSelf='start' >
                    <Text font='museo-sans' fontSize='24' lineHeight='30' cx={ css.releaseHeader } >{ header }</Text>
                    <Text color='gray60' fontSize='16' lineHeight='24' cx={ css.releaseDate } >
                        { moment(date, 'DD.MM.YYYY').isValid() && moment(date, 'DD.MM.YYYY').format('MMM DD, YYYY') }
                    </Text>
                </FlexCell>
                <div id={ header.split(' ')[1] } className={ css.releaseContent }>
                    <RichTextView>
                        <ReactMarkdown
                            source={ content }
                            renderers={
                                {
                                    heading: (release) => {
                                        return this.renderHeader(release);
                                    },
                                    strong: (release) => {
                                        return <b>{ release.children[0] }</b>;
                                    },
                                    linkReference: (release) => {
                                        if (!release.href) {
                                            return <span>{ `[${ release.children[0].props.value }]` }</span>;
                                        }
                                        return <a href={ release.$ref } >{ release.children[0] }</a>;
                                    },
                                }
                            }
                        />
                    </RichTextView>
                </div>
            </FlexRow>
        );
    }

    render() {
        const { markdown, isLoading } = this.state;

        return (
            <ContentSection>
                <div className={ css.title }>Release Notes</div>

                <div className={ css.layout } >
                    { isLoading ? <Spinner color='blue' /> : markdown.map((release: any, index: number) => this.renderReleaseRow(release, index)) }
                </div>
            </ContentSection>
        );
    }
}