import React, { useState, useCallback } from 'react';
import { FlexCell, PickerInput, Text, FlexRow } from '@epam/promo';
import {
    IEditable,
    LazyDataSourceApiRequest,
    useLazyDataSource,
    runDataQuery,
} from '@epam/uui-core';

export interface TagPickerProps extends IEditable<string[]> {
    tags?: string[];
}

export function TagPicker(props: TagPickerProps) {
    const getItems = useCallback(
        async (request: LazyDataSourceApiRequest<string, string>) => {
            const tags = props.tags ?? [];
            const allTags = [...tags];

            // add missing tags from value (some of them are new, and missing in tags array)
            if (props.value) {
                const existingByName = new Set<string>();
                tags.forEach((tag) => {
                    existingByName.add(tag);
                });
                props.value.forEach((tag) => {
                    if (!existingByName.has(tag)) {
                        allTags.push(tag);
                    }
                });
            }

            allTags.sort();

            console.log(allTags);

            let found = runDataQuery(allTags as any, request, (tag) => [tag]);
            console.log(found);

            if (request.search) {
                const newTag = request.search.trim();

                if (!allTags.some((t) => t === newTag)) {
                    found = {
                        items: [newTag, ...found.items],
                        count: found.count + 1,
                    };
                }
            }
            return found;
        },
        [props.value, props.tags],
    );

    const dataSource = useLazyDataSource<string, string, {}>(
        {
            api: getItems,
            selectAll: false,
            getId: (tag) => tag,
        },
        [getItems],
    );

    return (
        <PickerInput<string, string>
            dataSource={ dataSource }
            value={ props.value }
            getName={ (i) => i }
            onValueChange={ props.onValueChange }
            selectionMode="multi"
            valueType="entity"
            searchPosition="input"
            placeholder="Search or add new"
            renderNotFound={ () => <Text>Type to search or create a new tag</Text> }
            searchDebounceDelay={ 0 }
        />
    );
}

export function TagInputDemo() {
    const [value, onValueChange] = useState<string[]>(['red', 'green', 'blue']);

    return (
        <FlexCell width={ 500 }>
            <FlexRow padding="12" vPadding="12">
                <TagPicker
                    value={ value }
                    onValueChange={ onValueChange }
                    tags={ [
                        'tag',
                        'high priority',
                        'issue',
                        'release',
                        'component',
                        'important',
                    ] }
                />
            </FlexRow>
        </FlexCell>
    );
}
