import * as React from 'react';
import { Text } from '@epam/promo';
import * as css from './QuoteBlock.scss';

export class QuoteBlock extends React.Component {
    render() {
        return (
            <div className={ css.layout } >
                <div className={ css.landingQuote } >
                    <div className={ css.card } >
                        <img alt='Yakov Zhmorov' src='https://static.cdn.epam.com/avatar/779038178a233327b974b53db1836de2.jpg' />
                        <Text font='sans-semibold' lineHeight='24' fontSize='16' size='none' >Yakov Zhmorov</Text>
                        <Text font='sans' lineHeight='24' fontSize='16' size='none' >Solution Architect, UUI</Text>
                    </div>
                    <div className={ css.text } >
                        <Text font='museo-slab' cx={ css.quoteText } >UUI is highly customizable, it can even be seen as
                            "accelerator of UI accelerators". It's built on top of a non-styled set of components,
                            so code can be reused.</Text>
                        <Text font='museo-slab' cx={ css.quoteText } >During 5+ years of experience we learned how
                            to build the brand UI: from ideas and design, via accelerators, to the great products.</Text>
                    </div>
                </div>
            </div>
        );
    }
}