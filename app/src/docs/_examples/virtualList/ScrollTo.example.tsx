import React, { useState } from 'react';
import {
    IconButton, FlexRow, Panel, Text, TextPlaceholder, VirtualList, NumericInput, Button,
} from '@epam/promo';
import { VirtualListState } from '@epam/uui-core';
import { ReactComponent as UnfoldedIcon } from '@epam/assets/icons/common/navigation-chevron-down-18.svg';
import { ReactComponent as FoldedIcon } from '@epam/assets/icons/common/navigation-chevron-up-18.svg';
import css from './BasicExample.module.scss';

function MyListItem(props: { index: number }) {
    const [isFolded, setIsFolded] = useState<boolean>(true);
    return (
        <div className={ css.itemContainer } role="row">
            <Panel cx={ css.item } shadow background="white">
                <FlexRow cx={ css.header } onClick={ () => setIsFolded(!isFolded) }>
                    <IconButton icon={ isFolded ? FoldedIcon : UnfoldedIcon } />
                    <Text>
                        Row #
                        {props.index}
                    </Text>
                </FlexRow>
                {!isFolded && (
                    <FlexRow cx={ css.body }>
                        <TextPlaceholder wordsCount={ (props.index % 20) * 10 } isNotAnimated={ true } />
                    </FlexRow>
                )}
            </Panel>
        </div>
    );
}

// Generate some data. In the real app data items are retrieved from the server.
const someData: number[] = [];
for (let n = 0; n < 1000; n++) {
    someData.push(n + 1);
}

export default function VirtualListExample() {
    const [state, setState] = useState<VirtualListState>({ topIndex: 0, visibleCount: 10 });
    const [tempScrollTo, setTempScrollTo] = useState(state.scrollTo?.index);

    // Extract visible part: starting from state.topIndex, and only state.visibleCount of items
    const visibleItems = someData.slice(state.topIndex, state.topIndex + state.visibleCount);

    // Map visible data to some components. Passing key is critical in this case!
    // Invisible components will be unmounted, and, thus, lose their state.
    // So it's a good idea to keep their state externally. We are not doing this in this demo for simplicity sake.
    const visibleRows = visibleItems.map((index) => <MyListItem index={ index } key={ index } />);

    return (
        <Panel style={ { width: '100%' } }>
            <FlexRow vPadding="12" spacing="12">
                <NumericInput
                    placeholder="Type index"
                    value={ tempScrollTo }
                    onValueChange={ (index) => {
                        setTempScrollTo(index);
                    } }
                /> 
                <Button
                    onClick={ () => {
                        setState((current) => ({ ...current, scrollTo: { index: tempScrollTo } })); 
                    } }
                    caption="Scroll"
                />
            </FlexRow>
            <VirtualList
                cx={ css.list } // User needs to define height for container, otherwise it would extend to fit the whole content
                rows={ visibleRows }
                role="listbox"
                value={ state }
                onValueChange={ setState }
                // Total number of items, to estimate total height
                // If total count in unknown, you can just pass knownCount + 1 to have some space to trigger loading
                rowsCount={ someData.length }
            />
        </Panel>
    );
}
