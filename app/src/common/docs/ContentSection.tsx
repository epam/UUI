import * as React from 'react';
import * as css from './ContentSection.scss';
import { ScrollBars } from '@epam/promo';

interface ContentSectionProps {
    children: React.ReactNode;
}

export class ContentSection extends React.Component<ContentSectionProps> {
    render() {
        return (
            <div className={ css.root }>
                <ScrollBars>
                    <div className={ css.widthWrapper } >
                        { this.props.children }
                    </div>
                </ScrollBars>
            </div>
        );
    }
}