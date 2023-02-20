import * as React from 'react';
import Measure from 'react-measure';
import { Anchor, FlexRow, IconContainer, Text } from '@epam/promo';
import { svc } from '../services';
import { analyticsEvents } from '../analyticsEvents';
import { projectsList } from '../docs/other/Projects.doc';
import css from './ProjectsBlock.scss';

export class ProjectsBlock extends React.Component {
    private sendEvent = (productName: string) => {
        svc.uuiAnalytics.sendEvent(analyticsEvents.welcome.trusted(productName));
    };

    render() {
        const projects = projectsList.slice(0, 8);

        return (
            <Measure bounds>
                {({ measureRef, contentRect }: { measureRef: (instance: HTMLDivElement) => any; contentRect: any }) => {
                    const containerWidth = window ? window.innerWidth : contentRect.bounds.width;

                    return (
                        <div className={css.layout} ref={measureRef}>
                            <FlexRow cx={css.projects} borderBottom>
                                <div className={css.wrapper}>
                                    <Text font="museo-sans" cx={css.header}>
                                        Trusted by
                                    </Text>
                                    <div className={css.content}>
                                        {projects.map(project => (
                                            <a
                                                tabIndex={-1}
                                                key={project.projectName}
                                                target="_blank"
                                                className={css.project}
                                                href={project.url}
                                                onClick={() => this.sendEvent(project.projectName)}
                                                rel="noreferrer"
                                            >
                                                <div className={css.iconWrapper}>
                                                    <IconContainer icon={project.icon} size={containerWidth > 768 ? 96 : 78} />
                                                </div>
                                                <Text cx={css.projectCaption}>{project.projectName}</Text>
                                            </a>
                                        ))}
                                        <Anchor
                                            key="allProjects"
                                            cx={css.project}
                                            rawProps={{ tabIndex: -1 }}
                                            link={{ pathname: '/documents', query: { id: 'projects' } }}
                                            onClick={() => this.sendEvent('All')}
                                        >
                                            <div className={css.iconWrapper}>
                                                <Text font="museo-sans" cx={css.overflowProjects}>
                                                    {projectsList.length}
                                                </Text>
                                            </div>
                                            <Text cx={css.projectCaptionAll} font="sans-semibold">
                                                View All
                                            </Text>
                                        </Anchor>
                                    </div>
                                </div>
                            </FlexRow>
                        </div>
                    );
                }}
            </Measure>
        );
    }
}
