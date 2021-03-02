import * as React from 'react';
import Measure from 'react-measure';
import { FlexCell, FlexRow, Text } from '@epam/promo';
import { SlideProps, Slider, SliderProps } from '../common/slider';
import { analyticsEvents } from '../analyticsEvents';
import * as css from './AskDevelopersBlock.scss';

let feedbacksTexts = {
    'Nadzeya Nikalayonak': 'UUI3 helps to deploy the application and simplifies further development. On the initial stage, you do not need to spend time on developing a standard components. Thus, it allows you to start development right away with something specific. One of the benefits is that the given components are created with the designers, so they correspond to the company style. The library has Icon sets, which match the size for better components compatibility.\n' +
    'Also, the library provides such powerful components as Timeline, DataTable, RichTextEditor, Pickers  and others. Difficult things can be implemented thanks to them quickly and qualitatively.\n' +
    'Interactive documentation and good communication with the development team give opportunities to clarify various points quickly, suggest new functionality.',
    'Aliaksandr Ihnashevich': `I've been developing different type of project for almost 3 years. All of this time I use UUI Library and it's a great set of component and approaches. They help you develop your front-end app fast and robust. I totally recommend use this library in your next project.`,
    'Pavel Smirnov': `UUI library helped us to start our project in a matter of days and right away prototype complex screens that fit the Design Platform requirements to get feedback from our stakeholders on early iterations. We didn't have to reinvent basic components so we were able to focus on business logic and hard stuff.
        Crucial features of our app are complex Forms with dependencies between fields and Tables with sorting, filtering and configuration of columns. It took some time to establish proper contracts with the back-end, but once it was in place - everything worked out of the box just fine.
        In case we needed something custom, modular nature of components from UUI allowed as to tear down complex widgets and rebuild them from the same building block the way we needed them.
        It's hard to estimate, how many man-hours UUI saved us.`,
    'Iryna Stakhiyevich': `I was working on 2 projects using UUI library and had very good experience with it. It enabled us to migrate Assessment Portal from legacy Knockout to React in 3 month (which is blazing fast) and once that was done it made development of new features much faster. Also, LevelUp, the second project, had an easy start due to using UUI library. It contains all major UI components that comply to EPAM design style and guidelines out of the box. It is actively developed and well supported. UUI development team is always easy to reach and helpful to resolve any questions.`

};

const testimonials: SliderProps = {
    slides: [
        {
            image: 'https://static.cdn.epam.com/avatar/6eb026809e88444eb30dd4e6970d2bc7.jpg',
            name: 'Nadzeya Nikalayonak',
            position: 'Front-end Dev Lead, Grow',
            feedback: feedbacksTexts['Nadzeya Nikalayonak'],
            quote: 'UUI helps to deploy the application and simplifies further development',
        },
        // {
        //     image: '/static/photos/Aliaksandr_Ihnashevich.jpg',
        //     name: 'Aliaksandr Ihnashevich',
        //     position: 'Front-end Dev Lead, Learn',
        //     feedback: feedbacksTexts['Aliaksandr Ihnashevich'],
        //     quote: 'They help you develop your front-end app fast and robust',
        // },
        {
            image: 'https://static.cdn.epam.com/avatar/5a20fabe4ec35c88dfd1e685eacf52de.jpg',
            name: 'Pavel Smirnov',
            position: 'Front-end Dev Lead, Unified Profile',
            feedback: feedbacksTexts['Pavel Smirnov'],
            quote: `It's hard to estimate, how many man-hours UUI saved us`,
        },
        {
            image: 'https://static.cdn.epam.com/avatar/f493e59635ab5919aa53db3ef11d7f0a.jpg',
            name: 'Iryna Stakhiyevich',
            position: 'Front-end Dev Lead, Assessment and Level UP',
            feedback: feedbacksTexts['Iryna Stakhiyevich'],
            quote: `It contains all major UI components that comply to EPAM design style and guidelines out of the box`,
        },

    ],
};

export class AskDevelopersBlock extends React.Component {
    private getValueChangeAnalyticsEvent = (newValue: number, oldValue: number) => {
        const direction = newValue < oldValue ? 'left' : 'right';
        return analyticsEvents.welcome.askDeveloper(direction);
    }

    renderMobileLayout = (slides: SlideProps[]) => {
        return (
            <div className={ css.wrapper }>
                <FlexRow spacing='12' alignItems='stretch' >
                    { slides.map(slide => (
                            <FlexCell width={ 284 } minWidth={ 284 } cx={ css.cell }>
                                <Text font='museo-slab' cx={ css.quoteText } >{ slide.quote }</Text>
                                <FlexRow alignItems='bottom' >
                                    <img alt={ slide.name } src={ slide.image } width='60' height='60' />
                                    <FlexCell width={ "auto" } >
                                        <Text font='sans-semibold' lineHeight='24' fontSize='16' size='none' >{ slide.name }</Text>
                                        <Text font='sans' lineHeight='18' fontSize='14' size='none' >{ slide.position }</Text>
                                    </FlexCell>
                                </FlexRow>
                            </FlexCell>
                        ),
                    ) }
                </FlexRow>
            </div>
        );
    }
    
    render() {
        return (
            <Measure bounds>
                {
                    ({ measureRef, contentRect }: { measureRef: (instance: HTMLDivElement) => any, contentRect: any }) => {
                        const containerWidth = window ? window.innerWidth : contentRect.bounds.width;
                        const slides = containerWidth <= 1280 && containerWidth > 768
                            ? testimonials.slides.map(i => ({ feedback: i.feedback, image: i.image, name: i.name, position: i.position, quote: null }))
                            : testimonials.slides;

                        return (
                            <div className={ css.layout } ref={ measureRef } >
                                <div className={ css.testimonials } >
                                    <Text font='museo-sans' cx={ css.header } >Ask developers</Text>
                                    { containerWidth > 768
                                        ? <Slider slides={ slides } getValueChangeAnalyticsEvent={ this.getValueChangeAnalyticsEvent }/>
                                        : this.renderMobileLayout(slides)
                                    }
                                </div>
                            </div>
                        );
                    }
                }
            </Measure>
        );
    }
}