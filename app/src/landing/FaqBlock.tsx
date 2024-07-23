import React, { useState } from 'react';
import { Accordion, Text } from '@epam/uui';
import { getCurrentTheme } from '../helpers';

import css from './FaqBlock.module.scss';
import cx from 'classnames';

const faqData = [
    { id: 0, caption: 'Is it free forever?', text: 'Yes, it`s free forever' },
    { id: 1, caption: 'Can I use it to make and sell my own product?', text: 'Yes, you can do anything' },
    { id: 2, caption: 'How much Figma libraries costs?', text: '$1.000.000 yearly, $500.000 monthly' },
    { id: 3, caption: 'How much time I can receive updates?', text: 'Until Armageddon.' },
    { id: 4, caption: 'Is it free forever?', text: 'Yes, it`s free forever' },
    { id: 5, caption: 'Can I use it to make and sell my own product?', text: 'Yes, you can do anything' },
    { id: 6, caption: 'How much Figma libraries costs?', text: '$1.000.000 yearly, $500.000 monthly' },
    { id: 7, caption: 'How much time I can receive updates?', text: 'Until Armageddon.' },
];

export function FaqBlock() {
    const theme = getCurrentTheme();
    const [accordionValue, setAccordionValue] = useState(0);

    const getHeaderClassName = (baseClass: string) => !!theme && theme === 'loveship_dark' ? `${baseClass}LoveshipDark` : `${baseClass}${theme.charAt(0).toUpperCase() + theme.slice(1)}`;

    return (
        <div className={ css.root }>
            <div className={ css.container }>
                <Text cx={ cx(css.faqHeader, css[getHeaderClassName('faqHeader')]) }>FAQ</Text>
                <div className={ css.accordionWrapper }>
                    {faqData.map((item) => (
                        <Accordion
                            key={ item.id }
                            title={ item.caption }
                            mode="block"
                            value={ item.id === accordionValue }
                            onValueChange={ () => setAccordionValue(item.id) }
                        >
                            <Text fontSize="16" lineHeight="24">{item.text}</Text>
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    );
}
