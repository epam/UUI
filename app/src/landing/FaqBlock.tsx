import React, { useState } from 'react';
import { Accordion, Text } from '@epam/uui';
import { getCurrentTheme } from '../helpers';

import css from './FaqBlock.module.scss';
import cx from 'classnames';

const faqData = [
    { id: 0, caption: 'Is it completely free?', text: 'Yes! The UUI components library, along with Figma, is free for any usage — from personal to enterprise purposes.' },
    { id: 1, caption: 'Can I use it to make and sell my own product?', text: 'Yes, you can do anything.' },
    { id: 3, caption: "How long I'll receive updates?", text: 'Until Armageddon. UUI is developed by a dedicated EPAM team and is used across numerous EPAM products. Therefore, we stand on solid ground.' },
    { id: 4, caption: 'Can I style UUI components according my own brand?', text: 'Of course! UUI offers powerful customization options through Themes. You can choose your own brand colors and configure component sizes as you wish. Moreover, you can create your own skin package based on UUI non-styled component core.' },
    { id: 5, caption: 'Can UUI team assist me? For example, could you build a theme for my brand?', text: 'Certainly! We offer commercial support options. Please contact us for more information.' },
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
                            <Text fontSize="16" lineHeight="24">{ `${item.text}` }</Text>
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    );
}
