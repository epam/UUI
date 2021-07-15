import React, { FC, useState } from 'react';
import { IconButton, FlexRow, Panel, Text, TextPlaceholder, VirtualList } from '@epam/promo';
import { VirtualListState } from '@epam/uui';
import * as unfoldedIcon from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import * as foldedIcon from '@epam/assets/icons/common/navigation-chevron-up-18.svg';
import * as css from './BasicExample.scss';

const MyListItem: FC<{ index: number }> = (props) => {
    const [isFolded, setIsFolded] = useState<boolean>(true);
    return <div className={ css.itemContainer }>
        <Panel cx={ css.item } shadow background='white'>
            <FlexRow cx={ css.header } onClick={ () => setIsFolded(!isFolded) }>
                <IconButton icon={ isFolded ? foldedIcon : unfoldedIcon } />
                <Text>Row #{ props.index }</Text>
            </FlexRow>
            { !isFolded && <FlexRow cx={ css.body }>
                <TextPlaceholder wordsCount={ (props.index % 20) * 10 } isNotAnimated={ true } />
            </FlexRow>}
        </Panel>
    </div>;
}

// Generate some data. In real app, this would be some data items retrieved from server.
const someData: number[] = [];
for (let n = 0; n < 1000; n++) {
    someData.push(n + 1);
}

export default function VirtualListExample() {
    const [state, setState] = useState<VirtualListState>({ topIndex: 0, visibleCount: 10 });

    // Extract the visible part: starting from the state.topIndex, and only state.visibleCount of items
    const visibleItems = someData.slice(state.topIndex, state.topIndex + state.visibleCount);

    // Render visible data items into some components. Passing key is critical in this case!
    // Invisible components would be unmount, and would loose their state.
    // So it's a good idea to keep their state outside. We don't do this in this demo for the sake of simplicity.
    const visibleRows = visibleItems.map(index => <MyListItem index={ index } key={ index }/>);

    return (
        <VirtualList
            cx={ css.list } // User need to define height for container, otherwise it would extend to fit whole content
            rows={ visibleRows }
            value={ state }
            onValueChange={ setState }

            // Total number of items, to estimate total height
            // If total count in unknown, you can just pass knownCount + 1 to have some space to trigger loading
            rowsCount={ someData.length }
        />
    );
}