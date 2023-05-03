import { Anchor, Text } from '@epam/promo';
import css from './DemoItemCard.scss';
import * as React from 'react';
import { DemoItem } from '../structure';

export interface IDemoItemCard {
    demoItem: DemoItem;
    onOpenItem: (name: string) => void;
}
export function DemoItemCard(props: IDemoItemCard) {
    const {
        onOpenItem,
        demoItem: {
            id, name, previewImage, shortDescription,
        },
    } = props;

    return (
        <Anchor cx={ css.container } key={ id } link={ { pathname: '/demo', query: { id, ...props.demoItem.queryObject } } } onClick={ () => onOpenItem(name) }>
            <div className={ css.navCard } style={ { backgroundImage: `url(${previewImage})` } } />
            <div className={ css.navDescription }>
                <Text cx={ css.title } font="sans-semibold" lineHeight="30" fontSize="24">
                    {name}
                </Text>
                <div className={ css.description }>
                    <Text fontSize="12">{shortDescription}</Text>
                </div>
            </div>
        </Anchor>
    );
}
