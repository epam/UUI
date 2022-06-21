import * as React from 'react';

interface FilterToolbarItemTogglerProps {
    value: string;
    title?: string;
}

export const FilterToolbarItemToggler = React.forwardRef<HTMLDivElement, FilterToolbarItemTogglerProps>((props, ref) => {
    return (
        <div>
            { `${props.title}: ${props.value}` }
        </div>
    );
});

