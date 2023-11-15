import * as React from 'react';
import css from './ContentSection.module.scss';
import { ScrollBars } from '@epam/uui';
import { IHasChildren } from '@epam/uui-core';

interface ContentSectionProps extends IHasChildren {}

export class ContentSection extends React.Component<ContentSectionProps> {
    render() {
        return (
            <div className={ css.root }>
                <ScrollBars>
                    <div className={ css.widthWrapper }>{this.props.children}</div>
                </ScrollBars>
            </div>
        );
    }
}
