import * as React from 'react';
import * as css from './ContentSection.scss';
import { ScrollBars } from '@epam/promo';

export class ContentSection extends React.Component {
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