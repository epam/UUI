import * as React from 'react';
import * as css from './Slide.scss';
import { Text } from '@epam/promo';

export interface SlideProps {
    image: string;
    name: string;
    position: string;
    feedback: string;
    quote?: string;
}

export class Slide extends React.Component<SlideProps> {
    constructor(props: SlideProps) {
        super(props);
    }
    render() {
        return (
            <div className={ css.slide } >
                <div className={ css.card } >
                    <img alt={ this.props.name } src={ this.props.image } width='180' height='180' />
                    <Text font='sans-semibold' lineHeight='24' fontSize='16' size='none' >{ this.props.name }</Text>
                    <Text font='sans' lineHeight='24' fontSize='16' size='none' >{ this.props.position }</Text>
                </div>
                <Text font='sans' fontSize='24' cx={ css.testimonialText } >{ this.props.feedback }</Text>
                { this.props.quote && <Text font='museo-slab' cx={ css.quoteText } >{ this.props.quote }</Text> }
            </div>
        );
    }
}

