import * as React from 'react';
import css from './Slide.module.scss';
import { Text } from '@epam/uui';

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
            <div className={ css.slide }>
                <div className={ css.card }>
                    <img alt={ this.props.name } src={ this.props.image } width="180" height="180" />
                    <Text fontWeight="600" lineHeight="24" fontSize="16" size="none">
                        {this.props.name}
                    </Text>
                    <Text lineHeight="24" fontSize="16" size="none">
                        {this.props.position}
                    </Text>
                </div>
                <Text fontSize="24" cx={ css.testimonialText }>
                    {this.props.feedback}
                </Text>
                {this.props.quote && (
                    <Text cx={ css.quoteText }>
                        {this.props.quote}
                    </Text>
                )}
            </div>
        );
    }
}
