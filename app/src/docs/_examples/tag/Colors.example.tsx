import React, { useState } from 'react';
import { FlexCell, FlexRow, RichTextView, Tag, TagProps } from '@epam/uui';
import { ReactComponent as MyIcon } from '@epam/assets/icons/common/action-account-18.svg';
import { ExampleProps } from '../types';
import { getAllPropValues } from '../utils';

export default function BasicExample(props: ExampleProps) {
    const [value] = useState<number | string>('99+');
    const colors = getAllPropValues('color', false, props) as TagProps['color'][];

    return (
        <FlexCell width="100%">
            <RichTextView><h6>Solid</h6></RichTextView>
            <FlexRow rawProps={ { style: { flexWrap: 'wrap' } } } rowGap="12" columnGap="12">
                { colors.map((color) => (
                    <Tag
                        key={ color }
                        color={ color }
                        icon={ MyIcon }
                        caption={ color.charAt(0).toUpperCase() + color.slice(1) }
                        count={ value }
                        onClick={ () => null }
                    />
                )) }
            </FlexRow>
            <RichTextView><h6>Outline</h6></RichTextView>
            <FlexRow rawProps={ { style: { flexWrap: 'wrap' } } } rowGap="12" columnGap="12">
                { colors.map((color) => (
                    <Tag
                        key={ color }
                        color={ color }
                        fill="outline"
                        icon={ MyIcon }
                        caption={ color.charAt(0).toUpperCase() + color.slice(1) }
                        count={ value }
                        onClick={ () => null }
                    />
                )) }
            </FlexRow>
        </FlexCell>
    );
}
